console.log('[WalmartSplit] Background service worker started');

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
    console.log('[WalmartSplit] Icon clicked, tab URL:', tab.url);

    if (!tab.id || !tab.url) return;

    // Defense-in-depth URL validation: use proper URL parsing, not string includes
    // Prevents matches like evil-walmart.com or walmart.com.attacker.com
    let tabUrl: URL;
    try {
        tabUrl = new URL(tab.url);
    } catch {
        return; // Unparseable URL — bail
    }

    const isWalmartHost = tabUrl.protocol === 'https:' &&
        (tabUrl.hostname === 'www.walmart.com' || tabUrl.hostname.endsWith('.walmart.com'));

    const isOrderPage = tabUrl.pathname.startsWith('/orders/') ||
        tabUrl.pathname.startsWith('/account/purchase-history');

    // If not on a Walmart order page, just open the split app directly
    if (!isWalmartHost) {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
        return;
    }

    if (!isOrderPage) {
        // On walmart.com but not an order page — warn and still open the app
        console.warn('[WalmartSplit] Not on an order page. Opening app without scraping.');
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
