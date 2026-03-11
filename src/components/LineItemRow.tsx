import React, { useState } from 'react';
import type { Participant, ReceiptItem } from '../lib/types';
import { Scissors, CheckCircle } from 'lucide-react';
import { ParticipantPill } from './ParticipantPill';

interface Props {
    item: ReceiptItem;
    participants: Participant[];
    onToggle: (participantId: string) => void;
    onCustomSet: (participantId: string, amount: number) => void;
    onSplitQuantity?: () => void;
    onUndoSplit?: () => void;
    onConfirm: () => void;
}

export const LineItemRow: React.FC<Props> = ({ item, participants, onToggle, onCustomSet, onSplitQuantity, onUndoSplit, onConfirm }) => {
    const [isCustomOpen, setIsCustomOpen] = useState(false);

    const assignedSum = Object.values(item.assignments).reduce((a, b) => a + Number(b), 0);
    const remaining = Number((item.price - assignedSum).toFixed(2));
    const hasAssignments = Object.keys(item.assignments).length > 0;
    const isBalanced = remaining === 0 && hasAssignments;
    const isConfirmed = !!item.isConfirmed;

    return (
        <div className={`p-4 border-b border-slate-300 transition-all duration-200 ${isConfirmed ? 'opacity-55 bg-slate-50' : 'bg-white'}`}>

            {/* Top row: name + price/status */}
            <div className="flex justify-between items-start mb-3 gap-8">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg text-slate-900 font-medium leading-snug">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">Qty: {item.quantity}</span>
                        {item.quantity > 1 && (
                            <>
                                <span className="text-sm text-slate-400">(${(item.price / item.quantity).toFixed(2)} ea)</span>
                                {onSplitQuantity && (
                                    <button
                                        onClick={onSplitQuantity}
                                        className="text-xs font-medium text-slate-500 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 px-2 py-0.5 rounded transition-colors ml-2 flex items-center gap-1"
                                        title="Split into individual items"
                                    >
                                        <Scissors size={12} strokeWidth={2} />
                                        Split {item.quantity} Ways
                                    </button>
                                )}
                            </>
                        )}
                        {item.splitFromId && onUndoSplit && (
                            <button
                                onClick={onUndoSplit}
                                className="text-xs font-medium text-amber-600 bg-amber-100 hover:bg-amber-200 hover:text-amber-800 px-2 py-0.5 rounded transition-colors ml-2"
                                title="Undo split and merge back with other identical items"
                            >
                                Undo Split
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 min-w-[88px] text-right">
                    <p className="text-lg font-semibold text-slate-900">${item.price.toFixed(2)}</p>
                    {!isConfirmed && !isBalanced && hasAssignments && (
                        <p className="text-sm text-red-500 font-medium">${remaining.toFixed(2)} left</p>
                    )}
                    {!isConfirmed && isBalanced && (
                        <p className="text-sm text-emerald-500 font-medium">Ready</p>
                    )}
                    {isConfirmed && (
                        <p className="text-sm text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle size={14} /> Done
                        </p>
                    )}
                </div>
            </div>

            {/* Pills + Confirm row */}
            <div className="flex flex-wrap gap-2 items-center">
                {participants.map(p => (
                    <ParticipantPill
                        key={p.id}
                        name={p.name}
                        isActive={p.id in item.assignments}
                        onClick={() => onToggle(p.id)}
                    />
                ))}
                {isBalanced && (
                    <button
                        onClick={onConfirm}
                        className={`ml-auto text-sm font-semibold px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${isConfirmed
                            ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-sm'
                            }`}
                    >
                        <CheckCircle size={14} />
                        {isConfirmed ? 'Unconfirm' : 'Confirm'}
                    </button>
                )}
            </div>

            {/* Secondary action: Adjust individual amounts */}
            <div className="mt-2">
                <button
                    onClick={() => setIsCustomOpen(!isCustomOpen)}
                    className="text-xs text-slate-400 hover:text-slate-600 focus:outline-none flex items-center gap-1 transition-colors"
                >
                    <span>{isCustomOpen ? '▲' : '▼'}</span>
                    {isCustomOpen ? 'Hide amount overrides' : 'Adjust individual amounts'}
                </button>
            </div>

            {/* Amount overrides panel */}
            {isCustomOpen && (
                <div className="mt-3 p-4 bg-slate-50 border border-slate-300 rounded-md">
                    <p className="text-sm font-semibold text-slate-600 mb-3">Amount Overrides</p>
                    {participants.filter(p => p.id in item.assignments).map(p => (
                        <div key={p.id} className="flex justify-between items-center mb-3 last:mb-0">
                            <span className="text-base text-slate-700">{p.name}</span>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={item.price > 0 && (item.assignments[p.id] ?? 0) > 0
                                            ? Math.round(((item.assignments[p.id] || 0) / item.price) * 100)
                                            : ''}
                                        onChange={(e) => {
                                            const pct = parseFloat(e.target.value) || 0;
                                            const amount = (pct / 100) * item.price;
                                            onCustomSet(p.id, Number(amount.toFixed(2)));
                                        }}
                                        placeholder="0"
                                        className="w-16 border border-slate-300 rounded px-2 py-1.5 text-base focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
                                    />
                                    <span className="text-slate-400 font-medium">%</span>
                                </div>
                                <span className="text-slate-300">=</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400 font-medium">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.assignments[p.id]}
                                        onChange={(e) => onCustomSet(p.id, parseFloat(e.target.value) || 0)}
                                        className="w-24 border border-slate-300 rounded px-2 py-1.5 text-base focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.keys(item.assignments).length === 0 && (
                        <p className="text-sm text-slate-500">Assign participants first to adjust amounts.</p>
                    )}
                </div>
            )}
        </div>
    );
};
