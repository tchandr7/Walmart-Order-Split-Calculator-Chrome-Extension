---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-core-experience
  - step-04-emotional-response
  - step-05-inspiration
  - step-06-design-system
  - step-07-defining-experience
  - step-08-visual-foundation
  - step-09-design-directions
  - step-10-user-journeys
  - step-11-component-strategy
  - step-12-ux-patterns
  - step-13-responsive-accessibility
  - step-14-complete
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-Walmart-Order-Split-Calculation-2026-03-03.md
  - _bmad-output/planning-artifacts/research/technical-Chrome-Extension-Feasibility-research-2026-03-03.md
  - _bmad-output/brainstorming/brainstorming-session-2026-03-03-20-18.md
---

# UX Design Specification Walmart Order Split Calculation

**Author:** Tejasc
**Date:** 2026-03-04

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

To deliver a frictionless, fully client-side order splitting experience for Walmart deliveries. The core value proposition relies on completely eliminating manual data entry via a Chrome Extension scraper, and drastically reducing assignment friction via a novel, high-speed UI, allowing a user to process a 30-item order in under 60 seconds.

### Target Users

1. **The Organizer (Primary Payer):** The individual who placed the order. They are motivated entirely by speed and accuracy. They want to get paid back without the cognitive load of calculating proportional taxes and tips in a spreadsheet.
2. **The Participant:** The roommate/friend who owes money. They never interact with the app directly, but they consume its output. They require ultimate transparency in exactly how their total (including their specific portion of taxes/fees) was calculated to minimize social friction.

### Key Design Challenges

- **High Data Density:** The UI must comfortably display potentially massive grocery orders (50-80+ line items) and accommodate multiple participants (4-10 people) without feeling cluttered.
- **Rapid Interaction Targets:** Because the goal is "under 90 seconds", the hit targets for item assignment must be large, obvious, and require zero precision. Dropdowns or modal popups for standard assignment will fail the speed metric.
- **State Visibility:** With so many items transitioning rapidly between "Unassigned", "Assigned 100% to User A", or "Split 50/50", the user needs immediate, highly scannable visual feedback on the state of every item.

### Design Opportunities

- **The "Single-Click Person Array":** By completely abandoning standard web form patterns (dropdowns/checkboxes) in favor of a horizontal, pill-based array of participant names attached to every line item, we can create a "tap-tap-tap" flow that feels more like a game than a chore.
- **Instant Mathematical Feedback:** Because all math is client-side, we have the opportunity to update the global totals in real-time (under 50ms) with every single tap, creating a highly satisfying, responsive loop that builds trust in the calculation engine.

## Core User Experience

### Defining Experience

The core action is the **rapid assignment of line items to individuals**. The user has a list of items and a list of people. The ultimate goal is to connect those two entities faster than someone could type the data into a spreadsheet. 

### Platform Strategy

- **Primary Platform:** Desktop Web Browser (Chrome). Because the initial data extraction relies on a Chrome Extension running on Walmart.com, the immediate handoff must occur on the same desktop environment. 
- **Interaction Model:** Mouse-driven click/target UI. While touch is eventual, the MVP must optimize for rapid mouse clicks (large hit areas, minimal precision required).

### Effortless interactions

- **Zero-Receipt Entry:** The single most tedious part of bill splitting (typing 30 items and their prices into a spreadsheet) happens invisibly and automatically via the extension.
- **Toggling over Typing:** Assigning an item requires a simple click on a person's name. Data entry is strictly limited to adding participant names to the roster, and optionally overriding default 50/50 splits with specific percentages or dollar amounts on individual items.
- **Defaulting to Equal:** By default, clicking multiple names on a single item inherently assumes an equal split for that item, requiring absolutely zero math from the user.

### Critical Success Moments

- **The "Aha!" Moment:** When the user clicks the extension on Walmart.com and a new tab instantly opens with their entire 50-item grocery order perfectly loaded and categorized. 
- **The Relief Moment:** When the user assigns the final item, looks at the bottom of the screen, and sees that the $18.52 tax and $15.00 driver tip have already been perfectly calculated proportionally without them touching a calculator.
- **The Handoff:** Clicking "Copy Summary" and pasting a perfectly formatted breakdown into iMessage.

### Flow Optimization Principles

- **Auto-Focus:** During "Roster Setup", the text input automatically focuses after hitting `Enter`, so a user can type "Mike [Enter] Sarah [Enter] Alex [Enter]" without touching the mouse.
- **The Toggling Rule:** If User A is assigned to an item, and the user clicks User B, the item is now assigned 50/50 to A and B. If the user clicks User A again, User A is removed, and the item is now 100% assigned to User B.

## Component Strategy

### Design System Components (Primitives)

We will use Radix UI (or a similar headless library like Headless UI) solely for accessible functionality, styling them completely with Tailwind to match our "Classic Minimalist" direction.

- **Toggle:** Used as the structural foundation for our "Participant Pill". It provides the accessible state management (pressed vs unpressed).
- **Collapsible / Accordion:** Used as the structural foundation for the "Custom Split" inline row expansion.
- **Toast:** Used for the "Copied to Clipboard" success notification.

### Custom Components

The application relies on three highly specific custom components that must be built from scratch.

#### 1. The Participant Pill (`<ParticipantPill />`)

**Purpose:** The primary interaction hit-target for assigning an item.
**Anatomy:** A rounded rectangle containing the participant's name.
**States:**
- *Inactive (Default):* White background, 1px Slate-200 border, Slate-600 text.
- *Hover:* Background extremely light Slate (Slate-50), cursor changes to pointer.
- *Active (Assigned):* Background Blue-600, Text White, Font-weight bold. Border disappears (or matches background).
**Interaction Behavior:** Tapping it flips a boolean state in the parent item. It must feel instantaneous.

#### 2. The Line Item Row (`<LineItemRow />`)

**Purpose:** Displays the receipt item, its cost, and houses the array of Participant Pills.
**Anatomy:** A full-width `flex-row`. Left side: Item Name & Qty. Top Right: Price. Bottom Right: Flex-wrap container for Participant Pills and the "Custom" button.
**States:**
- *Default:* Standard opacity.
- *Assigned (Complete):* The entire row drops to 50% opacity (except the active blue pills) to visually recede and tell the user "this is done."
- *Error (Custom Split Mismatch):* The row border turns Red-500 if a user attempts a custom split that does not equal the item's exact total.

#### 3. The Sticky Summary Footer (`<SummaryFooter />`)

**Purpose:** The persistent mathematical anchor. It proves the system is working and holds the final call-to-action.
**Anatomy:** A fixed div at `bottom-0`. Contains the "Assigned Total vs Receipt Total" calculation and the "Copy Summary" button.
**States:**
- *Incomplete:* The totals do not match. The button is Slate-200, text is Slate-400, and standard cursor (disabled).
- *Complete (Matched):* The button background transitions to Blue-600, text turns White, cursor becomes pointer. The text changes to "Copy Summary".

### Component Implementation Strategy

1. **Build `ParticipantPill` first.** It is dumb, stateless, and only receives props (`name`, `isActive`, `onClick`).
2. **Build `LineItemRow` second.** It manages the logic of how many pills are active, handles the "equal split" division mathematics for its specific price, and reports its assigned state back up to the main app state.
3. **Build `SummaryFooter` third.** It listens to the global state (the sum of all assigned rows) and conditionally styles its button based on that mathematical check.

## UX Consistency Patterns

### Button Hierarchy

In our "Classic Minimalist" design, visual weight communicates importance.

- **Primary Action (Global):** The ultimate goal of the page (e.g., "Copy Summary"). It is full-width, uses our primary Action Color (Blue-600), and is anchored to the bottom. It only activates when the math balances.
- **Primary Action (Row-level):** The `ParticipantPill`. It toggles state between Inactive (Outline) and Active (Blue-600 fill). 
- **Secondary Action (Row-level):** The "Custom Break" button. It must visually recede into the background. It is small text, no background fill, and only underlines on hover to indicate clickability.
- **Destructive Action:** If a user needs to remove a person from the roster entirely, the icon/button will be text-only (`text-red-500`), hidden by default, and only revealed on hover over the roster name.

### Feedback Patterns

The application must talk back to the user instantly so they never doubt the system state.

- **Instant Recalculation:** The moment a pill is toggled, the "Running Totals" footer must update within 50ms. No "Save" or "Calculate" buttons.
- **Visual Completion (The 'Done' State):** When an item's unassigned balance hits $0.00, the entire `<LineItemRow />` container drops to `opacity-50` (except the active blue pills). This physically guides the user's eye down the list to the next unfinished item.
- **Success Toast:** Upon clicking "Copy Summary", a small, centered toast notification appears briefly at the bottom stating "Copied to Clipboard! ✓" and fades out automatically.

### Form & Input Patterns

Although we are avoiding data entry, edge cases exist.

- **No Overlays:** "Custom Split" must never open a modal. It pushes the content below it down (accordion style) to reveal inline inputs.
- **Implicit Save:** In the Custom Split view, typing "3.50" into an input field saves that value instantly `onChange`. Clicking anywhere outside the row closes the accordion. No "Confirm" buttons.
- **Math Validation:** If custom inputs do not perfectly equal the item total (e.g., item is $10, user inputs $5 and $4), the border of that specific row turns Red-500, and a small red helper text explains the discrepancy ("$1.00 remaining").

### Error Prevention Patterns (Poka-Yoke)

- **The Impossible Button:** The final "Copy Summary" button is literally unclickable (`pointer-events-none`, grayed out) until `Assigned Total === Receipt Total`. This prevents the user from accidentally sending incomplete math to their friends.
- **Format Locking:** When editing a custom split dollar amount, the input field only accepts numbers and a single decimal point. It automatically formats to two decimal places on blur.

## Responsive Design & Accessibility

### Responsive Strategy

Because the application is launched from a Desktop Chrome Extension, our core target is **Desktop Web**. 

- **The Narrow Container Strategy:** We will not stretch the application to fill ultra-wide monitors. Reading a horizontal line item across 3000 pixels is exhausting. Instead, the main application will be capped at a `max-w-3xl` (768px) container centered on the screen.
- **Vertical Optimization:** The primary constraint is vertical height, not horizontal width. The Sticky Footer must remain visible regardless of browser height, and the scrolling area (`overflow-y-auto`) must dynamically fill the space between the header and the footer.

### Breakpoint Strategy

We will build using Tailwind's desktop-first approach (since mobile is not our target platform for MVP).

- **Base (`< 768px`):** If a user shrinks their browser window aggressively, the Participant Pills will wrap to a new line below the item name via `flex-wrap`.
- **`md` (768px+):** The optimal viewing experience. The container stops growing, and the layout centers itself using `mx-auto`.

### Accessibility Strategy

We will target **WCAG AA Compliance** to ensure the tool is usable by anyone.

**Key Accessibility Considerations:**
1. **Focus States:** Every interactive element (Pills, Custom button, Copy Summary) must have a distinct, high-contrast focus ring (e.g., `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`). The application must be fully usable via the `Tab` and `Enter` keys.
2. **Color Independence:** We do not rely on color alone to indicate state. Active pills become `font-bold` in addition to turning blue. Error states feature an explicit helper text ("$1.00 remaining") in addition to a red border.
3. **Screen Reader Context:** The `<ParticipantPill>` component must include `aria-pressed="true"` or `"false"` so screen readers can announce its toggle state. The "Running Totals" footer must use `aria-live="polite"` so the user is subtly notified when the math updates.

### Testing Strategy

- **Keyboard-Only Run:** The developer must be able to launch the app, add 3 names, and assign 5 items entirely without touching the mouse.
- **Zoom Testing:** The application must remain usable when the browser is zoomed to 200%. The narrow container strategy paired with `flex-wrap` on the pills ensures text will not overflow or clip when zoomed.

### Implementation Guidelines

1. **Semantic HTML:** Use `<button>` for pills, not `<div>` with `onClick`. Use `<ul>` and `<li>` for the lists of line items. Use `<main>` for the body and `<footer>` for the sticky bar.
2. **Accessible Math Forms:** In the "Custom Split" view, all inputs must have associated visually hidden `<label>` tags (e.g., "Custom dollar amount for Mike").

### Experience Principles

1. **Click First, Type Second:** Text input is reserved only for initial setup (names) and highly specific edge cases (custom split overrides). Everything else must be a toggle or a button.
2. **Math is Invisible:** The user should never see formulas or be asked to calculate proportions. The engine does the math silently.
3. **Impossibility of Error:** The total assigned cost must always equal the receipt total. The UI must clearly indicate if an item has been missed.

## Desired Emotional Response

### Primary Emotional Goals

- **For the Organizer:** Overwhelming Relief accompanied by a sense of "Speed/Power". The cognitive load of spreadsheet math has been eliminated, making them feel like they have a "superpower" for handling group finances.
- **For the Participant:** Absolute Trust. Because the final output clearly shows exactly how their proportional tax and tip were calculated, they feel confident they are paying their fair share, eliminating any social friction or annoyance.

### Emotional Journey Mapping

- **Discovery/Launch:** *Surprise & Delight.* When the user clicks the extension on Walmart.com, they expect a clunky process. Instead, seeing their entire 50-item cart instantly loaded into a clean UI creates an immediate "wow" moment.
- **The Core Action (Assigning):** *Flow & Satisfaction.* As they tap names and see the math instantly recalculate at the bottom of the screen, the process feels more like a satisfying mobile game than a financial chore.
- **Completion:** *Relief & Confidence.* When they click "Copy Summary" and see a perfectly formatted text block, they feel immediate relief that the dreaded task is over and complete confidence that the math is indisputable.

### Micro-Emotions

- **Confidence vs. Confusion:** The UI must always clearly indicate *what* is selected. If an item is split 50/50, the visual state must make that instantly obvious so the user never has to second-guess the system.
- **Trust vs. Skepticism:** The proportional math engine must be transparent. If a user tries to mentally calculate a subtotal to check the app's work, it must be 100% accurate down to the penny, or trust is instantly lost.

### Design Implications

- **For 'Flow & Satisfaction':** The "Single-Click Person Array" must have highly responsive hover states and instant, tactile active states (e.g., color fills, subtle scaling) so every click feels mechanically satisfying.
- **For 'Trust':** The real-time running totals at the bottom of the screen shouldn't jump violently; they could perhaps use a fast number-rolling animation to emphasize that the engine is actively *calculating* based on the user's input.
- **For 'Confidence':** Items that are 100% assigned should visually recede (e.g., dropping opacity) so the user's attention is naturally drawn only to the items that still require action, creating a clear path to completion.

### Emotional Design Principles

1. **Make it Tactile:** The interface should feel crisp, responsive, and satisfying to touch/click.
2. **Never Hide the Math:** The final output must be so clear that no one ever has to ask, "Wait, how did you calculate my tax?"
3. **Celebrate Completion:** Reaching the end of the list and having zero unassigned items should feel like winning a level.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

- **Splitwise:** The giant in the space. They handle the "who owes who" math perfectly, but their data-entry UI for itemized receipts is famously atrocious (requiring exact monetary typing over and over). 
- **Linear / Superhuman:** Professional tools known for "blazing fast" workflows. They achieve this by eliminating modal pop-ups and keeping all state changes directly on the main surface layer (inline editing).
- **Notion:** Specifically, their multi-select "Tag" or "Pill" components. They allow users to rapidly assign multiple properties to a single row with instant visual feedback.

### Transferable UX Patterns

- **The "Tag Pill" Array (From Notion):** Instead of dropdowns, we use horizontal rows of pill-shaped buttons. Clicking a pill toggles it active (filled coloring) or inactive (outlined/dimmed).
- **Inline Row Editing (From Linear):** If a user needs to activate the "Custom Split" override, the row should simply expand inline rather than opening a blocking modal window that disrupts their flow.
- **Sticky Summary Footer:** As the user scrolls down a massive 50-item list, the "Running Totals" calculation must remain sticky at the bottom of the viewport so they never lose sight of the target (the receipt grand total).

### Anti-Patterns to Avoid

- **The Modal Trap:** Never open a popup modal to assign a person to an item. This adds a "click to open, click to select, click to close" penalty (3x friction) to every single item.
- **Hidden Math:** Never show a finalized number without the ability to hover/click to see the formula used to get there.
- **Micro-Targeting:** Avoid small checkboxes or tiny "x" buttons. The entire "Participant Pill" should be a massive hit target.

### Design Inspiration Strategy

**What to Adopt:**
- The visual language of modern, clean fintech (Venmo/CashApp) to establish financial trust.
- The interaction speed of productivity apps (Linear) where everything happens inline.

**What to Adapt:**
- We will adapt the standard "Multi-Select Tag" pattern, but instead of tags, they are Participant Names permanently affixed to every single line item row.

## 2. Core User Experience

### 2.1 Defining Experience

The defining experience is the **High-Speed Assignment Loop**. It’s the repetitive, satisfying rhythm of scrolling down a list of 50 items and simply tapping participant names to assign costs. The interaction should feel less like data entry and more like playing a casual mobile game—"Tap, tap, scroll, tap."

### 2.2 User Mental Model

Users bring a "Spreadsheet Mental Model" to this task. They expect to have to look at an item, look at the price, calculate a percentage in their head, and type that number into a cell next to someone’s name. 
Our UX shatters this expectation. By defaulting entirely to equal splits (tapping two names means a 50/50 split automatically), we remove the mental math step entirely. The user only needs to think about *who* consumed the item, not *how much* they owe for it.

### 2.3 Success Criteria

- **Zero-Friction Hit Targets:** A user must be able to click a participant's name pill without needing pixel-perfect mouse precision. The target area must be large and padded.
- **Microsecond Visual Feedback:** The moment a pill is clicked, its color state must change instantly (e.g., from an outlined, inactive state to a bold, filled color).
- **Macro Mathematical Feedback:** Within 50ms of that click, the "Total Owed" sticky footer at the bottom of the screen must recalculate to reflect the new assignment + proportional tax + proportional tip.
- **Visual Completion state:** When an item is fully assigned, the row should visually fade or shrink slightly to naturally guide the user's eye to the next unassigned item.

### 2.4 Novel UX Patterns

**The Persistent Participant Array**
In traditional web forms, to assign multiple people to an item, you would click a dropdown, check multiple boxes, and click out. 
Our novel pattern takes the contents of that dropdown and permanently explodes them horizontally across every single row. If there are 4 people in the split, there are 4 permanent "Tag Pills" on every single line item.

**The "Custom Split" Progressive Disclosure**
Because 90% of items are either 100% personal or split equally, we must hide the complexity of "Person A pays $5 and Person B pays $2" behind progressive disclosure. The "Custom" button is a small, secondary action on the row that expands to reveal a percentage/dollar override input, only when explicitly requested.

### 2.5 Experience Mechanics

1. **Initiation:** The user sets up the roster at the top of the page (e.g., adding "Mike", "Sarah", "Alex"). These names instantly populate as pills on every row below.
2. **Interaction:** The user clicks "Mike" on row 1 (Chicken Breasts). 
3. **Feedback:** "Mike" instantly turns blue. The "Unassigned Amount" drops from $10 to $0. At the bottom of the screen, Mike's running total increases from $0.00 to $11.15 (reflecting the $10 item + his new proportional share of the global tax/tip).
4. **Completion:** The user reaches the bottom of the list. A large, satisfying "Summary" button glows to indicate that the math balances perfectly and the breakdown is ready to copy.

## Design System Foundation

### 1.1 Design System Choice

**Tailwind CSS (Vanilla) with Headless Radix UI Primitives.** 
*(Note: If the developer prefers a pre-built component library for speed, shadcn/ui on top of Tailwind is the optimal compromise layer).*

### Rationale for Selection

- **Performance:** For an extension processing 80+ item arrays with real-time math, we need an incredibly lightweight DOM. Heavy UI frameworks (like Material UI or Ant Design) inject massive amounts of boilerplate CSS and JS that will hurt our 60fps render targets. Tailwind compiles to only the exact utility classes used.
- **Custom Interaction:** Standard component libraries do not have a "Single-Click Person Array". We have to build this highly custom interaction pattern from scratch. Tailwind allows for rapid styling of custom components, while Radix UI can provide the unstyled, accessible behavioral primitives (like Tooltips and Accordions for the Custom Split view).
- **The "Clean Fintech" Aesthetic:** Tailwind's default color palettes and spacing scales naturally lean toward modern, clean, high-contrast designs, which perfectly supports our emotional goal of building "Absolute Trust".

### Implementation Approach

1. **Global CSS:** A tiny `index.css` establishing Tailwind directives and core variables.
2. **Component Architecture:** We will build our custom "Tag Pill" and "Line Item Row" as strict React components, wrapping Tailwind utility classes to ensure visual consistency across the massive 50-item list.
3. **Behavioral Primitives:** When we need complex behaviors (like drop-down menus or accessible modals if absolutely necessary for edge cases), we will use unstyled Headless UI or Radix primitives and style them with our Tailwind utility classes.

### Customization Strategy

- **Color Tokens:** We will define a very strict semantic color palette. 
  - `Action` (The color of an unassigned pill waiting to be tapped)
  - `Success/Assigned` (The color of a pill when a user's name is toggled ON)
  - `Error/Incomplete` (The color of the total if the math doesn't perfectly match the receipt).
- **Animation Strategy:** We will utilize Tailwind's built in `transition` and `hover` utilities (e.g., `transition-all duration-75`) to create the rapid, tactile feedback required for the "Tag Pill" array.

## Visual Design Foundation

### Color System

To achieve the "Clean Fintech" aesthetic, the application will use a stark, high-contrast monochrome base, relying on a single, vibrant primary color solely for interaction feedback.

- **Backgrounds:** Pure White (`#FFFFFF`) to mimic the feeling of a clean physical receipt.
- **Surface/Cards:** Extremely subtle cool gray (`#F8FAFC` - Tailwind Slate 50) to separate the sticky footer from the scrolling list.
- **Typography:** Deep Slate (`#0F172A` - Tailwind Slate 900) rather than pure black, to reduce eye strain while scanning long lists.
- **The "Action" Color (Primary):** An electric, trustworthy blue (`#2563EB` - Tailwind Blue 600). This color is reserved EXCLUSIVELY for active participant pills and the final "Copy Summary" button. If it is blue, it means the system has registered the user's input.
- **The "Error" Color:** A sharp red (`#EF4444` - Tailwind Red 500), used only if the grand total of the assignments does not perfectly match the receipt total.

### Typography System

We need a typography system that makes dense financial data highly scannable. We will avoid system fonts and playful serifs entirely.

- **Primary Font:** `Inter` (or similar geometric sans-serif like `Roboto`). Inter is specifically designed for high legibility on computer screens and handles tabular numbers beautifully (so the dollar signs and decimal points align vertically as the user scrolls).
- **Scale Strategy:** We will use a very tight typographic scale. The receipt items themselves will use the base size (16px), while the Participant Pills will use a slightly smaller, bolder size (14px font-semibold) to maintain density without sacrificing readability.

### Spacing & Layout Foundation

Due to the "High Data Density" challenge (80+ items), we must use space efficiently while still maintaining the "Large Hit Target" success criteria.

- **The List Layout:** A single-column, full-width vertical list. Each line item is a horizontal flex container.
- **Density Controls:** We will use a tight `8px` grid system. The horizontal padding between Participant Pills will be minimal (`4px`), but the internal padding of the pill itself will be generous (`px-3 py-1.5`) to maximize the click area.
- **The Sticky Footer:** A permanent structural element anchored to the bottom of the viewport containing the mathematically critical "Running Totals". This layout ensures the user never has to scroll to see if their math is balancing.

### Accessibility Considerations

- **Color Contrast:** The electric blue (`#2563EB`) against the white background (`#FFFFFF`) passes WCAG AA contrast standards. Active pills will use white text on the blue background, while inactive pills will use slate text on a transparent background with a subtle slate border.
- **State Changes:** We will not rely on color alone to indicate state. When a participant pill is clicked, it will change color (blue background) but also change weight (from normal to semi-bold) and optionally gain a subtle checkmark icon, ensuring users with color vision deficiencies can still perceive the state change.

## Design System Foundation

### 1.1 Design System Choice

**Tailwind CSS (Vanilla) with Headless Radix UI Primitives.** 
*(Note: If the developer prefers a pre-built component library for speed, shadcn/ui on top of Tailwind is the optimal compromise layer).*

### Rationale for Selection

- **Performance:** For an extension processing 80+ item arrays with real-time math, we need an incredibly lightweight DOM. Heavy UI frameworks (like Material UI or Ant Design) inject massive amounts of boilerplate CSS and JS that will hurt our 60fps render targets. Tailwind compiles to only the exact utility classes used.
- **Custom Interaction:** Standard component libraries do not have a "Single-Click Person Array". We have to build this highly custom interaction pattern from scratch. Tailwind allows for rapid styling of custom components, while Radix UI can provide the unstyled, accessible behavioral primitives (like Tooltips and Accordions for the Custom Split view).
- **The "Clean Fintech" Aesthetic:** Tailwind's default color palettes and spacing scales naturally lean toward modern, clean, high-contrast designs, which perfectly supports our emotional goal of building "Absolute Trust".

### Implementation Approach

1. **Global CSS:** A tiny `index.css` establishing Tailwind directives and core variables.
2. **Component Architecture:** We will build our custom "Tag Pill" and "Line Item Row" as strict React components, wrapping Tailwind utility classes to ensure visual consistency across the massive 50-item list.
3. **Behavioral Primitives:** When we need complex behaviors (like drop-down menus or accessible modals if absolutely necessary for edge cases), we will use unstyled Headless UI or Radix primitives and style them with our Tailwind utility classes.

### Customization Strategy

- **Color Tokens:** We will define a very strict semantic color palette. 
  - `Action` (The color of an unassigned pill waiting to be tapped)
  - `Success/Assigned` (The color of a pill when a user's name is toggled ON)
  - `Error/Incomplete` (The color of the total if the math doesn't perfectly match the receipt).
- **Animation Strategy:** We will utilize Tailwind's built in `transition` and `hover` utilities (e.g., `transition-all duration-75`) to create the rapid, tactile feedback required for the "Tag Pill" array.
