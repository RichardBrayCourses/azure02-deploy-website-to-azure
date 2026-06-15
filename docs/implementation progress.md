# All Checks Out - Implementation Progress

# Purpose

This document tracks progress against `docs/implementation plan.md`.

Future agents should read these documents in this order:

1. `fullhandover.md`
2. `docs/user stories.md`
3. `docs/implementation plan.md`
4. `docs/implementation progress.md`

Use this file to understand:

- What has already been implemented
- What is partially implemented
- What remains
- What the next recommended coding step is
- Which checks were last run

---

# Current Status Summary

Phase 1, Phase 1.5, Phase 2, Phase 3, Phase 4 and Phase 5 are complete.

The app now has:

- In-memory domain DTOs and entity classes
- An `InMemoryAllChecksOutDatabase`
- Domain command/query methods for the major user stories
- Refreshable view-model exports
- `DomainDataContext`
- App-level `DomainDataProvider`
- Existing screens subscribed to domain data refreshes
- Administration hub and consistent Administration resource navigation
- Shared `ResourceActionPanel` pattern for CRUD/action forms
- Authority/Participant/Stakeholder case experience partially separated by role
- Authority setup CRUD flows for participants, participant users, stakeholders, stakeholder users and stakeholder access
- Participant task response, evidence upload, task submission and case submission flows
- Authority task review controls for submitted participant tasks

The next implementation work should start Phase 6: Stakeholder Read-Only Portal.

---

# Last Verified Checks

Last known successful checks:

```text
npm run type-check
npm run build
```

Working directory for checks:

```text
monorepo/apps/ui
```

---

# Phase Progress

## Phase 1 - Domain Store Plumbing

Status:

```text
Complete
```

Implemented:

- Added `DomainDataContext`
- Added `DomainDataProvider`
- Added `useDomainData`
- Provider wraps the application in `App.tsx`
- View-model exports in `console.ts` are refreshable
- Added `refreshConsoleViewModels()`
- Existing UI can re-render after future domain mutations via `refresh()`

Important files:

```text
monorepo/apps/ui/src/context/DomainDataContext.tsx
monorepo/apps/ui/src/App.tsx
monorepo/apps/ui/src/data/console.ts
```

How future UI code should mutate data:

```ts
const { db, refresh } = useDomainData();

db.createParticipant(...);
refresh();
```

Notes:

- Existing helper imports such as `participants`, `cases`, `authorities`, `getScopedCases`, etc. still work.
- The exported view arrays are live bindings rebuilt by `refreshConsoleViewModels()`.
- React screens subscribe to `version` from `useDomainData()`.

---

## Phase 1.5 - Administration Navigation Foundation

Status:

```text
Complete
```

Implemented:

- `/admin` is now a real Administration hub instead of redirecting to Participants
- 3x3 launcher sends Authority users to `/admin`
- Authority default path is `/admin`
- Administration pages include a consistent resource navigation strip
- Administration resources are reachable from inside Administration:
  - Participants
  - Stakeholders
  - Case templates
  - Task types
  - Users
- Added shared `ResourceActionPanel`
- Refactored existing Phase 2 action forms to use `ResourceActionPanel`

Important files:

```text
monorepo/apps/ui/src/App.tsx
monorepo/apps/ui/src/components/ResourceActionPanel.tsx
monorepo/apps/ui/src/pages/ConsolePages.tsx
monorepo/apps/ui/src/data/console.ts
```

Acceptance covered:

- Authority user can open Administration from the app launcher
- Authority user can reach every Administration resource from inside Administration
- Existing Participants and Stakeholders pages remain reachable
- CRUD/action forms use the shared panel pattern
- Login screen unchanged
- `npm run type-check` passes
- `npm run build` passes

---

## Phase 2 - Authority Setup CRUD

Status:

```text
Complete
```

Stories covered:

- Authority User Story 1 - Create a Participant
- Authority User Story 2 - Create Participant User
- Authority User Story 3 - Create a Stakeholder
- Authority User Story 4 - Create Stakeholder User
- Authority User Story 5 - Grant Stakeholder Access

Domain support:

```text
Available
```

Relevant domain commands already exist:

```ts
db.createParticipant(...)
db.createParticipantUser(...)
db.createStakeholder(...)
db.createStakeholderUser(...)
db.grantStakeholderAccess(...)
```

Implemented:

- Added Create Participant flow on Participants page
- Added participant users list and Create User flow on Participant detail
- Replaced Stakeholders placeholder with real Stakeholders page
- Added Stakeholder detail page
- Added Stakeholder users list and Create User flow
- Added Grant Participant Access flow
- All mutations use `useDomainData()`, domain commands and `refresh()`

Important files:

```text
monorepo/apps/ui/src/pages/ConsolePages.tsx
monorepo/apps/ui/src/App.tsx
```

Acceptance covered:

- Authority admin can create an Organisation participant
- Authority admin can create a Person participant
- New participant is scoped to the current authority
- Authority admin can create Participant users with Admin or Member role
- Authority admin can create Stakeholders
- Authority admin can create Stakeholder users with Admin or Member role
- Authority admin can grant Stakeholder access to Participants
- Duplicate access is blocked by the domain command
- Login screen is unchanged
- `npm run type-check` passes
- `npm run build` passes

---

## Phase 3 - Case Template Workflow

Status:

```text
Complete
```

Stories covered:

- Authority User Story 6 - Create a Case Template
- Authority User Story 7 - Add Tasks to a Case Template
- Authority User Story 8 - Assign Participants to a Template
- Authority User Story 9 - Publish a Template

Domain support:

```text
Available
```

Relevant domain commands already exist:

```ts
db.createCaseTemplate(...)
db.addTaskToTemplate(...)
db.assignParticipantToTemplate(...)
db.publishTemplate(...)
```

Implemented:

- Replace Case Templates placeholder with real list page
- Add Case Template detail page
- Add task configuration UI
- Add participant assignment UI
- Add publish action
- Show generated cases after publish
- Use Administration resource navigation
- Use `ResourceActionPanel` for create/add/assign flows
- Use `useDomainData()`, domain commands and `refresh()`

Important files:

```text
/admin/case-templates
/admin/case-templates/:templateId
```

Acceptance covered:

- Authority admin can create a draft template
- Authority admin can add configured tasks to a template
- Authority admin can assign required or exempt participants
- Authority admin can publish a valid draft template
- Publishing creates generated cases and case tasks through the domain command
- Generated cases appear on the template detail page
- `npm run type-check` passes
- `npm run build` passes

---

## Phase 4 - Participant Case Workflow

Status:

```text
Complete
```

Stories covered:

- Participant User Story 1 - View Assigned Cases
- Participant User Story 2 - Open a Case
- Participant User Story 3 - Complete a Task
- Participant User Story 4 - Upload Evidence
- Participant User Story 5 - Submit a Task
- Participant User Story 6 - Submit a Case
- Participant User Story 7 - View Review Outcomes

Already implemented:

- Participant users can view scoped cases
- Participant users can open a case
- Participant users can open task workbench screens
- Authority users are blocked from direct task workbench access
- Stakeholders are blocked from participant task workbench access
- Participant users can save simple task responses through `db.completeTask(...)`
- Participant users can upload fake evidence metadata through `db.uploadEvidence(...)`
- Participant users can submit tasks through `db.submitTask(...)`
- Participant users can submit a case through `db.submitCase(...)` once active tasks are ready
- Participant case/task views show passed and failed review outcomes from domain status
- Task detail reads persisted response, evidence metadata and last-updated timestamps from the domain view model

Domain support:

```text
Available
```

Relevant domain commands already exist:

```ts
db.completeTask(...)
db.uploadEvidence(...)
db.submitTask(...)
db.submitCase(...)
```

Acceptance covered:

- Participant user sees only scoped cases
- Participant user can open scoped cases and task workbench screens
- Task response saves to `responseJson`
- Evidence upload stores file metadata only
- Submitted task status is persisted by the domain command
- Submit case is disabled until all active tasks are submitted or passed
- Failed and passed task outcomes are visible to the participant
- `npm run type-check` passes
- `npm run build` passes

---

## Phase 5 - Authority Review Workflow

Status:

```text
Complete
```

Stories covered:

- Authority User Story 10 - Review Participant Submissions

Already implemented:

- Authority case detail no longer links into participant task workbench
- Authority case detail shows task review context with participant response and evidence metadata
- Direct navigation to `/cases/:caseId/tasks/:taskId` redirects Authority users back to case summary
- Authority users can pass submitted tasks through `db.reviewTask(caseTaskId, "PASSED")`
- Authority users can fail submitted tasks through `db.reviewTask(caseTaskId, "FAILED")`
- Review actions call `refresh()` so case and task status update immediately
- Participant users see passed and failed outcomes through the existing participant case views

Domain support:

```text
Available
```

Relevant domain command already exists:

```ts
db.reviewTask(caseTaskId, "PASSED" | "FAILED")
```

Acceptance covered:

- Authority user can approve a submitted task
- Authority user can reject a submitted task
- Participant users do not see authority review controls
- Direct authority navigation to participant task workbench remains blocked
- Case status recalculates through the domain command after review
- Participant can see updated passed or failed task outcomes
- `npm run type-check` passes
- `npm run build` passes

Important note:

Task activity timestamps are currently UI-side mock data in `ConsolePages.tsx`. Long term, move this into domain audit/activity records.

---

## Phase 6 - Stakeholder Read-Only Portal

Status:

```text
Partially started
```

Stories covered:

- Stakeholder User Story 1 - View Accessible Participants
- Stakeholder User Story 2 - View Participant Status
- Stakeholder User Story 3 - View Case Details
- Stakeholder User Story 4 - View Task Outcomes
- Stakeholder User Story 5 - View Evidence

Already implemented:

- Stakeholder users see scoped participants via approved access
- Stakeholder portal shows visible cases
- Stakeholder case detail no longer shows full task list
- Stakeholder case detail now shows outcome and participant performance summary

Domain support:

```text
Partially available
```

Relevant query exists:

```ts
db.getAccessibleParticipantsForStakeholder(...)
```

UI work remaining:

- Add participant-level stakeholder detail route
- Add stronger read-only participant performance view
- Decide and implement evidence visibility rule
- Optionally add task outcome summary without task workbench detail

Recommended evidence visibility rule for first release:

```text
Stakeholders see evidence metadata for submitted, passed or failed tasks on participants they are approved to monitor.
```

---

## Phase 7 - Published Template Changes

Status:

```text
Not started
```

Stories covered:

- Authority User Story 11 - Withdraw a Task After Publication
- Authority User Story 12 - Add a New Task After Publication

Domain support:

```text
Available
```

Relevant domain commands already exist:

```ts
db.withdrawTemplateTask(...)
db.addTaskToTemplate(...)
```

UI work remaining:

- Add withdraw task action on template task list
- Add reason capture
- Show withdrawn task state
- Show created-after-publish state
- Confirm existing cases receive new tasks after published template update

Recommended timing:

Implement after Phase 3 and Phase 4 are stable.

---

# Cross-Cutting Work Remaining

## Tests

Status:

```text
Not started
```

Recommended:

- Add Vitest
- Add domain command tests for `InMemoryAllChecksOutDatabase`

High-value tests:

- User kind exclusivity
- Create participant scopes to authority
- Create participant user creates UserAccount and ParticipantUser
- Grant stakeholder access blocks cross-authority access
- Publish template creates cases and case tasks
- Submit case fails while active tasks are incomplete
- Review task recalculates case status
- Withdraw template task withdraws incomplete case tasks
- Add task after publication creates case tasks for existing cases

## Audit / Activity Model

Status:

```text
Not started
```

Current situation:

- Authority task activity display uses mock UI-side data

Recommended future model:

```text
AuditEvent
```

Possible fields:

```text
id
authority_id
actor_user_account_id
entity_type
entity_id
event_type
summary
metadata_json
created_at
```

Do not implement this before the main user-story flows unless activity accuracy becomes blocking.

---

# What To Do Next

Recommended immediate next step:

```text
Start Phase 6 with stakeholder participant detail and evidence metadata visibility.
```

Suggested agent prompt:

```text
Please implement Phase 6: Stakeholder read-only portal polish.

Read:
- fullhandover.md
- docs/user stories.md
- docs/implementation plan.md
- docs/implementation progress.md

Requirements:
- Preserve the login screen
- Keep stakeholder portal read-only
- Add stakeholder participant-level detail route
- Add stronger participant performance view
- Implement the first-release evidence visibility rule
- Use useDomainData()
- Stakeholders should see evidence metadata for submitted, passed or failed tasks on approved participants
- Keep the existing UI style
- Run npm run type-check and npm run build
```

---

# Implementation Checklist

## Authority

- [x] Create Participant
- [x] Create Participant User
- [x] Create Stakeholder
- [x] Create Stakeholder User
- [x] Grant Stakeholder Access
- [x] Create Case Template
- [x] Add Tasks to Case Template
- [x] Assign Participants to Template
- [x] Publish Template
- [ ] Review Participant Submissions
- [ ] Withdraw Task After Publication
- [ ] Add New Task After Publication

## Participant

- [x] View Assigned Cases
- [x] Open a Case
- [ ] Complete a Task
- [ ] Upload Evidence
- [ ] Submit a Task
- [ ] Submit a Case
- [ ] View Review Outcomes

## Stakeholder

- [x] View Accessible Participants
- [x] View Participant Status
- [x] View Case Details
- [ ] View Task Outcomes
- [ ] View Evidence

## Plumbing

- [x] Domain DTOs and entity classes
- [x] In-memory database
- [x] Domain commands
- [x] Refreshable view models
- [x] Domain data React provider
- [x] Administration hub/resource navigation
- [x] Shared ResourceActionPanel
- [ ] Domain command tests
