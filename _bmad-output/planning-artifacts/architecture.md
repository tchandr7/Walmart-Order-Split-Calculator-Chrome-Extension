---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-04T17:26:45-07:00'
inputDocuments:
  - "prd.md"
  - "product-brief-Walmart-Order-Split-Calculation-2026-03-03.md"
  - "ux-design-specification.md"
  - "ux-design-directions.html"
  - "research/technical-Chrome-Extension-Feasibility-research-2026-03-03.md"
  - "research/technical-Chrome-Extension-Feasibility-research-2026-03-03.md"
workflowType: 'architecture'
project_name: 'Walmart Order Split Calculation'
user_name: 'Tejasc'
date: '2026-03-04T16:52:56-07:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **Order Data Extraction**: A Chrome extension must securely extract itemized receipt and order-level financial data directly from the Walmart DOM and hand off the JSON payload to a web application without a backend.
- **Participant Roster & Assignment**: Users must be able to manage a roster of participants and rapidly assign items (singly or equally split) using a high-speed "Single-Click Person Array" interface.
- **Proportional Calculation Engine**: Real-time calculation of individual subtotals, proportional taxes, and tips/fees based strictly on assigned items, adjusting instantly with any assignment changes.
- **Export**: Generation of a clear, formatted text block for clipboard copying.

**Non-Functional Requirements:**
- **Performance**: Strict sub-50ms execution time for the proportional math engine to ensure instant UI feedback, and 60fps scrolling for lists of up to 80+ items.
- **Security & Privacy (Zero-Egress)**: 100% client-side execution; data never leaves the browser. Strict adherence to Manifest V3 minimal permission models.
- **Reliability (DOM Resilience)**: Highly defensive scraping strategies with fallback selectors and manual overrides to mitigate the risk of Walmart altering their DOM structure.

**Scale & Complexity:**
The project features a relatively simple feature set but requires specialized architecture to bridge browser environments securely and efficiently handle complex local state updates.

- Primary domain: Web App (Chrome Extension + React SPA)
- Complexity level: Low (No backend, ephemeral state)
- Estimated architectural components: Extension Service Worker, Extension Content Scripts, React SPA UI, Client-side Math Engine.

### Technical Constraints & Dependencies

- **Platform Dependency**: Strictly bound to Google Chrome Desktop architecture via Manifest V3 restrictions. No mobile browser support for the extraction phase.
- **Data Volatility**: Heavily dependent on the unannounced, undocumented structure of Walmart.com's React DOM class names. 
- **Ephemeral State**: Due to the explicit "No Database" constraint, all application data (aside from saved roster names in `localStorage`) is lost upon tab closure.

### Cross-Cutting Concerns Identified

- **High-Performance State Management**: The React SPA must utilize performant state management (e.g., Zustand or Jotai) rather than standard Context to handle complex array mutations (80+ items x multiple participants) and trigger instant math recalculations without causing application-wide re-render lag.
- **Secure Cross-Environment Messaging**: Establishing a secure, verified communication bridge (`window.postMessage` / `chrome.storage`) between the isolated Extension execution context and the React application.
- **Graceful Degradation**: Architecting the UI and logic to fail gracefully and allow manual user entry if the DOM scraper encounters unrecognizable structures.

## Starter Template Evaluation

### Primary Technology Domain

Web App (Chrome Extension + React SPA) based on project requirements analysis and technical research.

### Starter Options Considered

1. **Vite + React-TS + CRXJS (@crxjs/vite-plugin)**: The industry standard for manually integrating Vite with Manifest V3 Chrome Extensions. Offers zero-config HMR (Hot Module Replacement) and full Vite ecosystem support.
2. **WXT (Web Extension Tools)**: The emerging "Next.js for browser extensions." It is built on Vite, framework-agnostic, and provides an extremely robust, opinionated development experience with auto-imports and file-based routing.
3. **Plasmo**: A heavy-duty, opinionated browser extension framework. Relies on the Parcel bundler. Offers great features but abstracts away many core extension concepts and has faced recent community scrutiny regarding Parcel's performance compared to Vite.

### Selected Starter: Vite + React-TS + CRXJS

**Rationale for Selection:**
While frameworks like WXT and Plasmo offer excellent developer experiences, this project thrives on a lightweight, highly specific architecture with "Zero-Egress Data" and ephemeral state. Using a standard **Vite React-TS** template paired directly with the **CRXJS Vite Plugin** gives us ultimate, low-level control over the Service Workers, Content Scripts, and React bundling process without the overhead or "magic" of a larger framework. It aligns perfectly with the technical research advocating for a Vite/TypeScript monorepo structure.

**Initialization Command:**

```bash
npm create vite@latest . -- --template react-ts
npm install @crxjs/vite-plugin@latest -D
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript (Strict Mode) with Node.js for the build environment. Ensures our complex JSON payload (the scraped order details) remains strongly typed as it moves from the Extension to the React app.

**Styling Solution:**
Vanilla CSS/Tailwind CSS compatible. Vite handles PostCSS and Tailwind processing out of the box, allowing us to build the "Clean Fintech" aesthetic requested in the UX specification.

**Build Tooling:**
Vite (esbuild and Rollup). Provides lightning-fast Hot Module Replacement during development and highly optimized chunking for production. CRXJS seamlessly bridges Vite's build process into Manifest V3 requirements (like compiling the Service Worker).

**Testing Framework:**
Vitest and Playwright (To be added manually). Vite's ecosystem makes integrating Vitest trivial since they share the exact same configuration files.

**Code Organization:**
Standard SPA structure (`src/App.tsx`, `src/main.tsx`). We will augment this by adding specific directories for the extension logic (`src/extension/background.ts`, `src/extension/content.ts`) to cleanly enforce the Separation of Concerns between data extraction and calculation.

**Development Experience:**
Extremely fast iteration loops. CRXJS allows for true HMR even within injected Chrome Extension content scripts, which is critical for rapidly prototyping the "Single-Click Person Array" UI over the Walmart DOM.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Frontend State Management (Zustand 5.0.x)
- Application Hosting Strategy (Vercel)

**Important Decisions (Shape Architecture):**
- UI/Behavioral Primitives (Radix UI)
- LocalStorage Abstraction (Zustand persist middleware)

**Deferred Decisions (Post-MVP):**
- Analytics & Error Tracking (Can be added later; initial focus is solely on the MVP extraction and calculation logic)

### Data Architecture

- **Category:** LocalStorage Abstraction
- **Decision:** Zustand `persist` middleware
- **Version:** Built into Zustand 5.0.x
- **Rationale:** Using Zustand's native middleware keeps all state architectures (in-memory math and persistent rosters) unified without introducing extra standalone hooks or manual `localStorage` API interactions.
- **Affects:** Participant Roster, React State Strategy
- **Provided by Starter:** No

### Authentication & Security

- **Category:** API Security Strategy
- **Decision:** Ephemeral Client-Side Only (Zero Backend)
- **Version:** N/A
- **Rationale:** As designed in the PRD, there is no remote database and absolutely zero egress of parsed data. Authentication relies entirely on the user's active Walmart.com session in their local browser.
- **Affects:** API layer, Cloud Infrastructure
- **Provided by Starter:** No

### API & Communication Patterns

- **Category:** Inter-Environment Messaging
- **Decision:** `chrome.storage.local` storage passing with `window.postMessage`
- **Version:** Manifest V3 specifications
- **Rationale:** The extension runs in isolated contexts. Injecting a content script to read the DOM, storing to `chrome.storage.local`, and then sending a `postMessage` to the dedicated React web application tab is the most natively secure and reliable path.
- **Affects:** Extension Service Workers, Extension Content Scripts, React Event Listeners
- **Provided by Starter:** No

### Frontend Architecture

- **Category:** State Management
- **Decision:** Zustand
- **Version:** 5.0.x
- **Rationale:** Instant recalibrations of 80+ item arrays require precise rendering that bypasses React's default Context propagation limits to hit our <50ms constraint.
- **Affects:** React application core, Proportional Calculation Engine
- **Provided by Starter:** No

- **Category:** UI Component Primitives
- **Decision:** Radix UI
- **Version:** `radix-ui` / 1.x
- **Rationale:** Provides WCAG AA styling-agnostic behavioral primitives (Accordions, Toggles), allowing us to implement the "Clean Fintech" aesthetic using strict Tailwind classes without re-inventing complex accessibility interactions.
- **Affects:** Single-Click Person Array, Custom Split Forms
- **Provided by Starter:** No

### Infrastructure & Deployment

- **Category:** Hosting Strategy
- **Decision:** Vercel Static Hosting
- **Version:** N/A
- **Rationale:** Matches perfectly with Vite-compiled SPAs, offering lightning-fast edge network delivery with zero-configuration deployments triggering automatically upon commits to the `main` GitHub branch.
- **Affects:** CI/CD Pipeline, DevOps Architecture
- **Provided by Starter:** No

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold Vite + React TypeScript boilerplate and configure `@crxjs/vite-plugin`.
2. Configure Tailwind CSS and add the `radix-ui` packages.
3. Establish the base Zustand global store, partitioning ephemeral order data separately from persistent roster data.
4. Implement the Chrome Extension message passing architecture (`background.ts` and `content.ts`) to successfully push simulated JSON to the web app before tackling the actual Walmart DOM specifics.

**Cross-Component Dependencies:**
- The extension's `content.ts` strictly dictates the JSON data contract (interface) that the Zustand store must be designed to consume.
- The `radix-ui` Accordion state visually impacts the `<LineItemRow />` height, meaning our high-performance React list must handle dynamic row sizing elegantly.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 main areas where AI agents could make diverging choices (Naming, Extension Bridging, State Architecture, and Styling), which would break the zero-cost architecture.

### Naming Patterns

**API & Payload Naming Conventions:**
- Extension to React bridging must use strict Redux-style action typing.
- All JSON schema fields parsed from the Walmart DOM must adhere to `camelCase` to map seamlessly into TypeScript interfaces.
- Example: `{ type: "ORDER_DATA_EXTRACTED", payload: { items: [{ itemName: "Milk", price: 3.99, isShared: true }] } }`

**Code Naming Conventions:**
- React Components: `PascalCase.tsx` (e.g., `ParticipantPill.tsx`, `LineItemRow.tsx`)
- Hooks and Utilities: `camelCase.ts` (e.g., `useMathEngine.ts`, `cn.ts`)
- Component export names must exactly match the file name.

### Structure Patterns

**Project Organization:**
- The Vite codebase fundamentally split into `src/app/` (React SPA) and `src/extension/` (Background/Content scripts).
- Strict enforcement of separation of concerns: `src/extension/` scripts contain DOM queries (`document.querySelector`) and `window.postMessage`. They contain zero calculation logic. 
- `src/app/` contains React/Zustand calculation logic and zero `chrome.*` API calls (ensuring the React app can be run and tested independently on Vercel without a Chrome context).

**File Structure Patterns:**
- UI components live in `src/app/components/ui/` (primitives like toggles/buttons) and `src/app/components/features/` (complex assembled rows like `<LineItemRow />`).
- State slices live in `src/app/store/` (e.g., `receiptSlice.ts`, `rosterSlice.ts`).

### Format Patterns

**Data Exchange Formats:**
- Dollar amounts are strictly handled as floating point numbers (e.g., `3.99`, not `"3.99"`) throughout the engine until final UI rendering where they are formatted via `new Intl.NumberFormat`.
- Boolean values for assignments must default to empty/undefined until explicitly toggled.

### Communication Patterns

**Event System Patterns:**
- Background tasks (if any) log locally via `console.info("[Extension background]: <message>")` formatting to distinguish extension console output from React app console output.

**State Management Patterns:**
- Immutable updates via Zustand slice pattern. 
- A single bound store `useAppStore` acts as the root, combining `createReceiptSlice` (ephemeral) and `createRosterSlice` (persistent via local storage to remain free).
- Math is recalculated dynamically within Zustand actions, never inside React render cycles (`useEffect`), to guarantee sub-50ms performance.

### Process Patterns

**Error Handling / Resilience:**
- Scraping fallback mechanisms: If Walmart changes DOM structure and DOM queries fail, the extension passes a gracefully degraded error type (`{ type: "EXTRACTION_FAILED_GRACEFULLY", payload: { rawText: "..." } }`). 
- The React App interprets extraction failure by showing an empty state with a "Manual Import Mode" fallback.

**Styling Patterns:**
- Tailwind class conflict resolution is mandatorily wrapped in a combining utility (`clsx` + `tailwind-merge`), typically exported as `cn(...)`. AI agents must never use raw template literals for dynamic active/inactive pill states.

### Enforcement Guidelines

**All AI Agents MUST:**
- Never introduce any dependency that requires paid hosting, backend database spinups, or external API quotas. The solution is strictly `$0/month` running entirely in the client browser.
- Use the `cn()` utility for ALL dynamic Tailwind class strings.
- Pass complex payload structures to the React app exclusively using the `{ type, payload }` schema to guarantee type safety across the extension bridge.

**Pattern Examples:**

**Good Example:**
```typescript
// Zustand single store slice pattern
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createReceiptSlice } from './receiptSlice'
import { createRosterSlice } from './rosterSlice'

export const useAppStore = create<AppStoreState>()((...a) => ({
  ...createReceiptSlice(...a),
  ...createRosterSlice(...a), // This slice handles persist under the hood
}))
```

**Anti-Pattern:**
```typescript
// Anti-pattern: String concatenation for tailwind
const badgeClass = `p-4 rounded ${isActive ? 'bg-blue-600' : 'bg-white'}`;
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
project-root/
├── package.json
├── tsconfig.json          # Shared type configurations
├── tsconfig.node.json     # Vite config typings
├── vite.config.ts         # Vite & @crxjs plugin config
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── index.html             # React App entry point
├── manifest.json          # Chrome Extension V3 Configuration
├── .gitignore
├── .prettierrc
├── public/                # Static assets (favicons, extension icons)
└── src/
    ├── app/               # ⚡️ REACT APPLICATION BOUNDARY ⚡️
    │   ├── main.tsx       # React root mount
    │   ├── App.tsx        # Main application layout
    │   ├── index.css      # Tailwind base imports
    │   ├── components/
    │   │   ├── ui/        # Dumb primitives (Radix wrappers, buttons, toggles)
    │   │   └── features/  # Smart components (LineItemRow, RosterList)
    │   ├── store/
    │   │   ├── appStore.ts    # Main Zustand store
    │   │   ├── receiptSlice.ts # Ephemeral math state
    │   │   └── rosterSlice.ts  # Persistent participant state
    │   └── utils/
    │       ├── cn.ts      # tailwind-merge + clsx utility
    │       └── math.ts    # Pure math functions for testing
    │
    ├── extension/         # 🕷️ CHROME EXTENSION BOUNDARY 🕷️
    │   ├── background.ts  # Service Worker (Orchestration/Tab opening)
    │   ├── content.ts     # Injected into Walmart.com to scrape DOM
    │   └── scraper.ts     # The pure extraction functions
    │
    └── types/             # 🤝 SHARED CONTRACT BOUNDARY 🤝
        └── index.ts       # Shared interfaces (e.g., ScrapedOrderPayload)
```

### Architectural Boundaries

**Extension ↔ React Boundary (The Airgap):**
The `src/extension/` and `src/app/` directories must never import code from each other directly. The Extension executes within the physical Walmart DOM, while the React App executes in its own DOM. They communicate *only* via JSON messages conforming to the `src/types/index.ts` contracts.

**Component Boundaries:**
- `src/app/components/ui/` components are totally stateless and unaware of the project domain. They only accept props (`isActive`, `onClick`).
- `src/app/components/features/` components (like `<LineItemRow />`) are allowed to import the `useAppStore` directly to subscribe to specific atomic state changes (Zustand pattern) to achieve the sub-50ms render target.

### Requirements to Structure Mapping

**Epic: Data Extraction**
- Core Logic: `src/extension/scraper.ts`
- Injection/Message Passing: `src/extension/content.ts`
- Tab Management: `src/extension/background.ts`

**Epic: High-Speed UI / Assignment**
- The "Single-Click Person Array": `src/app/components/features/ParticipantPill.tsx` mapped inside `src/app/components/features/LineItemRow.tsx`.
- Math Engine: `src/app/store/receiptSlice.ts`

### Integration Points

**Internal Communication (Extension to Web App):**
1. User clicks Extension icon on Walmart.com.
2. `background.ts` catches click, triggers `content.ts`.
3. `content.ts` parses DOM using `scraper.ts`.
4. `content.ts` writes JSON to `chrome.storage.local`.
5. `background.ts` opens new tab to `https://app.walmart-split.com`.
6. `app/App.tsx` mounts, reads `chrome.storage.local`, hydrates the Zustand store, and clears the storage.

### Development Workflow Integration

- **Development:** Running `npm run dev` will execute Vite, utilizing `@crxjs/vite-plugin` to simultaneously serve the HMR React app and compile the `manifest.json` asset bundle into a local `dist/` folder that Chrome can load unpacked.
- **Deployment:** Vercel deployment ignores the `src/extension/` directory entirely and strictly builds `src/app/` for the live website.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The selection of Vite + React-TS with `@crxjs/vite-plugin` works cohesively to support a rapid iteration environment. Zustand's atomic state management model perfectly complements the complex React array mutations required by the UI without the overhead of Redux.

**Pattern Consistency:**
The strict usage of Redux-style action typing (`{ type, payload }`) guarantees type safety across the `chrome.storage.local` bridge, resolving the primary risk of extension-to-web-app data corruption.

**Structure Alignment:**
The physical separation of `src/app/` and `src/extension/` strictly enforces the stateless DOM scraper vs. stateful calculation app boundary demanded by the PRD.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
Both primary epics (Data Extraction via Chrome Extension and High-Speed UI Assignment) have dedicated folder structures, defined tech stacks, and concrete communication contracts. 

**Functional Requirements Coverage:**
The `$0/month` constraint is explicitly supported by avoiding all backend infrastructure. Data scraping operates locally, and the Vercel static deployment keeps the React app free permanently.

**Non-Functional Requirements Coverage:**
Performance targets (<50ms math) are addressed by strictly binding Zustand slices directly to line-item components, completely evading React Context propagation bottlenecks.

### Implementation Readiness Validation ✅

**Decision Completeness:**
All choices have explicitly defined packages, versions (Zustand 5.0.x, Radix 1.x), and strict implementation guidelines.

**Structure Completeness:**
The complete folder tree mapped in the document gives AI agents explicit commands on exactly where every new component, hook, or script must be instantiated.

**Pattern Completeness:**
Anti-patterns for standard pain points (like string concatenation with Tailwind classes) have been preemptively established to prevent "hallucinated" AI bugs.

### Gap Analysis Results

**Critical Gaps:**
None. The architecture solidly addresses the MVP scope.

**Important Gaps:**
*API Error Handling specifically for Walmart DOM Changes:* We mapped the gracefully degraded payload, but we lack the explicit interface for what happens if Walmart uses completely obfuscated `<div class="random-hash">` elements in the future. We will need to define a fallback heuristic (like regex matching text instead of DOM querying) during the extraction implementation phase.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:** Ultra-lightweight, specifically handles Manifest V3 bridging securely, zero running costs, and maximizes React rendering speeds.

**Areas for Future Enhancement:** Automated DOM-change alerting, export-to-Venmo deep linking.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
```bash
npm create vite@latest . -- --template react-ts
npm install @crxjs/vite-plugin@latest -D
```
