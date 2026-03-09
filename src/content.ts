console.log('[WalmartSplit] Content script loaded');

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Try multiple selectors, return the first match's trimmed text */
function queryText(selectors: string[], root: Document | Element = document): string {
    for (const sel of selectors) {
        try {
            const el = root.querySelector(sel);
            if (el?.textContent?.trim()) return el.textContent.trim();
        } catch (_) { /* invalid selector, skip */ }
    }
    return '';
}

/** Parse a dollar string like "$12.34" or "12.34" → number */
function parseDollar(str: string): number {
    const n = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
}

/** Find a financial summary amount by label keyword — uses maincontent-aware sibling lookup */
function findSummaryAmount(keywords: string[]): number {
    const root = document.querySelector('[data-testid="maincontent"]') || document;
    const leafs = Array.from(root.querySelectorAll('span, div, td')).filter(e => e.children.length === 0);

    for (const el of leafs) {
        const text = el.textContent?.trim() || '';
        const lower = text.toLowerCase();

        // Keyword must start the text (e.g. "Tax $2.77" starts with "tax")
        // Use startsWith to avoid "subtotal" matching when looking for "total"
        const matched = keywords.some(k => lower === k || lower.startsWith(k + ' ') || lower.startsWith(k + '$'));
        if (!matched) continue;

        // Pattern 1: Combined label+value in one leaf ("Tax $2.77")
        const m1 = text.match(/\$[\d,]+\.?\d*/g);
        if (m1) return parseDollar(m1[0]);

        // Pattern 2: Label-only leaf — look at the NEXT siblings in the same parent for a dollar amount
        const parent = el.parentElement;
        if (!parent) continue;
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(el);
        for (let j = idx + 1; j < siblings.length; j++) {
            const sibText = siblings[j].textContent?.trim() || '';
            const m2 = sibText.match(/^\$[\d,]+\.?\d*$/);
            if (m2) return parseDollar(m2[0]);
        }
        // Wider net: any dollar amount in any next sibling text
        for (let j = idx + 1; j < siblings.length; j++) {
            const sibText = siblings[j].textContent?.trim() || '';
            const m3 = sibText.match(/\$[\d,]+\.?\d*/g);
            if (m3) return parseDollar(m3[0]);
        }
    }
    return 0;
}

// ─────────────────────────────────────────────────────────────
// PRODUCT NAME GUARD
// ─────────────────────────────────────────────────────────────

const NAV_KEYWORDS = [
    'my account', 'purchase history', 'order details', 'order history',
    'sign in', 'sign out', 'track order', 'returns', 'reorder', 'help',
    'cart', 'wishlist', 'account', 'settings', 'addresses', 'wallet'
];

function isLikelyProductName(name: string): boolean {
    if (!name || name.length < 4) return false;
    const lower = name.toLowerCase().trim();
    if (NAV_KEYWORDS.some(k => lower === k || lower.startsWith(k))) return false;
    // Nav links tend to be short (< 3 words) and contain no numbers
    const wordCount = lower.split(/\s+/).length;
    if (wordCount <= 2 && !/\d/.test(name)) return false;
    return true;
}

// ─────────────────────────────────────────────────────────────
// ITEM EXTRACTION
// ─────────────────────────────────────────────────────────────

interface RawItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    assignments: Record<string, number>;
}

function extractItems(): RawItem[] {
    const items: RawItem[] = [];

    // ── Strategy 1: Confirmed data-testid selectors from live Walmart order page ──
    const itemContainerSelectors = [
        '[data-testid="itemtile-stack"]',   // ✅ confirmed from live DOM
        '[data-testid="order-item"]',
        '[data-testid="item-tile"]',
        '[class*="order-item"]',
        '[class*="OrderItem"]',
    ];

    let itemEls: Element[] = [];
    for (const sel of itemContainerSelectors) {
        const found = Array.from(document.querySelectorAll(sel));
        if (found.length > 0) {
            console.log(`[WalmartSplit] Items found via selector: ${sel} (${found.length})`);
            itemEls = found;
            break;
        }
    }

    for (const el of itemEls) {
        const name = queryText([
            '[data-testid="productName"]',       // ✅ confirmed
            '[data-testid="item-name"]',
            'h3', 'h4',
        ], el);

        const priceText = queryText([
            '[data-testid="line-price"]',         // ✅ confirmed (total line price)
            '[data-testid="item-price"]',
            '[class*="price"]',
        ], el);

        // Quantity: ONLY match explicit "Qty N" or "Quantity: N" patterns.
        // Avoid \b because adjacent elements in textContent have no spaces (e.g. "BagQty 3").
        // Sanity cap at 99 — reject false positives from product descriptions like "60-80 Count".
        const tileText = el.textContent || '';
        const qtyMatch =
            tileText.match(/Qty[:\s]+(\d+)/i) ||
            tileText.match(/Quantity[:\s]+(\d+)/i) ||
            tileText.match(/[×x]\s*(\d+)/);
        const rawQty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        const qty = rawQty > 0 && rawQty <= 99 ? rawQty : 1;
        const rawPrice = parseDollar(priceText);

        if (name && rawPrice > 0) {
            items.push({
                id: Date.now().toString() + Math.random(),
                name,
                price: rawPrice,
                quantity: qty,
                assignments: {}
            });
        } else if (name) {
            console.warn(`[WalmartSplit] Item "${name}" had no parseable price. Raw: "${priceText}"`);
        }
    }

    // ── Strategy 2: JSON-LD structured data ──
    if (items.length === 0) {
        console.log('[WalmartSplit] Trying JSON-LD extraction...');
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        for (const s of scripts) {
            try {
                const data = JSON.parse(s.textContent || '');
                const type = data?.['@type'] || '';
                // Skip breadcrumb, webpage, and other non-order schemas
                if (['BreadcrumbList', 'WebPage', 'WebSite', 'Organization', 'SiteNavigationElement'].includes(type)) {
                    console.log(`[WalmartSplit] JSON-LD: skipping schema type "${type}"`);
                    continue;
                }
                console.log(`[WalmartSplit] JSON-LD: inspecting schema type "${type}"`);

                // Handle Order schema → acceptedOffer / orderedItem
                const orderItems = data?.acceptedOffer || data?.orderedItem || data?.offers || [];
                const candidates = Array.isArray(orderItems) ? orderItems : [orderItems];

                for (const offer of candidates) {
                    const name = offer.name || offer.item?.name || offer.itemOffered?.name || '';
                    const price = parseDollar(String(offer.price || offer.item?.price || offer.itemOffered?.price || '0'));
                    const qty = offer.orderQuantity || offer.quantity || 1;
                    if (name && price > 0 && isLikelyProductName(name)) {
                        items.push({
                            id: Date.now().toString() + Math.random(),
                            name,
                            price,
                            quantity: qty,
                            assignments: {}
                        });
                    } else {
                        console.log(`[WalmartSplit] JSON-LD: skipped "${name}" (price: ${price})`);
                    }
                }
            } catch (_) { /* malformed JSON, skip */ }
        }
    }

    // ── Strategy 3: scan all visible price/name pairs (last resort) ──
    if (items.length === 0) {
        console.log('[WalmartSplit] Falling back to broad scan...');
        const links = Array.from(document.querySelectorAll('a[href*="/ip/"]'));
        for (const link of links) {
            const name = link.textContent?.trim();
            const parent = link.closest('li, [class*="item"], [class*="product"], div') as Element | null;
            if (!parent || !name || !isLikelyProductName(name)) continue;
            const priceEl = parent.querySelector('[class*="price"], [class*="Price"]');
            const priceText = priceEl?.textContent?.trim() || '';
            const price = parseDollar(priceText);
            if (price > 0) {
                items.push({
                    id: Date.now().toString() + Math.random(),
                    name,
                    price,
                    quantity: 1,
                    assignments: {}
                });
            }
        }
    }

    console.log(`[WalmartSplit] Extracted ${items.length} item(s):`, items.map(i => `${i.name} x${i.quantity} = $${i.price}`));
    return items;
}

// ─────────────────────────────────────────────────────────────
// ORDER TOTALS EXTRACTION
// ─────────────────────────────────────────────────────────────

interface OrderTotals {
    subtotal: number;
    tax: number;
    tip: number;
    fees: number;
    total: number;
}

function extractTotals(): OrderTotals {
    const grossSubtotal = findSummaryAmount(['subtotal', 'items subtotal', 'merchandise']);
    const savings = findSummaryAmount(['savings', 'promo savings', 'discount']);
    const tax = findSummaryAmount(['estimated tax', 'sales tax', 'tax']);
    const tip = findSummaryAmount(['driver tip', 'tip', 'gratuity']);
    const fees = findSummaryAmount(['delivery fee', 'service fee', 'express delivery', 'convenience fee']);
    const total = findSummaryAmount(['order total', 'total', 'amount charged', 'charged']);

    // Use post-savings subtotal: gross - savings
    // Sanity check: if subtotal > total, we grabbed the pre-savings gross — fall back to total - tax - tip - fees
    let subtotal = savings > 0 ? Number((grossSubtotal - savings).toFixed(2)) : grossSubtotal;
    if (total > 0 && subtotal > total) {
        subtotal = Number((total - tax - tip - fees).toFixed(2));
        console.log(`[WalmartSplit] Subtotal sanity fix: was $${grossSubtotal}, corrected to $${subtotal} (total - tax - tip - fees)`);
    }
    console.log(`[WalmartSplit] Totals raw: gross=$${grossSubtotal} savings=$${savings} → subtotal=$${subtotal} tax=$${tax} tip=$${tip} fees=$${fees} total=$${total}`);


    // Fallback: try data-testid selectors
    const totalsMap: OrderTotals = {
        subtotal: subtotal || parseDollar(queryText([
            '[data-testid="subtotal-value"]',
            '[class*="subtotal"] [class*="value"]',
            '[class*="SubTotal"]',
        ])),
        tax: tax || parseDollar(queryText([
            '[data-testid="tax-value"]',
            '[class*="tax"] [class*="value"]',
        ])),
        tip: tip || parseDollar(queryText([
            '[data-testid="tip-value"]',
            '[class*="tip"] [class*="value"]',
            '[class*="driver-tip"]',
        ])),
        fees: fees || parseDollar(queryText([
            '[data-testid="delivery-fee-value"]',
            '[data-testid="service-fee-value"]',
            '[class*="delivery-fee"]',
            '[class*="service-fee"]',
        ])),
        total: total || parseDollar(queryText([
            '[data-testid="total-value"]',
            '[data-testid="order-total"]',
            '[class*="grand-total"]',
            '[class*="GrandTotal"]',
            '[class*="order-total"] [class*="value"]',
        ])),
    };

    console.log('[WalmartSplit] Extracted totals:', totalsMap);
    return totalsMap;
}

// ─────────────────────────────────────────────────────────────
// MAIN LISTENER
// Guard uses document.documentElement.dataset so it is shared across
// ALL content-script isolated worlds in the same tab. Using `window`
// would NOT work because each injection gets its own global scope.
// ─────────────────────────────────────────────────────────────

if (document.documentElement.dataset.walmartSplitLoaded) {
    console.log('[WalmartSplit] Listener already registered (cross-world guard) — skipping duplicate injection.');
} else {
    document.documentElement.dataset.walmartSplitLoaded = 'true';

    chrome.runtime.onMessage.addListener((request: any, _sender, _sendResponse) => {
        if (request.action === 'extract_receipt') {
            console.log('[WalmartSplit] Starting extraction on:', window.location.href);

            const url = window.location.href;
            const isOrderDetailPage = /walmart\.com\/orders?\//.test(url);
            if (!isOrderDetailPage) {
                console.warn('[WalmartSplit] ⚠️ You may not be on an order detail page. URL:', url);
                console.warn('[WalmartSplit] Navigate to a specific order (click into an order from your order history) and try again.');
            }

            const items = extractItems();
            const totals = extractTotals();

            const payload = {
                items,
                subtotal: totals.subtotal,
                tax: totals.tax,
                tip: totals.tip,
                fees: totals.fees,
                total: totals.total,
            };

            // ── DEBUG REPORT ──
            console.group('[WalmartSplit] ── EXTRACTION REPORT ──');
            console.log(`Items found: ${items.length}`);
            items.forEach((item, i) => {
                console.log(`  [${i + 1}] ${item.name} | qty: ${item.quantity} | price: $${item.price}`);
            });
            console.log(`Subtotal: $${totals.subtotal}`);
            console.log(`Tax:      $${totals.tax}`);
            console.log(`Tip:      $${totals.tip}`);
            console.log(`Fees:     $${totals.fees}`);
            console.log(`Total:    $${totals.total}`);
            console.log('Full payload:', JSON.stringify(payload, null, 2));
            console.groupEnd();

            if (items.length === 0) {
                console.warn('[WalmartSplit] ⚠️ No items were found. The page selectors may need updating for this Walmart layout.');
                console.warn('[WalmartSplit] Open DevTools and inspect item elements, then report back the class names or data-testid attributes.');
            }

            chrome.storage.local.set({ walmartReceiptData: payload }, () => {
                const appUrl = chrome.runtime.getURL('index.html');
                window.open(appUrl, '_blank');
            });
        }
    });
}
