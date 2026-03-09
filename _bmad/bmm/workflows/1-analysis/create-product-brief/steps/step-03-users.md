---
name: 'step-03-users'
description: 'Define target users with rich personas and map their key interactions with the product'

# File References
nextStepFile: '{project-root}/_bmad/bmm/workflows/1-analysis/create-product-brief/steps/step-04-metrics.md'
outputFile: '{planning_artifacts}/product-brief-{{project_name}}-{{date}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Target Users Discovery

## STEP GOAL:

Define target users with rich personas and map their key interactions with the product through collaborative user research and journey mapping.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a product-focused Business Analyst facilitator
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring structured thinking and facilitation skills, while the user brings domain expertise and product vision
- ✅ Maintain collaborative discovery tone throughout

### Step-Specific Rules:

- 🎯 Focus only on defining who this product serves and how they interact with it
- 🚫 FORBIDDEN to create generic user profiles without specific details
- 💬 Approach: Systematic persona development with journey mapping
- 📋 COLLABORATIVE persona development, not assumption-based user creation

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 💾 Generate user personas and journeys collaboratively with user
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to proceed without user confirmation through menu

## CONTEXT BOUNDARIES:

- Available context: Current document and frontmatter from previous steps, product vision and problem already defined
- Focus: Creating vivid, actionable user personas that align with product vision
- Limits: Focus on users who directly experience the problem or benefit from the solution
- Dependencies: Product vision and problem statement from step-02 must be complete

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Begin User Discovery

**Opening Exploration:**
"Now that we understand what {{project_name}} does, let's define who it's for.

**User Discovery:**

- Who experiences the problem we're solving?
- Are there different types of users with different needs?
- Who gets the most value from this solution?
- Are there primary users and secondary users we should consider?

Let's start by identifying the main user groups."

### 2. Primary User Segment Development

**Persona Development Process:**
For each primary user segment, create rich personas:

**Name & Context:**

- Give them a realistic name and brief backstory
- Define their role, environment, and context
- What motivates them? What are their goals?

**Problem Experience:**

- How do they currently experience the problem?
- What workarounds are they using?
- What are the emotional and practical impacts?

**Success Vision:**

- What would success look like for them?
- What would make them say "this is exactly what I needed"?

**Primary User Questions:**

- "Tell me about a typical person who would use {{project_name}}"
- "What's their day like? Where does our product fit in?"
- "What are they trying to accomplish that's hard right now?"

### 3. Secondary User Segment Exploration

**Secondary User Considerations:**

- "Who else benefits from this solution, even if they're not the primary user?"
- "Are there admin, support, or oversight roles we should consider?"
- "Who influences the decision to adopt or purchase this product?"
- "Are there partner or stakeholder users who matter?"

### 4. User Journey Mapping

**Journey Elements:**
Map key interactions for each user segment:

- **Discovery:** How do they find out about the solution?
- **Onboarding:** What's their first experience like?
- **Core Usage:** How do they use the product day-to-day?
- **Success Moment:** When do they realize the value?
- **Long-term:** How does it become part of their routine?

**Journey Questions:**

- "Walk me through how [Persona Name] would discover and start using {{project_name}}"
- "What's their 'aha!' moment?"
- "How does this product change how they work or live?"

### 5. Generate Target Users Content

**Content to Append:**
Prepare the following structure for document append:

```markdown
## Target Users

### Primary Users

[Primary user segment content based on conversation]

### Secondary Users

[Secondary user segment content based on conversation, or N/A if not discussed]

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
    * The app also asks to specify who actually paid for the order (The "Payer Entity"), which may or may not be one of the participants.
5.  **The Split (Assignment):**
    * For each product, the Payer uses the high-speed "Single-Click Person Array" UI to assign the item to a name. 
    * If a product has multiple quantities, the Payer assigns each individual quantity to a person.
    * For shared items, the Payer can select multiple people, and the app defaults to dividing the item cost equally among them.
    * *Advanced Option:* For edge cases, the Payer can hit a "Custom Split" button on an item to specify exact percentages (e.g., 80/20).
6.  **Calculation:** Once all items are assigned, the app automatically calculates subtotal-proportional tax and tip for each person.
7.  **Final Review & Output:** 
    * A final screen shows exactly what each participant owes the Payer Entity.
    * The Payer generates a summary link, image, or spreadsheet output to send to the group chat. Everyone easily sees what they owe.
```

### 6. Present MENU OPTIONS

**Content Presentation:**
"I've mapped out who {{project_name}} serves and how they'll interact with it. This helps us ensure we're building something that real people will love to use.

**Here's what I'll add to the document:**
[Show the complete markdown content from step 5]

**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Read fully and follow: {advancedElicitationTask} with current user content to dive deeper into personas and journeys
- IF P: Read fully and follow: {partyModeWorkflow} to bring different perspectives to validate user understanding
- IF C: Save content to {outputFile}, update frontmatter with stepsCompleted: [1, 2, 3], then read fully and follow: {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu with updated content
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [user personas finalized and saved to document with frontmatter updated], will you then read fully and follow: `{nextStepFile}` to begin success metrics definition.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Rich, believable user personas with clear motivations
- Clear distinction between primary and secondary users
- User journeys that show key interaction points and value creation
- User segments that align with product vision and problem statement
- A/P/C menu presented and handled correctly with proper task execution
- Content properly appended to document when C selected
- Frontmatter updated with stepsCompleted: [1, 2, 3]

### ❌ SYSTEM FAILURE:

- Creating generic user profiles without specific details
- Missing key user segments that are important to success
- User journeys that don't show how the product creates value
- Not connecting user needs back to the problem statement
- Not presenting standard A/P/C menu after content generation
- Appending content without user selecting 'C'
- Not updating frontmatter properly

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
