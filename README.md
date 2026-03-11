# 🛒 Walmart Order Split Calculator

> **👋 Hey there!** Just a heads up: this is a super simple, casual project that was entirely vibe coded in a couple of hours. There wasn't too much thought put into it, just enough to get the job done so we can skip doing math manually and save some time.

This is a free Chrome extension that scrapes your Walmart order details and calculates how to split the bill among friends — with full control over tax, tip, and per-item assignments.

**No Chrome Web Store required. Free forever. Open source.**

---

## ✨ Features

- 🔍 **Auto-scrapes** item names, quantities, prices, tax, tip, and totals from your Walmart order page
- 👥 **Roster-based splitting** — add everyone in your group
- 🎛️ **Flexible tax & tip splits** — Equal, Proportional, or Manual per person
- 🚫 **Exclude participants** from tax/tip (e.g. waive tax for someone who bought just one cheap item)
- ✂️ **Split multi-quantity items** into individual line items
- ✅ **Dual verification** — confirms both subtotal and grand total are fully accounted for
- 📋 **Copy Summary** — one tap to copy a formatted breakdown to send in a group chat

---

## 📥 Installation (No Build Required)

> The `dist/` folder is pre-built and included in this repo. No Node.js or terminal needed.

### Step 1 — Download the extension

Click the green **`< > Code`** button on this page → **Download ZIP**

Unzip the downloaded file anywhere on your computer.

### Step 2 — Load it in Chrome

1. Open Chrome and go to: **`chrome://extensions`**
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. In the file picker, navigate **inside** the unzipped folder and select the **`dist`** subfolder

> ⚠️ **Important:** Select the `dist` folder specifically — not the outer repo folder.
> The correct path should end with `.../Walmart-Order-Split-Calculator-Chrome-Extension-main/dist`
>
> If you see an error about `_bmad-output`, you selected the wrong (outer) folder. Go one level deeper into `dist/`.

The extension icon will appear in your Chrome toolbar.

### Step 3 — Use it

1. Go to **[walmart.com](https://www.walmart.com)** and sign in
2. Navigate to **Account → Purchase History** → click into a specific order
3. Click the **Walmart Split** extension icon in your toolbar
4. A new tab opens with your order pre-loaded — start splitting!

---

## 🔄 Updating

When a new version is released:
1. Download the ZIP again
2. Replace the old unzipped folder with the new one
3. Go to `chrome://extensions` → click the **↺ Refresh** icon on the extension

---

## 🔒 Privacy

- **No data leaves your computer.** The extension reads your Walmart order page locally and stores everything in your browser's local storage only.
- No accounts, no servers, no tracking.

---

## 🛠️ For Developers

Want to modify the extension or contribute?

```bash
# Clone the repo
git clone https://github.com/tchandr7/Walmart-Order-Split-Calculator-Chrome-Extension.git
cd Walmart-Order-Split-Calculator-Chrome-Extension

# Install dependencies
npm install

# Start dev server (for UI development)
npm run dev

# Build the extension
npm run build
# → loads the updated dist/ folder in chrome://extensions
```

**Tech stack:** Vite + React + TypeScript + Zustand + Tailwind CSS + CRXJS

---

## 📄 License

MIT — free to use, share, and modify.
