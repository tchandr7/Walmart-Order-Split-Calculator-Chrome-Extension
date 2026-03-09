# Story 1.1: Initialize React Application Architecture

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to initialize the Vite + React-TS + CRXJS application structure,
So that we have a foundation to build the extension and web app upon.

## Acceptance Criteria

1. **Given** an empty project directory **When** the developer runs the initialization commands **Then** a Vite React-TypeScript project is created with @crxjs/vite-plugin installed.
2. **And** the project builds successfully and can be loaded as unpacked extension in Chrome.

## Tasks / Subtasks

- [ ] Initial App Setup (AC: 1, 2)
  - [ ] Initialize project with `npm create vite@latest . -- --template react-ts`
  - [ ] Install core dependencies: `npm install @crxjs/vite-plugin@latest -D`
  - [ ] Configure `vite.config.ts` for CRXJS and React
  - [ ] Create initial `manifest.json` for Manifest V3 extension
  - [ ] Install Tailwind CSS, Headless UI (Radix), and Zustand
  - [ ] Verify build and unpacked extension loading in Chrome

## Dev Notes

- **Starter Template MUST BE:** Vite + React-TS + CRXJS (@crxjs/vite-plugin).
- **State Management MUST BE:** Zustand (5.0.x) with `persist` middleware.
- **UI behavioral primitives MUST BE:** Radix UI.
- **Styling MUST BE:** Vanilla CSS / Tailwind CSS.
- Because it's a Chrome Extension with React, ensure the entry points in `manifest.json` correctly map to the React outputs (via CRX plugin).

### Project Structure Notes

- Standard Vite React TS structure.
- Extension specific files (`manifest.json`, `background.ts`/`content.ts` placeholders if needed later) should be set up correctly in `vite.config.ts` using `@crxjs/vite-plugin`.

### References

- [_bmad-output/planning-artifacts/architecture.md]
- [_bmad-output/planning-artifacts/epics.md]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
