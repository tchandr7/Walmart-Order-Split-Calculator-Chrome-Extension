---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Automated Walmart order-splitting application'
session_goals: 'Simplify order fetching, calculate proportional/equal tax & tip splits, assign products, generate shareable output'
selected_approach: 'progressive-flow'
techniques_used: ['What If Scenarios', 'Solution Matrix', 'Role Playing', 'Decision Tree Mapping']
ideas_generated: ['[Category 1]: Screenshot Extraction - User uploads screenshots of Walmart order, app extracts details', '[Category 1 - Constraint]: Email Receipts - Discarded due to incomplete item lists; users must visit website/app anyway.', '[Category 1]: Web Scraping - Automate the extraction directly from the user account as a primary or fallback method.', '[Category 2]: Chrome Extension - Extract data seamlessly while the user is already logged into Walmart.com']
context_file: ''
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Tejasc
**Date:** 2026-03-03T20:18:59-07:00

## Technique Selection

**Approach:** Progressive Technique Flow
**Journey Design:** Systematic development from exploration to action

**Progressive Techniques:**

- **Phase 1 - Exploration:** What If Scenarios (for maximum idea generation)
- **Phase 2 - Pattern Recognition:** Solution Matrix (for organizing insights and variables)
- **Phase 3 - Development:** Role Playing (for refining concepts from user perspectives)
- **Phase 4 - Action Planning:** Decision Tree Mapping (for implementation planning and technical flows)

**Journey Rationale:** We will move from wildly brainstorming what the ideal order-splitting app looks like (Phase 1), to mapping out the core variables like tax/tip splits and product assignments (Phase 2), validating those flows against different user personas (Phase 3), and finally mapping out the exact technical flow to build the app (Phase 4).

## Ideas Generated
- **[Category 1: Data Extraction]**: Screenshot Magic
  _Concept_: Users take screenshots of their final Walmart receipt and upload them to the app. We use OCR to parse the data.
  _Novelty_: Completely circumvents Walmart bot detection and doesn't require users to share their Walmart credentials.
- **[Category 1: Data Extraction]**: Direct Web Scraping
  _Concept_: We log in on the user's behalf behind the scenes or use a browser extension to quietly scrape their "Recent Orders" page.
  _Novelty_: Provides the most seamless experience if it works, completely automating data entry.
- **[Category 2: Delivery Method]**: Browser Extension
  _Concept_: Since users order on Walmart.com via desktop or can log in there, a Chrome extension could scrape the DOM of the "Order Details" page safely without requiring password sharing or running headlessly.
  _Novelty_: Highly secure and frictionless; users don't share passwords, they just click "Split" when viewing their order.
- **[Category 3: UI/UX]**: Single-Click Person Array
  _Concept_: Display all group member names horizontally next to each item/quantity. The user assigns an item with a single tap on the name—no dropdowns, no excessive swiping.
  _Novelty_: Maximum speed for data entry. Reduces a 3-click process (click dropdown -> scroll -> click name) down to 1 click per item.
- **[Category 4: Payment Dynamics]**: "The Payer Entity" Distinction
  _Concept_: Clearly delineate between who *paid* for the Walmart order, and who *participated* in the order. The payer might not be splitting the items, or could be part of the group. The final output is always framed as "Who owes the Payer."
  _Novelty_: Accommodates real-world shared account scenarios (like a household sharing one Walmart+ subscription) without messy mental math.
- **[Category 5: Calculation Logic]**: Custom Split Overrides
  _Concept_: Shared items default to a clean 50/50 equal split (or 1/N split among N people). However, the UI offers an "Advanced" or "Custom Split" button per item for stoney users to manually enter percentages (e.g., 80/20) when required.
  _Novelty_: Keeps the "happy path" simple for 95% of use cases, but prevents edge-case frustration by allowing granular control when humans are being stingy.

## Idea Organization and Prioritization

**Thematic Organization:**

**Theme 1: Data Acquisition & Entry (Frictionless UX)**
- **Browser Extension:** Securely scrapes the DOM of the "Order Details" page without requiring credentials.
- **Screenshot Magic (Alternative):** Users upload screenshots of their Walmart receipt for OCR parsing if the extension isn't viable.

**Theme 2: Split Assignment & UI (High-Speed Sorting)**
- **Single-Click Person Array:** Display names next to each item; assign with a single tap instead of dropdowns or swiping.

**Theme 3: Calculation & Finances (Fairness & Flexibility)**
- **"The Payer Entity" Distinction:** Separate who paid from who participated to handle shared accounts gracefully. 
- **Custom Split Overrides:** Default to equal splits but allow granular percentage overrides for specific items.

**Prioritization Results:**
- **Top Priority Ideas:** Browser Extension & Single-Click Person Array. These two features define the "magic" of the app.
- **Quick Win Opportunities:** Start with exactly equal tax/tip splits before introducing custom logic.

**Action Planning (MVP Roadmap):**
1. **Validate Data Source:** Build a quick proof-of-concept Chrome extension to ensure we can reliably scrape the Walmart Order Details DOM.
2. **Design the UI:** Wireframe the "Single-Click Person Array" to ensure it fits nicely on a mobile-responsive screen.
3. **Draft the Algorithm:** Write the core logic that handles proportional tax/tip splitting based on subtotal.

## Session Summary and Insights
This brainstorming session successfully moved from identifying the core pain points to defining a highly pragmatic MVP. By deciding to skip complex features (like historical assignments or over-engineered email parsing) and focusing on speed (Browser Extension + Single Click Arrays), we have a very clear, actionable roadmap for a tool that solves a legitimate roommate/friend friction point.

## Appendix: Technique Definitions
**Solution Matrix (Structured Category):** Create a systematic grid of problem variables and solution approaches to find optimal combinations and discover gaps - identify key variables, solution approaches, test combinations, and identify most effective pairings.
