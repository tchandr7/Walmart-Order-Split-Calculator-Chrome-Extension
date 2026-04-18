import React, { useState } from 'react';
import { useSplitStore } from '../store/useSplitStore';
import { useCalculateSplit } from '../lib/useCalculateSplit';

export const RunningSplitWidget: React.FC = () => {
    const { receipt, participants, payerId } = useSplitStore();
    const splitData = useCalculateSplit();
    const [copied, setCopied] = useState(false);

    if (!receipt || !splitData) return null;
    const { ptStats, assignedTotal } = splitData;
    const activeParticipants = participants.filter(p => ptStats[p.id].total > 0);

    const generateSummary = () => {
        const payerName = payerId ? participants.find(p => p.id === payerId)?.name || 'Payer' : 'Payer';
        let t = `🧾 Walmart Order Split Summary\n(Pay to: ${payerName})\n\n`;

        // Calculate actual utilized totals
        const actualSub = Object.values(ptStats).reduce((sum, p) => sum + p.sub, 0);
        const actualTax = Object.values(ptStats).reduce((sum, p) => sum + p.tax, 0);
        const actualTip = Object.values(ptStats).reduce((sum, p) => sum + p.tip, 0);
        const actualTotal = Object.values(ptStats).reduce((sum, p) => sum + p.total, 0);

        t += `Subtotal: $${actualSub.toFixed(2)}\n`;
        t += `Tax: $${actualTax.toFixed(2)}\n`;
        t += `Tip/Fees: $${actualTip.toFixed(2)}\n`;
        t += `Grand Total: $${actualTotal.toFixed(2)}\n\n`;

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
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200 p-5 sticky top-6">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h2 className="text-[1.1rem] font-bold text-slate-800 tracking-tight">Running Split</h2>
                <div className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                    ${assignedTotal.toFixed(2)} Base
                </div>
            </div>

            {activeParticipants.length === 0 ? (
                <div className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    Assign items to see the split.
                </div>
            ) : (
                <div className="flex flex-col gap-3 mb-5 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                    {activeParticipants.map(p => (
                        <div key={p.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                            <span className="font-semibold text-slate-700">{p.name}</span>
                            <div className="text-right flex flex-col">
                                <span className="font-bold text-slate-900 text-base">
                                    ${ptStats[p.id].total.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                                    Sub ${ptStats[p.id].sub.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={generateSummary}
                disabled={activeParticipants.length === 0}
                className={`
                    w-full py-3.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 
                    ${activeParticipants.length > 0
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform active:scale-[0.98]'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
            >
                {copied ? '✓ Copied to Clipboard' : 'Copy Running Summary'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-3 leading-tight px-2">
                This running summary only includes items that have been assigned.
            </p>
        </div>
    );
};
