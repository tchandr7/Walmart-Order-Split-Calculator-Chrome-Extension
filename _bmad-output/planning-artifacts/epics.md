---
stepsCompleted: []
inputDocuments: 
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
---

# Walmart Order Split Calculation - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Walmart Order Split Calculation, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The system can extract itemized receipt data (item names, individual prices, and quantities) from an active Walmart order page.
FR2: The system can extract order-level financial data (order subtotal, total tax, driver tip, delivery fees, and final grand total).
FR3: The system can securely hand off the extracted JSON payload from the browser extension directly to the web application without passing through an external backend.
FR4: The system can handle extraction errors and surface a notification if the page is not a valid or readable Walmart order.
FR5: The Organizer can add new participant names to the split roster.
FR6: The Organizer can remove existing participants from the split roster.
FR7: The system automatically includes the active Organizer in the roster by default.
FR8: The Organizer can view a complete list of all extracted items, displaying the item name, quantity, and total price.
FR9: The Organizer can assign any line item completely to a single participant with a single physical interaction (click/tap).
FR10: The Organizer can assign any line item to multiple participants simultaneously (defaulting to a 50/50 equal fraction split of that item's cost).
FR11: The Organizer can instantly toggle off/unassign a previously assigned item.
FR12: The system can visually distinguish the assignment status of every item (e.g., clearly showing which items have 0 assignees vs. 1+ assignees).
FR13: The system can calculate the individual subtotal for each participant based on their specifically assigned items.
FR14: The system can calculate the proportional share of order-level taxes for each participant based on their percentage of the total assigned subtotal.
FR15: The system can calculate the proportional share of order-level tips and fees for each participant based on their percentage of the total assigned subtotal.
FR16: The system can calculate the absolute final total owed by each participant (Personal Items + Proportional Tax + Proportional Tip/Fees).
FR17: The system can dynamically recalculate all math (FR13-FR16) in real-time immediately whenever any item assignment changes.
FR18: The system can generate a finalized settlement view displaying each participant's name, their specifically assigned items, and their final total owed.
FR19: The Organizer can format the final financial breakdown into a clean, human-readable text block.
FR20: The Organizer can copy the formatted text block to their system clipboard with a single action to easily paste into external messaging applications.

### NonFunctional Requirements

NFR1: The SPA must maintain a smooth 60fps scroll and render rate, even with massive grocery orders exceeding 80+ line items and 10+ participants.
NFR2: The proportional math engine must execute and update the UI in strictly under 50ms after any item assignment toggle to ensure the "Single-Click Array" feels perfectly real-time.
NFR3 (Zero-Egress Data): The system must execute 100% of its math and data parsing within the client browser. Under no circumstances will scraped receipt data or participant names be transmitted to an external backend server or database. State is ephemeral.
NFR4: The Chrome Extension must utilize Manifest V3, requiring only the minimum necessary permissions (scoped strictly to Walmart order domains) to pass Chrome Web Store security audits.
NFR5: The DOM scraper must implement highly defensive fallback CSS selectors and optional chaining. If Walmart alters their React class names, the system should gracefully degrade rather than crashing the entire extension.

### Additional Requirements

Technical Requirements:
- Starter Template MUST BE: Vite + React-TS + CRXJS (@crxjs/vite-plugin) initialized via `npm create vite@latest . -- --template react-ts` and `npm install @crxjs/vite-plugin@latest -D`. This will be Epic 1 Story 1.
- State Management MUST BE: Zustand (5.0.x) with `persist` middleware.
- UI behavioral primitives MUST BE: Radix UI.
- Styling MUST BE: Vanilla CSS / Tailwind CSS.
- Communication Pattern MUST BE: `chrome.storage.local` with `window.postMessage` between extension and web app.
- Application Hosting Strategy MUST BE: Vercel Static Hosting.
- API Security Strategy MUST BE: Ephemeral Client-Side Only (Zero Backend, "Zero-Egress Data"). No remote DB, no external backend server.

UX / Design Requirements:
- Color System: Tailwind Slate (50, 900) for surfaces/typography, Blue-600 for primary Action, Red-500 for error.
- Flow/Input: "Click First, Type Second." Focus heavily on custom components like `ParticipantPill` and `LineItemRow` with rapid click-to-toggle assignment states. 
- Validation/Error UX: Ensure the "Copy Summary" button is completely disabled until running totals exactly match receipt totals.
- Responsiveness: Designed Desktop-first with a narrow `max-w-3xl` container, utilizing a sticky summary footer anchored at `bottom-0`.

### FR Coverage Map


### FR Coverage Map

FR1: Epic 1 - Scrape itemized receipt data
FR2: Epic 1 - Scrape order-level totals (tax, tip)
FR3: Epic 1 - Secure extension-to-React JSON handoff
FR4: Epic 1 - Extraction error handling
FR5: Epic 2 - Add participant
FR6: Epic 2 - Remove participant
FR7: Epic 2 - Default organizer in roster
FR8: Epic 2 - View all extracted items list
FR9: Epic 2 - Single item assignment
FR10: Epic 2 - Multi-person equal split assignment
FR11: Epic 2 - Toggle off assignment
FR12: Epic 2 - Visual assignment status
FR13: Epic 3 - Calculate individual subtotals
FR14: Epic 3 - Calculate proportional tax
FR15: Epic 3 - Calculate proportional tip
FR16: Epic 3 - Calculate absolute final total
FR17: Epic 3 - Real-time math recalculation
FR18: Epic 3 - Generate finalized settlement view
FR19: Epic 3 - Format text block summary
FR20: Epic 3 - Copy summary to clipboard

## Epic List

### Epic 1: Project Initialization & Order Data Extraction
The user should be able to trigger the Chrome extension on a Walmart page, successfully scrape the receipt data, and successfully pass that JSON to our initialized, empty React application.
**FRs covered:** FR1, FR2, FR3, FR4

### Epic 2: Participant Roster & High-Speed Assignment Interface
The user should be able to instantly set up their roommate/friend roster and rapidly assign the extracted grocery items using the "Single-Click Person Array" UI pattern perfectly.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12

### Epic 3: Real-Time Proportional Math Engine & Final Summary Export
The user should see their proportional taxes and tips instantly calculate as they click names, and be able to easily copy a beautifully formatted text summary to iMessage/Venmo once the grocery bill is fully assigned.
**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20

## Epic 1: Project Initialization & Order Data Extraction
The user should be able to trigger the Chrome extension on a Walmart page, successfully scrape the receipt data, and successfully pass that JSON to our initialized, empty React application.

### Story 1.1: Initialize React Application Architecture
As a Developer,
I want to initialize the Vite + React-TS + CRXJS application structure,
So that we have a foundation to build the extension and web app upon.

**Acceptance Criteria:**
**Given** an empty project directory
**When** the developer runs the initialization commands
**Then** a Vite React-TypeScript project is created with @crxjs/vite-plugin installed
**And** the project builds successfully and can be loaded as unpacked extension in Chrome

### Story 1.2: DOM Scraper Service Implementation
As a User,
I want the extension to read my Walmart order page,
So that I don't have to manually type in all my items and their prices.

**Acceptance Criteria:**
**Given** the user is viewing an active/recent Walmart order page
**When** the user clicks the extension icon
**Then** the script successfully extracts all line items, quantities, and prices (FR1)
**And** the script successfully extracts the subtotal, taxes, tips, and fees (FR2)
**And** gracefully handles errors if the DOM structure is unrecognized (FR4, NFR5)

### Story 1.3: Extension to Web App Data Handoff Bridge
As a User,
I want the extracted data to automatically open in a new tab,
So that I can start splitting my bill securely without data leaving my browser.

**Acceptance Criteria:**
**Given** the scraper service has successfully parsed a JSON payload
**When** the extension finishes parsing
**Then** it saves the JSON payload to `chrome.storage.local` (FR3)
**And** automatically opens a new tab to the React web app URL
**And** the React app reads the storage, hydrates its Zustand store, and clears the storage

## Epic 2: Participant Roster & High-Speed Assignment Interface
The user should be able to instantly set up their roommate/friend roster and rapidly assign the extracted grocery items using the "Single-Click Person Array" UI pattern perfectly.

### Story 2.1: Participant Roster Management
As an Organizer,
I want to add and remove my roommates' names to the split roster,
So that I can assign specific grocery items to them.

**Acceptance Criteria:**
**Given** the application is loaded
**When** I enter a name and hit enter
**Then** the name is added to the active roster (FR5)
**And** I am automatically added as the default first participant (FR7)
**And** I can remove participants if I made a mistake (FR6)

### Story 2.2: Line Item Display
As an Organizer,
I want to see a full list of all extracted items with their prices,
So that I can verify the scraped data is correct.

**Acceptance Criteria:**
**Given** the JSON payload has hydrated the Zustand store
**When** I look at the main screen
**Then** I see every line item listed clearly with its name, quantity, and total price (FR8)
**And** the UI maintains 60fps scrolling even with 80+ items (NFR1)

### Story 2.3: Single-Click Person Array Assignment
As an Organizer,
I want to tap a person's name next to an item to assign it to them,
So that data entry is blazing fast.

**Acceptance Criteria:**
**Given** the list of line items and an active participant roster
**When** I click a participant's "Pill" on a specific row
**Then** the pill instantly highlights to show they are assigned (FR9, FR12)
**And** if I click a second person's pill on that same row, the cost defaults to a 50/50 split (FR10)
**And** if I click an active pill again, it toggles off/unassigns immediately (FR11)

## Epic 3: Real-Time Proportional Math Engine & Final Summary Export
The user should see their proportional taxes and tips instantly calculate as they click names, and be able to easily copy a beautifully formatted text summary to iMessage/Venmo once the grocery bill is fully assigned.

### Story 3.1: Core Proportional Math Engine
As an Organizer,
I want the application to instantly calculate everyone's proportional share of taxes and tips based on what they bought,
So that I never have to do complicated spreadsheet math.

**Acceptance Criteria:**
**Given** items have been assigned to participants
**When** assignments are made or changed
**Then** the system instantly (<50ms) calculates each person's individual subtotal (FR13, NFR2)
**And** calculates their proportional share of the global tax based on their subtotal percentage (FR14)
**And** calculates their proportional share of the tip/fees based on their subtotal percentage (FR15)
**And** calculates their final total owed (FR16, FR17)

### Story 3.2: Final Settlement Summary Generation
As an Organizer,
I want to see a finalized text summary of exactly who owes what,
So that I can easily copy and paste it into my group chat to request money.

**Acceptance Criteria:**
**Given** all items have been fully assigned and the assigned total matches the exact receipt total
**When** the receipt balances perfectly
**Then** the system unlocks the "Copy Summary" button
**And** the system generates a human-readable text block showing each person's final total and specific assigned items (FR18, FR19)
**And** clicking the button copies the text directly to my clipboard (FR20)
