import { useMemo } from 'react';
import { useSplitStore } from '../store/useSplitStore';

export const useCalculateSplit = () => {
    const { participants, receipt, taxSplitMethod, tipSplitMethod, taxManualAmounts, tipManualAmounts, taxExcludedIds, tipExcludedIds } = useSplitStore();

    return useMemo(() => {
        if (!receipt) return { ptStats: {}, assignedTotal: 0 };

        let assignedTotal = 0;
        const ptStats: Record<string, { sub: number, tax: number, tip: number, total: number }> = {};
        participants.forEach(p => ptStats[p.id] = { sub: 0, tax: 0, tip: 0, total: 0 });

        receipt.items.forEach(item => {
            Object.entries(item.assignments).forEach(([pId, amount]) => {
                assignedTotal += amount;
                if (ptStats[pId]) ptStats[pId].sub += amount;
            });
        });

        const activeParticipants = participants.filter(p => ptStats[p.id].sub > 0);

        // Tax
        const taxActive = activeParticipants.filter(p => !taxExcludedIds.includes(p.id));
        const taxActiveSubTotal = taxActive.reduce((s, p) => s + ptStats[p.id].sub, 0);
        const taxEvenShare = taxActive.length > 0 ? 1 / taxActive.length : 0;

        // Tip
        const tipActive = activeParticipants.filter(p => !tipExcludedIds.includes(p.id));
        const tipActiveSubTotal = tipActive.reduce((s, p) => s + ptStats[p.id].sub, 0);
        const tipEvenShare = tipActive.length > 0 ? 1 / tipActive.length : 0;

        participants.forEach(p => {
            if (ptStats[p.id].sub <= 0) return;

            // TAX
            if (taxSplitMethod === 'manual') {
                ptStats[p.id].tax = taxManualAmounts[p.id] ?? 0;
            } else if (taxExcludedIds.includes(p.id)) {
                ptStats[p.id].tax = 0;
            } else {
                const taxPropShare = taxActiveSubTotal > 0 ? ptStats[p.id].sub / taxActiveSubTotal : 0;
                const taxShare = taxSplitMethod === 'proportional' ? taxPropShare : taxEvenShare;
                ptStats[p.id].tax = taxShare * receipt.tax;
            }

            // TIP / FEES
            if (tipSplitMethod === 'manual') {
                ptStats[p.id].tip = tipManualAmounts[p.id] ?? 0;
            } else if (tipExcludedIds.includes(p.id)) {
                ptStats[p.id].tip = 0;
            } else {
                const tipPropShare = tipActiveSubTotal > 0 ? ptStats[p.id].sub / tipActiveSubTotal : 0;
                const tipShare = tipSplitMethod === 'proportional' ? tipPropShare : tipEvenShare;
                ptStats[p.id].tip = tipShare * (receipt.tip + receipt.fees);
            }

            ptStats[p.id].total = ptStats[p.id].sub + ptStats[p.id].tax + ptStats[p.id].tip;
        });

        return { ptStats, assignedTotal };
    }, [participants, receipt, taxSplitMethod, tipSplitMethod, taxManualAmounts, tipManualAmounts, taxExcludedIds, tipExcludedIds]);
};
