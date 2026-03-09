console.log('[WalmartSplit] Background service worker started');

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
    console.log('[WalmartSplit] Icon clicked, tab URL:', tab.url);

    if (!tab.id) return;

    // If not on a Walmart page, just open the split app directly
    if (!tab.url?.includes('walmart.com')) {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
        return;
    }

    // Try sending to already-injected content script first
    chrome.tabs.sendMessage(tab.id, { action: 'extract_receipt' }, () => {
        if (chrome.runtime.lastError) {
            // Content script not loaded (tab was open before extension loaded)
            // → inject it programmatically, then send the message
            console.log('[WalmartSplit] Content script not ready, injecting now...', chrome.runtime.lastError.message);

            const manifest = chrome.runtime.getManifest();
            const files = manifest.content_scripts?.[0]?.js;

            if (files && tab.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id! },
                    files: files
                }).then(() => {
                    console.log('[WalmartSplit] Content script injected. Sending message...');
                    // Small delay to let the script register its listener
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tab.id!, { action: 'extract_receipt' });
                    }, 100);
                }).catch((err) => {
                    console.error('[WalmartSplit] Failed to inject content script:', err);
                });
            }
        }
    });
});
