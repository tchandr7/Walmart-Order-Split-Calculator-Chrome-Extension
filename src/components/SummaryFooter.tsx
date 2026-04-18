import React, { useState } from 'react';
import type { Participant, ReceiptData } from '../lib/types';
import { useSplitStore } from '../store/useSplitStore';
import { useCalculateSplit } from '../lib/useCalculateSplit';

interface Props {
    participants: Participant[];
    receipt: ReceiptData | null;
}

export const SummaryFooter: React.FC<Props> = ({ participants, receipt }) => {
    const { taxSplitMethod, tipSplitMethod, payerId } = useSplitStore();
    const splitData = useCalculateSplit();
    const [copied, setCopied] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    if (!receipt || !splitData) return null;

    const { ptStats, assignedTotal } = splitData;

    // ── Subtotal check: do item assignments sum to receipt.subtotal? ──
    const totalSub = Number(assignedTotal.toFixed(2));
    const rSub = Number(receipt.subtotal.toFixed(2));
    const subtotalBalances = Math.abs(totalSub - rSub) < 0.05;

    // ── Grand total check: do per-person totals sum to receipt.total? ──
    const distributedTotal = Number(
        Object.values(ptStats).reduce((sum, p) => sum + p.total, 0).toFixed(2)
    );
    const rTotal = Number(receipt.total.toFixed(2));
    const grandTotalBalances = subtotalBalances && Math.abs(distributedTotal - rTotal) < 0.05;
    const fullyBalanced = subtotalBalances && grandTotalBalances;

    const generateSummary = () => {
        const payerName = payerId ? participants.find(p => p.id === payerId)?.name || 'Payer' : 'Payer';
        let t = `🧾 Walmart Order Split Summary\n(Pay to: ${payerName})\n\n`;

        t += `Subtotal: $${receipt.subtotal.toFixed(2)}\n`;
        t += `Tax: $${receipt.tax.toFixed(2)}\n`;
        t += `Tip/Fees: ${(receipt.tip + receipt.fees).toFixed(2)}\n`;
        t += `Grand Total: $${receipt.total.toFixed(2)}\n\n`;

        participants.forEach(p => {
            if (ptStats[p.id].total > 0) {
                t += `👤 ${p.name}: $${ptStats[p.id].total.toFixed(2)}\n`;

                const pItems = receipt.items.filter(item => p.id in item.assignments && item.assignments[p.id] > 0);
                if (pItems.length > 0) {
                    pItems.forEach(item => {
                        t += `   ▫️ ${item.name} ($${item.assignments[p.id].toFixed(2)})\n`;
                    });
                }

                if (ptStats[p.id].tax > 0 || ptStats[p.id].tip > 0) {
                    t += `   ▫️ Tax ($${ptStats[p.id].tax.toFixed(2)}) & Tip/Fees ($${ptStats[p.id].tip.toFixed(2)})\n`;
                }
                t += `\n`;
            }
        });

        navigator.clipboard.writeText(t).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="sticky bottom-0 bg-white border-t sm:px-6 px-4 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 w-full">
            <div className="max-w-5xl mx-auto flex flex-col gap-4">

                {/* Breakdown View */}
                {showBreakdown && subtotalBalances && totalSub > 0 && (
                    <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 mb-2 max-h-48 overflow-y-auto">
                        <h5 className="font-semibold text-slate-700 mb-3 text-base flex justify-between">
                            <span>Logic Breakdown</span>
                            <span className="font-normal text-slate-500 text-sm">Sub + Tax + Tip = Total</span>
                        </h5>
                        <div className="flex flex-col gap-2">
                            {participants.filter(p => ptStats[p.id].total > 0).map(p => (
                                <div key={p.id} className="flex justify-between items-center text-base border-b border-slate-100 pb-3 mt-2 last:border-0 last:pb-0">
                                    <span className="font-medium text-slate-800">{p.name}</span>
                                    <div className="text-right text-slate-500 text-sm">
                                        <span>${ptStats[p.id].sub.toFixed(2)} + </span>
                                        <span title={`Tax: ${taxSplitMethod === 'even' ? 'Equal' : taxSplitMethod === 'proportional' ? 'Proportional' : 'Manual'}`} className="text-slate-400">${ptStats[p.id].tax.toFixed(2)} + </span>
                                        <span title={`Tip/Fees: ${tipSplitMethod === 'even' ? 'Equal' : tipSplitMethod === 'proportional' ? 'Proportional' : 'Manual'}`} className="text-slate-400">${ptStats[p.id].tip.toFixed(2)} = </span>
                                        <span className="font-bold text-slate-900 ml-1 text-base">${ptStats[p.id].total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        {/* Check 1: Subtotal */}
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold ${ subtotalBalances ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {subtotalBalances ? '✓' : '○'} Items
                            </span>
                            {subtotalBalances ? (
                                <span className="text-sm text-emerald-600">${ rSub.toFixed(2)} assigned</span>
                            ) : (
                                <span className="text-sm text-red-500 font-medium">${totalSub.toFixed(2)} / ${rSub.toFixed(2)}</span>
                            )}
                            {subtotalBalances && totalSub > 0 && (
                                <button
                                    onClick={() => setShowBreakdown(!showBreakdown)}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded transition-colors"
                                >
                                    {showBreakdown ? 'Hide' : 'View'} Logic
                                </button>
                            )}
                        </div>
                        {/* Check 2: Grand Total */}
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold ${ grandTotalBalances ? 'text-emerald-600' : subtotalBalances ? 'text-amber-500' : 'text-slate-400'}`}>
                                {grandTotalBalances ? '✓' : '○'} Grand Total
                            </span>
                            {grandTotalBalances ? (
                                <span className="text-sm text-emerald-600">${rTotal.toFixed(2)} distributed</span>
                            ) : subtotalBalances ? (
                                <span className="text-sm text-amber-600 font-medium">Assign tax &amp; tip to all participants</span>
                            ) : (
                                <span className="text-sm text-slate-400">Assign items first</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={generateSummary}
                        disabled={!fullyBalanced}
                        className={`
                            flex-grow md:max-w-xs font-bold w-full py-4 px-8 text-lg rounded-md transition-all duration-200 shadow-sm
                            ${fullyBalanced
                                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                        `}
                    >
                        {copied ? 'Copied to Clipboard! ✓' : 'Copy Summary'}
                    </button>
                </div>
            </div>
        </div>
    );
};
