---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-Walmart-Order-Split-Calculation-2026-03-03.md
  - _bmad-output/planning-artifacts/research/technical-Chrome-Extension-Feasibility-research-2026-03-03.md
  - _bmad-output/brainstorming/brainstorming-session-2026-03-03-20-18.md
workflowType: 'prd'
documentCounts:
  briefCount: 1
  researchCount: 1
  brainstormingCount: 1
  projectDocsCount: 0
classification:
  projectType: Web App (Chrome Extension + React SPA)
  domain: General / Personal Finance Utility
  complexity: Low
  projectContext: greenfield
---

# Product Requirements Document - Walmart Order Split Calculation

**Author:** Tejasc
**Date:** 2026-03-03

## Executive Summary

The Walmart Order Split Calculation application eliminates the friction of splitting shared Walmart delivery orders among roommates, family, or friends. When groups place a shared order, calculating proportional tax and tip line-by-line is a manual, tedious, and error-prone process that falls entirely on the primary buyer. This application solves that problem by securely extracting order data directly from a user's logged-in session, bypassing manual data entry entirely. Users then assign items via a high-speed interface, instantly generating a mathematically accurate breakdown of who owes what to the primary payer.

### What Makes This Special

1. **Zero-Friction Extraction:** A Chrome Extension scrapes the DOM locally, bypassing bot protections, requiring no password sharing, and maintaining absolute user privacy while completely eliminating manual data entry.
2. **Speed-Optimized UX:** The "Single-Click Person Array" UI abandons clunky dropdowns in favor of a high-speed horizontal tap list to assign items instantly.
3. **Smart Proportional Math:** The core calculation engine automatically distributes order-level taxes and tips proportionally based on individual subtotals, solving the hardest part of shared bills instantly.
4. **"The Payer Entity" Focus:** Acknowledging that the person whose credit card was used isn't necessarily splitting everything equally, making the final "who owes who" output indisputable.

## Project Classification

- **Project Type:** Web App (Chrome Extension + React SPA)
- **Domain:** General / Personal Finance Utility
- **Complexity:** Low (Strictly client-side computation, no backend database)
- **Context:** Greenfield

## Success Criteria

### User Success

- **Time to Split:** A Payer must be able to load an order, assign 20 items to 4 participants, and generate a final breakdown in under 90 seconds.
- **Zero-Math Experience:** Participants must never have to manually calculate their proportional tax or tip share.
- **Immediate Clarity:** The final settlement output must be clear enough that the Payer receives zero follow-up questions from participants regarding how their total was calculated.

### Business Success

- **Stickiness / Reusage:** Users who split an order successfully for the first time should return to use the tool for their next shared Walmart order rather than reverting to a spreadsheet. 
- **Task Completion Rate:** >80% of users who initiate an order split successfully reach the final summary screen.

### Technical Success

- **Scrape Reliability:** The Chrome Extension must securely scrape and load >95% of initiated order extractions without missing data (prices, tax, tip, and line items).
- **Bot-Evasion:** The DOM scraping approach must not trigger Walmart bot protections or reCAPTCHAs for the user.

### Measurable Outcomes

- **Average Time on Task:** Time from the initial "Extension Click" to "Summary Generated" is strictly < 2 minutes.

## Product Scope

### MVP - Minimum Viable Product

- **Data Extractor Extension:** A Manifest V3 Chrome Extension that extracts order details from the Walmart DOM.
- **Data Handoff:** Secure passing of the JSON payload strictly via local browser storage/messaging to the Web App.
- **Single-Click Person Array:** The core horizontal UI for high-speed item assignment.
- **Calculation Engine:** Automatic proportional distribution of order-level taxes and tips.
- **Custom Overrides:** Ability to deviate from a 50/50 equal split on shared items.
- **Output Generation:** Clean, text-based or image-based summary for easy copy/pasting to group chats.

### Growth Features (Post-MVP)

- **Shareable Interactive Links:** Adding a lightweight backend to generate short links for the splits to create an organic virality loop.
- **Venmo Deeplinking:** Generating clickable payment links for participants.

### Vision (Future)

- **Historical Assignment AI:** Recommending default assignments based on who bought specific items in previous orders.
- **Multi-Store Support:** Expanding the extension to scrape orders from Target, Instacart, and Amazon Fresh.

## User Journeys

### 1. The Organizer (Happy Path - The Routine Split)

**Persona:** Sarah (The Organizer & Primary Payer)
**Situation:** Sarah shares an apartment with three roommates. She just placed a $250 Walmart+ order that included shared household supplies (toilet paper, cleaning spray) alongside her own groceries and specific items her roommates asked her to tack on to hit the shipping minimum.
**Goal:** She wants to get paid back fairly by her roommates, but she absolutely dreads spending 20 minutes building a spreadsheet to figure out how to divide the $18.52 tax and $15 driver tip.
**The Journey:**
- **Opening:** Sarah opens her "Recent Orders" page on Walmart.com on her laptop. She sees the $250 total and sighs, knowing she needs to do the math.
- **Action:** Instead of opening Excel, she clicks the active "Walmart Split" Chrome Extension icon. 
- **The Magic:** A new tab immediately opens to the web app. Her entire 30-item receipt is already loaded. 
- **Assignment:** She types her roommates' names (Mike, Alex, Jess). Scrolling down the page, she taps names next to items. For her personal groceries, she taps her own name. For Mike's protein powder, she taps "Mike". For the shared toilet paper, she taps all four names. 
- **Resolution:** In under 60 seconds, she reaches the bottom. The app instantly shows a clean breakdown: "Mike owes $34.50 (includes $2.10 tax/tip)". She clicks "Copy Summary", pastes the text into her roommate group chat, and receives her Venmo payments 5 minutes later without a single complaint.

### 2. The Participant (The Consumer of the Output)

**Persona:** Mike (The Roommate)
**Situation:** Mike threw a few heavy items (protein powder, cases of water) onto Sarah's Walmart order because he didn't want to go to the store. 
**Goal:** He wants to pay Sarah back promptly, but in the past, he's felt annoyed when roommates just divide the total tax/tip equally, meaning he subsidizes taxes on things he didn't buy.
**The Journey:**
- **Opening:** Mike gets a notification in the roommate group chat. It's a nicely formatted text block from Sarah.
- **Action:** He reviews his section. He sees his specific items listed, his subtotal, and exactly how his proportional share of the tax and tip was strictly calculated based on *his* subtotal.
- **Resolution:** Because the math is transparent and indisputably fair, all social friction is removed. He doesn't have to ask "Wait, how much was the tax?" He simply Venmos the exact amount requested.

### 3. The Organizer (Edge Case - The Custom Split)

**Persona:** David (The Organizer)
**Situation:** David and his partner share groceries, but they just bought a $200 air purifier in their Walmart order. They explicitly agreed that because David wanted it more, he would pay 75% of it, and his partner would pay 25%.
**Goal:** To split the order accurately without having to break out a calculator just for this one weird item.
**The Journey:**
- **Opening:** David runs the extension and begins assigning items normally using the Single-Click Person Array.
- **Action:** When he reaches the $200 Air Purifier, tapping both names would default to a 50/50 split. Instead, he clicks the "Custom Split" toggle on that specific row. 
- **Resolution:** He inputs "75%" for himself and "25%" for his partner. The system accepts this override, correctly allocates the $150 and $50 sub-costs, and perfectly calculates the downstream tax and tip proportions based on that custom balance.

### Journey Requirements Summary

These journeys reveal the need for the following core capabilities:
1. **Extension Injector:** The Chrome Extension must be able to read the DOM and seamlessly pass the JSON payload to the web app tab.
2. **Participant Roster State:** The ability to add/remove names at the top of the app to populate the assignment array.
3. **Multi-Select Toggle Array:** A UI component on every line item that allows single-tap toggling of one or multiple names.
4. **Proportional Math Engine:** A background calculation that dynamically updates tax/tip shares every time an item is assigned.
5. **Custom Split UI:** An "advanced" view for specific line items that allows percentage or dollar-amount overrides to the default equal split.
6. **Clipboard Formatter:** A clean text-generator that formats the final financial breakdown for easy pasting into iMessage, WhatsApp, or Slack.

## Innovation & Novel Patterns

### Detected Innovation Areas

- **Client-Side DOM Extraction for Receipts:** Moving data extraction entirely to the local browser extension. This novel approach bypasses the massive security risks of credential sharing (Plaid-style scraping) and the unreliability of backend bots fighting reCAPTCHAs, while avoiding the manual friction of OCR receipt scanning.
- **Single-Click Person Array:** A fundamentally new interaction pattern for item assignment. By replacing traditional dropdown menus with a horizontal, quick-tap array of participant names, data entry speed is exponentially increased.

### Market Context & Competitive Landscape

Current market solutions fall into two flawed categories. Generic bill splitters (like Splitwise) still require the organizer to manually calculate tax and tip proportionally before entering the data. Receipt scanners and email-forwarding bots often fail on long digital orders or require sharing sensitive Walmart passwords. This extension sits in a unique "local-first, privacy-first" space that solves the digital shared-order problem without the backend overhead.

### Validation Approach

- **Scraper PoC:** A Phase 1 Proof-of-Concept script will run directly in the Chrome DevTools console to validate that Walmart's DOM can be reliably parsed for `item`, `price`, and `qty` across different order types.
- **UX Timing:** User testing the "Single-Click" array versus standard dropdowns to definitively prove it meets the sub-90-second task completion metric.

### Risk Mitigation

- **Walmart DOM Changes:** The greatest risk to this innovation is Walmart altering their React class names, breaking the scraper.
- **Mitigation Strategy:** The extension will employ highly defensive DOM scraping (using robust, fallback CSS selectors and optional chaining). Additionally, the web app will include manual override inputs, ensuring users are never completely blocked from splitting a bill even if a specific price fails to scrape.

## Project-Type Specific Requirements (Web App / Extension)

### Project-Type Overview

This project is a hybrid "Web App" relying on a Manifest V3 Chrome Extension to handle data injection, paired with a React Single Page Application (SPA) to handle the complex UI and mathematical state. 

### Browser Matrix & Extension Support

- **Primary Target:** Google Chrome (Desktop) via the Chrome Web Store.
- **Extension API:** Strictly Manifest V3.
- **Secondary Targets:** Chromium-based browsers (Edge, Arc, Brave) that support normal Chrome extensions.
- **Mobile Support:** No initial support. Chrome extensions do not run natively on mobile Chrome/Safari, meaning the DOM scraping step currently requires a desktop browser.

### Responsive Design

- The React SPA will be built "Desktop-First" because the extension trigger originates on desktop browsers.
- While it will be responsive to smaller window sizes, mobile responsiveness is distinctly lower priority for the MVP since users must be on a desktop to initiate the data extraction. 

### Performance Targets

- **Render Target:** 60fps scrolling on the SPA.
- **State Management:** Because the "Single-Click Person Array" involves rapidly updating proportional math for potentially 50+ items and multiple users simultaneously, a performance-focused state manager (like Zustand or Jotai) is required over standard React Context to prevent massive unneeded re-renders on every click. 

### Implementation Considerations (No Backend)

Because this is entirely client-side, we bypass traditional Web App requirements:
- **SEO Strategy:** Not applicable for the MVP beyond basic meta tags, as the app is a utility behind an extension wall, not a searchable content site.
- **Database/Auth:** None. State is entirely ephemeral and lives only in the React app's memory for the duration of the split session. If the tab is closed, the state is lost.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach (The "Utility" MVP):** We are optimizing entirely for time-to-value for the Organizer. The MVP must solely prove that client-side scraping + the "Single-Click Array" is faster and less painful than a spreadsheet. We are aggressively cutting all backend requirements (databases, user accounts, link sharing) to ensure rapid development.
**Resource Requirements:** 1 Frontend/Extension Developer (Tejasc).

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- The Routine Split (Equal splitting of shared items, direct assignment of personal items).
- The Consumer of the Output (Copy/pasting the final text summary).

**Must-Have Capabilities (Do NOT launch without these):**
- Manifest V3 Extension capable of querying Walmart's specific DOM structure for order history.
- React SPA that accepts the injected JSON payload.
- "Participant Roster" UI to add names.
- "Single-Click Person Array" UI for assigning items.
- Real-time proportional calculation engine for tax/tip/fees.
- "Copy to Clipboard" text formatter for the final result.

### Post-MVP Features

**Phase 2 (Growth - The "Customization" Update):**
- Custom Split UI (overriding 50/50 splits with specific percentages/dollars).
- Image-based receipt generation (saving the output as a clean PNG rather than text).

**Phase 3 (Expansion - The "Viral" Update):**
- Adding a lightweight backend (Supabase/Firebase) to generate shareable links.
- Venmo Deeplink integration.
- Multi-store support (Target, Instacart).

### Risk Mitigation Strategy

- **Technical Risks (DOM Changes):** Start development immediately with the Phase 1 Scraper PoC. Prove the DOM can be parsed in the console *before* building the React UI.
- **Scope Creep Risks:** Strictly enforce the "No Backend" rule for V1. If data needs to be saved, it saves to `localStorage` only.

## Functional Requirements

### Order Data Extraction (Extension)

- **FR1:** The system can extract itemized receipt data (item names, individual prices, and quantities) from an active Walmart order page.
- **FR2:** The system can extract order-level financial data (order subtotal, total tax, driver tip, delivery fees, and final grand total).
- **FR3:** The system can securely hand off the extracted JSON payload from the browser extension directly to the web application without passing through an external backend.
- **FR4:** The system can handle extraction errors and surface a notification if the page is not a valid or readable Walmart order.

### Participant Roster Management

- **FR5:** The Organizer can add new participant names to the split roster.
- **FR6:** The Organizer can remove existing participants from the split roster.
- **FR7:** The system automatically includes the active Organizer in the roster by default.

### Item Assignment Interface

- **FR8:** The Organizer can view a complete list of all extracted items, displaying the item name, quantity, and total price.
- **FR9:** The Organizer can assign any line item completely to a single participant with a single physical interaction (click/tap).
- **FR10:** The Organizer can assign any line item to multiple participants simultaneously (defaulting to a 50/50 equal fraction split of that item's cost).
- **FR11:** The Organizer can instantly toggle off/unassign a previously assigned item.
- **FR12:** The system can visually distinguish the assignment status of every item (e.g., clearly showing which items have 0 assignees vs. 1+ assignees).

### Proportional Calculation Engine

- **FR13:** The system can calculate the individual subtotal for each participant based on their specifically assigned items.
- **FR14:** The system can calculate the proportional share of order-level taxes for each participant based on their percentage of the total assigned subtotal.
- **FR15:** The system can calculate the proportional share of order-level tips and fees for each participant based on their percentage of the total assigned subtotal.
- **FR16:** The system can calculate the absolute final total owed by each participant (Personal Items + Proportional Tax + Proportional Tip/Fees).
- **FR17:** The system can dynamically recalculate all math (FR13-FR16) in real-time immediately whenever any item assignment changes.

### Summary & Export Generation

- **FR18:** The system can generate a finalized settlement view displaying each participant's name, their specifically assigned items, and their final total owed.
- **FR19:** The Organizer can format the final financial breakdown into a clean, human-readable text block.
- **FR20:** The Organizer can copy the formatted text block to their system clipboard with a single action to easily paste into external messaging applications.

## Non-Functional Requirements

### Performance & Responsiveness
- **NFR1:** The SPA must maintain a smooth 60fps scroll and render rate, even with massive grocery orders exceeding 80+ line items and 10+ participants.
- **NFR2:** The proportional math engine must execute and update the UI in strictly under 50ms after any item assignment toggle to ensure the "Single-Click Array" feels perfectly real-time.

### Security & Privacy
- **NFR3 (Zero-Egress Data):** The system must execute 100% of its math and data parsing within the client browser. Under no circumstances will scraped receipt data or participant names be transmitted to an external backend server or database. State is ephemeral.
- **NFR4:** The Chrome Extension must utilize Manifest V3, requiring only the minimum necessary permissions (scoped strictly to Walmart order domains) to pass Chrome Web Store security audits.

### Reliability & Resilience
- **NFR5:** The DOM scraper must implement highly defensive fallback CSS selectors and optional chaining. If Walmart alters their React class names, the system should gracefully degrade rather than crashing the entire extension.
