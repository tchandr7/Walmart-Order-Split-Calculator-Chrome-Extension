import React, { useEffect, useState } from 'react';
import { useSplitStore } from './store/useSplitStore';
import { LineItemRow } from './components/LineItemRow';
import { SummaryFooter } from './components/SummaryFooter';
import type { ReceiptData } from './lib/types';

function App() {
  const {
    participants, receipt, setReceipt, addParticipant, removeParticipant,
    toggleItemAssignment, setCustomAssignment, clearStore,
    taxSplitMethod, tipSplitMethod, setTaxSplitMethod, setTipSplitMethod,
    taxManualAmounts, tipManualAmounts, setManualTaxAmount, setManualTipAmount,
    taxExcludedIds, tipExcludedIds, setTaxExcludedIds, setTipExcludedIds,
    payerId, setPayerId, addParticipantAndSetPayer, splitItemByQuantity, undoSplitQuantity, confirmItem, renameParticipant
  } = useSplitStore();

  const [newName, setNewName] = useState('');
  const [newPayerName, setNewPayerName] = useState('');
  const [isPayerOpen, setIsPayerOpen] = useState(false);
  const [isRenamingMe, setIsRenamingMe] = useState(false);
  const [meNameDraft, setMeNameDraft] = useState('');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['walmartReceiptData'], (result) => {
        if (result.walmartReceiptData) {
          setReceipt(result.walmartReceiptData as ReceiptData);
          chrome.storage.local.remove(['walmartReceiptData']);
        }
      });
    }
  }, []);

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addParticipant(newName.trim());
      setNewName('');
    }
  };

  const saveRenameMe = () => {
    if (meNameDraft.trim()) renameParticipant('1', meNameDraft.trim());
    setIsRenamingMe(false);
  };

  const loadDummyData = () => {
    setReceipt({
      items: [
        { id: '1', name: 'Fresh Chicken Breasts', price: 25.00, quantity: 2, assignments: {} },
        { id: '2', name: 'Organic Bananas', price: 2.30, quantity: 1, assignments: {} },
        { id: '3', name: 'Whole Milk 1 Gal', price: 10.35, quantity: 3, assignments: {} },
        { id: '4', name: 'Paper Towels 6-pk', price: 14.99, quantity: 1, assignments: {} }
      ],
      subtotal: 52.64,
      tax: 4.50,
      tip: 10.00,
      fees: 2.00,
      total: 69.14
    });
  };

  const splitTypeButtons = (
    method: 'proportional' | 'even' | 'manual',
    setter: (m: typeof method) => void
  ) => (
    <div className="flex items-center gap-2 mt-0.5">
      <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">Split Type:</span>
      {(['even', 'proportional', 'manual'] as const).map(m => {
        const label = m === 'even' ? 'Equal' : m === 'proportional' ? 'Proportional' : 'Manual';
        return (
          <button key={m} onClick={() => setter(m as typeof method)}
            className={`text-xs px-2.5 py-1 rounded border ${method === m ? 'bg-slate-700 border-slate-700 text-white font-medium' : 'bg-transparent border-slate-400 text-slate-600 hover:border-slate-500 hover:text-slate-800'}`}>
            {label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 font-sans">
      <header className="bg-white w-full shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Walmart Split</h1>
          {receipt && (
            <button onClick={clearStore} className="text-xs text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors font-medium">
              Clear Data
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto p-4 flex flex-col gap-6 mb-24">
        {!receipt ? (
          <div className="text-center py-20 bg-white shadow-sm border border-slate-300 mt-10 rounded-xl">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Ready to Split</h2>
            <p className="text-slate-500">Go to Walmart.com order details and click the extension.</p>
            <button onClick={loadDummyData} className="mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200">
              Load Demo Data
            </button>
          </div>
        ) : (
          <div className="fade-in animate flex flex-col gap-6">

            {/* Payer Setup */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">Payer</span>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {participants.find(p => p.id === payerId)?.name || 'Select Payer'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsPayerOpen(!isPayerOpen)}
                  className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline px-3 py-1.5 rounded-md transition-colors"
                >
                  {isPayerOpen ? 'Cancel' : 'Change'}
                </button>
              </div>

              {isPayerOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 fade-in animate">
                  <p className="text-base text-slate-500 mb-3">Select who paid for this order:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {participants.map(p => (
                      <button
                        key={`payer-${p.id}`}
                        onClick={() => { setPayerId(p.id); setIsPayerOpen(false); }}
                        className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-75 border
                          ${payerId === p.id ? 'bg-emerald-600 text-white border-emerald-600 font-bold' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (newPayerName.trim()) {
                      addParticipantAndSetPayer(newPayerName.trim());
                      setNewPayerName('');
                      setIsPayerOpen(false);
                    }
                  }} className="flex gap-2">
                    <input
                      type="text"
                      value={newPayerName}
                      onChange={(e) => setNewPayerName(e.target.value)}
                      placeholder="Or add a new name..."
                      className="flex-1 border border-slate-300 rounded-md px-4 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button type="submit" className="bg-slate-100 text-slate-700 px-4 py-2 text-base font-medium rounded-md hover:bg-slate-200">
                      Add & Select
                    </button>
                  </form>
                </div>
              )}
            </section>

            {/* Roster Setup */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Roster</h2>
              <form onSubmit={handleAddParticipant} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Type name & hit Enter"
                  className="flex-1 border border-slate-300 rounded-md px-4 py-1.5 h-[42px] text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:font-normal placeholder:text-base"
                />
              </form>
              <div className="flex flex-wrap gap-2">
                {participants.map(p => (
                  <div key={p.id} className="group relative">
                    {p.id === '1' ? (
                      isRenamingMe ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            type="text"
                            value={meNameDraft}
                            onChange={(e) => setMeNameDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveRenameMe(); if (e.key === 'Escape') setIsRenamingMe(false); }}
                            placeholder={p.name}
                            className="border border-blue-400 rounded-full px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-32"
                          />
                          <button onClick={saveRenameMe} className="text-xs text-blue-600 font-semibold hover:underline">Save</button>
                          <button onClick={() => setIsRenamingMe(false)} className="text-xs text-slate-400 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <span className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-full text-base inline-flex items-center gap-2">
                          {p.name}
                          <button
                            onClick={() => { setMeNameDraft(p.name === 'Me' ? '' : p.name); setIsRenamingMe(true); }}
                            className="text-slate-400 hover:text-blue-500 transition-colors text-xs"
                            title="Set your name (optional)"
                          >
                            ✏️
                          </button>
                        </span>
                      )
                    ) : (
                      <span className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-full text-base inline-flex items-center gap-2">
                        {p.name}
                        <button
                          onClick={() => removeParticipant(p.id)}
                          className="text-slate-400 hover:text-red-500 hidden group-hover:inline transition-colors"
                          title="Remove"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Receipt Items */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-300">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{receipt.items.length} Items</h2>
              </div>
              <div>
                {receipt.items.map(item => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    participants={participants}
                    onToggle={(pId) => toggleItemAssignment(item.id, pId)}
                    onCustomSet={(pId, amt) => setCustomAssignment(item.id, pId, amt)}
                    onSplitQuantity={() => splitItemByQuantity(item.id)}
                    onUndoSplit={item.splitFromId ? () => undoSplitQuantity(item.splitFromId!) : undefined}
                    onConfirm={() => confirmItem(item.id)}
                  />
                ))}
              </div>
            </section>

            {/* Order Totals */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-300 p-5">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Order Totals</h2>

              <div className="flex justify-between text-base text-slate-700 mb-1">
                <span>Subtotal</span>
                <span className="font-medium">${receipt.subtotal.toFixed(2)}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between items-start text-base text-slate-700 mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium">Tax</span>
                  {splitTypeButtons(taxSplitMethod, setTaxSplitMethod)}
                  {taxSplitMethod !== 'manual' && (
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Exclude:</span>
                      {participants.map(p => {
                        const isExcluded = taxExcludedIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => setTaxExcludedIds(
                              isExcluded ? taxExcludedIds.filter(id => id !== p.id) : [...taxExcludedIds, p.id]
                            )}
                            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${isExcluded
                                ? 'bg-red-50 border-red-300 text-red-600 line-through'
                                : 'bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400'
                              }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {taxSplitMethod === 'manual' && (
                    <div className="mt-2 flex flex-col gap-2 bg-slate-50 border border-slate-300 rounded-md p-3">
                      {participants.map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-700 min-w-[60px]">{p.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-sm">$</span>
                            <input type="number" min="0" step="0.01" value={taxManualAmounts[p.id] ?? ''} onChange={(e) => setManualTaxAmount(p.id, parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-20 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-medium pt-0.5">${receipt.tax.toFixed(2)}</span>
              </div>

              {/* Tip & Fees */}
              <div className="flex justify-between items-start text-base text-slate-700 mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium">Tip &amp; Fees</span>
                  {splitTypeButtons(tipSplitMethod, setTipSplitMethod)}
                  {tipSplitMethod !== 'manual' && (
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Exclude:</span>
                      {participants.map(p => {
                        const isExcluded = tipExcludedIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => setTipExcludedIds(
                              isExcluded ? tipExcludedIds.filter(id => id !== p.id) : [...tipExcludedIds, p.id]
                            )}
                            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${isExcluded
                                ? 'bg-red-50 border-red-300 text-red-600 line-through'
                                : 'bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400'
                              }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {tipSplitMethod === 'manual' && (
                    <div className="mt-2 flex flex-col gap-2 bg-slate-50 border border-slate-300 rounded-md p-3">
                      {participants.map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-700 min-w-[60px]">{p.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-sm">$</span>
                            <input type="number" min="0" step="0.01" value={tipManualAmounts[p.id] ?? ''} onChange={(e) => setManualTipAmount(p.id, parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-20 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-medium pt-0.5">${(receipt.tip + receipt.fees).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg text-slate-900 font-bold mt-4 pt-4 border-t border-slate-100">
                <span>Grand Total</span>
                <span className="text-xl">${receipt.total.toFixed(2)}</span>
              </div>
            </section>

          </div>
        )}
      </main>

      <SummaryFooter participants={participants} receipt={receipt} />
    </div>
  );
}

export default App;
