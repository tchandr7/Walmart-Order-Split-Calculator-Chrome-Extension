import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReceiptData, Participant, ReceiptItem } from '../lib/types';

export type SplitMethod = 'proportional' | 'even' | 'manual';

interface SplitState {
    participants: Participant[];
    receipt: ReceiptData | null;
    payerId: string | null;
    taxSplitMethod: SplitMethod;
    tipSplitMethod: SplitMethod;
    taxManualAmounts: Record<string, number>;
    tipManualAmounts: Record<string, number>;
    taxExcludedIds: string[];
    tipExcludedIds: string[];

    // Actions
    setPayerId: (id: string | null) => void;
    setReceipt: (data: ReceiptData) => void;
    addParticipant: (name: string) => void;
    addParticipantAndSetPayer: (name: string) => void;
    removeParticipant: (id: string) => void;
    renameParticipant: (id: string, name: string) => void;
    toggleItemAssignment: (itemId: string, participantId: string) => void;
    setCustomAssignment: (itemId: string, participantId: string, amount: number) => void;
    splitItemByQuantity: (itemId: string) => void;
    undoSplitQuantity: (originalItemId: string) => void;
    confirmItem: (itemId: string) => void;
    setTaxSplitMethod: (method: SplitMethod) => void;
    setTipSplitMethod: (method: SplitMethod) => void;
    setManualTaxAmount: (participantId: string, amount: number) => void;
    setManualTipAmount: (participantId: string, amount: number) => void;
    setTaxExcludedIds: (ids: string[]) => void;
    setTipExcludedIds: (ids: string[]) => void;
    clearStore: () => void;
}

export const useSplitStore = create<SplitState>()(
    persist(
        (set) => ({
            participants: [{ id: '1', name: 'Me' }],
            receipt: null,
            payerId: '1',
            taxSplitMethod: 'proportional',
            tipSplitMethod: 'proportional',
            taxManualAmounts: {},
            tipManualAmounts: {},
            taxExcludedIds: [],
            tipExcludedIds: [],

            // Loading a new receipt clears order-specific state but keeps roster & preferences
            setReceipt: (data) => set({
                receipt: data,
                taxManualAmounts: {},
                tipManualAmounts: {},
                taxExcludedIds: [],
                tipExcludedIds: [],
            }),
            setPayerId: (id) => set({ payerId: id }),
            setTaxSplitMethod: (method) => set({ taxSplitMethod: method }),
            setTipSplitMethod: (method) => set({ tipSplitMethod: method }),
            setTaxExcludedIds: (ids) => set({ taxExcludedIds: ids }),
            setTipExcludedIds: (ids) => set({ tipExcludedIds: ids }),
            setManualTaxAmount: (participantId, amount) => set((state) => ({
                taxManualAmounts: { ...state.taxManualAmounts, [participantId]: amount }
            })),
            setManualTipAmount: (participantId, amount) => set((state) => ({
                tipManualAmounts: { ...state.tipManualAmounts, [participantId]: amount }
            })),

            renameParticipant: (id, name) => set((state) => ({
                participants: state.participants.map(p => p.id === id ? { ...p, name } : p)
            })),

            addParticipant: (name) => set((state) => ({
                participants: [...state.participants, { id: Date.now().toString(), name }]
            })),

            addParticipantAndSetPayer: (name) => set((state) => {
                const id = Date.now().toString();
                return {
                    participants: [...state.participants, { id, name }],
                    payerId: id
                };
            }),

            removeParticipant: (id) => set((state) => {
                const newParticipants = state.participants.filter(p => p.id !== id);
                const newReceipt = state.receipt ? { ...state.receipt } : null;
                if (newReceipt) {
                    newReceipt.items = newReceipt.items.map(item => {
                        const newAssignments = { ...item.assignments };
                        delete newAssignments[id];
                        const activeIds = Object.keys(newAssignments);
                        if (activeIds.length > 0) {
                            const equalShare = item.price / activeIds.length;
                            activeIds.forEach(pId => { newAssignments[pId] = equalShare; });
                        }
                        return { ...item, assignments: newAssignments };
                    });
                }
                return {
                    participants: newParticipants,
                    receipt: newReceipt,
                    payerId: state.payerId === id ? null : state.payerId
                };
            }),

            toggleItemAssignment: (itemId, participantId) => set((state) => {
                if (!state.receipt) return state;
                const newItems = state.receipt.items.map(item => {
                    if (item.id === itemId) {
                        const assignments = { ...item.assignments };
                        if (assignments[participantId] !== undefined) {
                            delete assignments[participantId];
                        } else {
                            assignments[participantId] = 0;
                        }
                        const activeIds = Object.keys(assignments);
                        if (activeIds.length > 0) {
                            const equalShare = Number((item.price / activeIds.length).toFixed(2));
                            activeIds.forEach(pId => { assignments[pId] = equalShare; });
                            const sum = activeIds.reduce((acc, pId) => acc + assignments[pId], 0);
                            if (sum !== item.price) {
                                const diff = Number((item.price - sum).toFixed(2));
                                assignments[activeIds[0]] = Number((assignments[activeIds[0]] + diff).toFixed(2));
                            }
                        }
                        return { ...item, assignments, isConfirmed: false };
                    }
                    return item;
                });
                return { receipt: { ...state.receipt, items: newItems } };
            }),

            setCustomAssignment: (itemId, participantId, amount) => set((state) => {
                if (!state.receipt) return state;
                const newItems = state.receipt.items.map(item => {
                    if (item.id === itemId) {
                        const assignments = { ...item.assignments };
                        assignments[participantId] = amount < 0 ? 0 : amount;
                        return { ...item, assignments };
                    }
                    return item;
                });
                return { receipt: { ...state.receipt, items: newItems } };
            }),

            splitItemByQuantity: (itemId) => set((state) => {
                if (!state.receipt) return state;
                const newItems = [...state.receipt.items];
                const itemIndex = newItems.findIndex(i => i.id === itemId);
                if (itemIndex > -1) {
                    const item = newItems[itemIndex];
                    if (item.quantity > 1) {
                        const unitPrice = Number((item.price / item.quantity).toFixed(2));
                        // Mark them heavily so we can undo this action easily
                        const splitItems = Array.from({ length: item.quantity }).map((_, i) => ({
                            id: `${item.id}-split-${i + 1}-${Date.now()}`,
                            name: item.name,
                            price: unitPrice,
                            quantity: 1,
                            assignments: {},
                            splitFromId: item.id
                        }));
                        newItems.splice(itemIndex, 1, ...splitItems);
                    }
                }
                return { receipt: { ...state.receipt, items: newItems } };
            }),

            undoSplitQuantity: (originalItemId) => set((state) => {
                if (!state.receipt) return state;
                
                const newItems: ReceiptItem[] = [];
                let mergedPrice = 0;
                let mergedQuantity = 0;
                let mergedName = '';
                let firstIndex = -1;
                
                state.receipt.items.forEach((item) => {
                    if (item.splitFromId === originalItemId) {
                        mergedPrice += item.price;
                        mergedQuantity += item.quantity;
                        mergedName = item.name;
                        if (firstIndex === -1) firstIndex = newItems.length;
                    } else {
                        newItems.push(item);
                    }
                });

                if (mergedQuantity > 0) {
                    const originalItem: ReceiptItem = {
                        id: originalItemId,
                        name: mergedName,
                        price: Number(mergedPrice.toFixed(2)),
                        quantity: mergedQuantity,
                        assignments: {},
                        isConfirmed: false
                    };
                    
                    if (firstIndex > -1) {
                        newItems.splice(firstIndex, 0, originalItem);
                    } else {
                        newItems.push(originalItem);
                    }
                }
                
                return { receipt: { ...state.receipt, items: newItems } };
            }),

            confirmItem: (itemId) => set((state) => {
                if (!state.receipt) return state;
                const newItems = state.receipt.items.map(item =>
                    item.id === itemId ? { ...item, isConfirmed: !item.isConfirmed } : item
                );
                return { receipt: { ...state.receipt, items: newItems } };
            }),

            clearStore: () => set({
                receipt: null,
                payerId: '1',
                participants: [{ id: '1', name: 'Me' }],
                taxSplitMethod: 'proportional',
                tipSplitMethod: 'proportional',
                taxManualAmounts: {},
                tipManualAmounts: {},
                taxExcludedIds: [],
                tipExcludedIds: [],
            })
        }),
        {
            name: 'walmart-split-storage',
            version: 4, // Added taxExcludedIds / tipExcludedIds
        }
    )
);
