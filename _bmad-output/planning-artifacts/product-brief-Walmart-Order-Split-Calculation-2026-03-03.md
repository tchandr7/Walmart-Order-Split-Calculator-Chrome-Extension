---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ["{project-root}/_bmad-output/brainstorming/brainstorming-session-2026-03-03-20-18.md"]
date: 2026-03-03T21:05:00-07:00
author: Tejasc
---

# Product Brief: Walmart Order Split Calculation

## Executive Summary
The Walmart Order Split Calculation app eliminates the friction of splitting shared Walmart delivery orders. A secure Browser Extension extracts order data directly from a user's logged-in session, bypassing manual data entry. Users assign items using a high-speed "Single-Click Person Array" interface, instantly generating a clear breakdown of who owes what to the primary payer.

## Core Vision

### Problem Statement
When groups place a shared Walmart order, calculating who pays how much is a tedious, manual process. Users waste time reviewing past orders, manually distributing shared costs (tax and tip), and building ad-hoc spreadsheets to calculate debts.

### Problem Impact
- **Time Inefficiency:** Manual line-item math wastes the primary buyer's time.
- **Social Friction:** Confusion over proportional tax, tip, and item splits complicates shared living arrangements.

### Why Existing Solutions Fall Short
- **Generic Bill Splitters (e.g., Splitwise):** Require users to do the receipt math themselves beforehand.
- **Email/App Methods:** Email receipts are incomplete, and server-side scraper bots create massive security risks by requiring users to share their passwords.

### Proposed Solution
A frictionless Chrome Extension plus a web UI. Users import orders with one click. They assign items via a single-tap array list. The app automatically calculates proportional tax/tip splits based on subtotals, producing a shareable settlement summary.

### Key Differentiators
- **Secure DOM Scraping (Extension):** Works strictly client-side. No passwords shared, no bot detection issues.
- **Single-Click Person Array UI:** Far faster item assignment than traditional selection dropdowns.
- **Smart Default Splits:** Handles 50/50 splits gracefully with simple percentage overrides only when strictly necessary.

## Target Users

### Primary Users

**The Payer / Account Holder ("The Organizer")**
*   **Context:** Often the one with the Walmart+ subscription or the one willing to put the large charge on their credit card. They are organizing a group of friends, roommates, or family members to hit a free shipping minimum or combine a bulk order.
*   **Problem Experience:** They bear the dual burden of fronting the money and doing the administrative work of calculating who owes what. They hate the awkwardness of asking friends for money without clear math, and they hate spending 20 minutes doing line-by-line spreadsheet math even more.
*   **Success Vision:** Opening the app, seeing their recent order, tapping through names in 60 seconds, and texting a link that clearly shows each person exactly what they owe (including math for tax/tips).

### Secondary Users

**The Participants ("The Roommate / The Friend")**
*   **Context:** People who tacked items onto the Organizer’s order. 
*   **Problem Experience:** They want to pay the Organizer back fairly, but they don't want to overpay for taxes and tips that aren't theirs, nor do they want to do the math themselves. 
*   **Success Vision:** They receive a clear, indisputable breakdown showing exactly which items they are paying for, how much proportional tax/tip was added, and a final total. They pay without having to ask "wait, how did you calculate this?"

### User Journey

1.  **Discovery:** The Payer discovers the Chrome extension when complaining about splitting bills with roommates, or someone in the friend group suggests it to make ordering easier.
2.  **Onboarding:** The Payer installs the lightweight extension. No account creation required for the basic split tool.
3.  **Preparation (Scraping):** 
    * The Payer opens their recent Walmart orders page on desktop. 
    * They click a new "Split this Order" button injected by the extension.
    * The extension reads the DOM, stores a JSON payload locally, and opens a new tab to the dedicated Web App (`app.walmart-split.com`).
4.  **Setup (The App):** 
    * The Web App loads the payload and asks the Payer to confirm if they want to split this specific order.
    * The Payer is asked to enter the names of all participants splitting the order.
    * The app asks to specify who actually paid for the order (The "Payer Entity"), which may or may not be one of the participants.
5.  **The Split (Assignment):**
    * For each product, the Payer uses the high-speed "Single-Click Person Array" UI to assign the item to a name. 
    * If a product has multiple quantities, the Payer assigns each individual quantity to a person.
    * For shared items, the Payer can select multiple people, and the app defaults to dividing the item cost equally among them.
    * *Advanced Option:* For edge cases, the Payer can hit a "Custom Split" button on an item to specify exact percentages (e.g., 80/20).
6.  **Calculation:** Once all items are assigned, the app automatically calculates subtotal-proportional tax and tip for each person.
7.  **Final Review & Output:** 
    * A final screen shows exactly what each participant owes the Payer Entity.
    * The Payer generates a summary link, image, or spreadsheet output to send to the group chat. Everyone easily sees what they owe.

## Success Metrics

To validate the MVP of the Walmart Order Split Calculation application, we must measure both the technical reliability of the scraping mechanism and the user experience of the assignment interface. Success means the app is significantly faster and less error-prone than manual spreadsheet calculations.

### User Success Goals
- **Time to Split:** A Payer should be able to load an order, assign 20 items to 4 participants, and generate a final breakdown in under 90 seconds. 
- **Zero-Math Experience:** Participants should never have to manually calculate their portion of the tax or tip.
- **Immediate Clarity:** The final output should prevent any follow-up questions from participants about "how their total was calculated."

### Business Objectives (MVP Phase)
- **Technical Validation:** Prove that a Chrome Extension can reliably scrape Walmart's DOM without triggering bot protections or requiring complex maintenance.
- **Engagement / Stickiness:** Prove that once a user splits their first order using the tool, they return to use it for their next shared order rather than reverting to a spreadsheet.

### Key Performance Indicators
- **Scrape Success Rate:** >95% of initiated order extractions accurately load all items, prices, tax, tip, and subtotals into the web app without missing data.
- **Task Completion Rate:** >80% of users who initiate a split successfully generate a final summary link/image.
- **Average Time on Task:** Time from "Extension Click" to "Summary Generated" is <2 minutes.

## MVP Scope

### Core Features
- **Data Extractor Extension:** A Chrome extension capable of extracting line items, quantities, prices, taxes, and tips from a user's active Walmart "Order Details" DOM.
- **Data Handoff:** The extension securely passes the scraped JSON payload to a new tab pointing to the Web App.
- **Participant Roster:** Ability to type in the names of all participants before splitting, and assign one of them (or another entity) as the "Payer."
- **Single-Click Person Array:** The core horizontal UI that allows the Organizer to quickly tap a name to assign an item or specific quantity to that person.
- **Tax/Tip Calculation Engine:** Automatic proportional distribution of order-level taxes and tips based on the subtotal of the items assigned to each participant.
- **Custom Split Overrides:** The ability to deviate from an equal split for shared items (e.g., assigning 80% of a cost to one person).
- **Text/Image Output:** A final summary screen detailing who owes the Payer, formatted cleanly so the user can easily take a screenshot or copy/paste the text to a group chat.

### Out of Scope for MVP
- **Database/Backend Storage:** No persistence. Data lives strictly in the browser tab during the session and is lost when the tab is closed.
- **Shareable Links:** Because there is no backend, we will not generate unique URLs for the splits.
- **User Accounts/Login:** Users do not need to create an account on our app to use the extension or calculator.
- **Payment Integration:** We are not integrating Venmo or Zelle APIs down to the button level; we are just providing the math.
- **OCR/Receipt Uploads:** We are strictly handling digital orders via the Chrome Extension, not physical receipts via screenshots (discarded in brainstorming).

### MVP Success Criteria
- The Chrome Extension flawlessly scrapes the Walmart DOM on 9 out of 10 attempts without missing data fields.
- Users successfully calculate and export their final splits in under 2 minutes.

### Future Vision
- **Shareable Interactive Links:** Adding a lightweight backend to generate short links for the splits, creating the organic virality loop.
- **Venmo Deeplinking:** Generating clickable payment links for participants.
- **Historical Analysis:** Recommending default assignments based on who bought specific items in previous orders.
