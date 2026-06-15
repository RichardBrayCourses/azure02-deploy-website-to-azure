# All Checks Out - Implementation Plan

# Purpose

This document is a coding plan for implementing the user stories in `docs/user stories.md`.

It is written for humans and coding agents. It explains:

- Current application state
- Implementation principles
- Recommended order of work
- Domain behaviours required
- UI changes required
- Acceptance checks for each user story
- Suggested files to modify
- Risks and guardrails

Use this alongside:

- `fullhandover.md`
- `handover.md`
- `docs/user stories.md`
- `monorepo/apps/ui/src/data/console.ts`

---

# Current State

The UI app is a React/Vite TypeScript application in:

```text
monorepo/apps/ui
```

The current implementation includes:

- A sign-in screen for Authority, Participant and Stakeholder users
- No System Owner sign-in option
- Header, app launcher and global search
- Authority admin pages
- Participant list/detail pages
- Case list/detail pages
- Task detail page
- Stakeholder read-only portal
- In-memory domain data in `src/data/console.ts`
- TypeScript DTOs and entity classes for the domain model
- An `InMemoryAllChecksOutDatabase` with seeded data
- Domain command/query methods for the major user-story operations

The current UI is mostly read-oriented. The next work is to wire user actions to the in-memory domain commands, add forms/modals/tabs where needed, and ensure the UI refreshes after mutations.

---

# Non-Negotiable Requirements

## Preserve the Login Screen

The existing login screen is intentionally liked and should not be redesigned.

Do not add System Owner login.

Allowed login roles remain:

```text
Authority
Participant
Stakeholder
```

## Keep the Domain Model Authoritative

The domain model in `fullhandover.md` is the source of truth.

Do not invent extra user kinds, permission levels or tenant-sharing rules.

Tenant boundary is:

```text
Authority
```

All business data belongs to exactly one Authority, except global `TaskType`.

## User Kind Rule

A user belongs to exactly one user kind:

```text
SYSTEM_OWNER
AUTHORITY
PARTICIPANT
STAKEHOLDER
```

The UI should only expose:

```text
AUTHORITY
PARTICIPANT
STAKEHOLDER
```

Do not allow a user to be both Participant and Stakeholder, or Authority and Participant, etc.

## Preserve Existing UI Feel

The current UI is restrained, clear and console-like. Keep that character.

Prefer:

- Tables
- Compact forms
- Tabs
- Simple status badges
- Modals or inline panels for create/edit actions

Avoid:

- Landing-page style sections
- Decorative hero blocks
- Large visual redesigns
- Nested cards
- Unnecessary animation

---

# Architecture Target

The target architecture for this prototype should be:

```text
React UI
  |
  +-- View models / selectors
  |
  +-- InMemoryAllChecksOutDatabase command/query methods
        |
        +-- DTOs
        +-- Entity classes
        +-- Seeded in-memory data
```

UI components should not manually mutate entity arrays.

UI components should call command methods such as:

```ts
db.createParticipant(...)
db.createStakeholder(...)
db.grantStakeholderAccess(...)
db.publishTemplate(...)
db.submitTask(...)
db.reviewTask(...)
```

After each mutation, the UI must refresh its local state.

Because `db` is currently a module-level in-memory object, React will not automatically re-render when it mutates. Add a small store/provider wrapper before wiring forms.

Recommended addition:

```text
src/context/DomainDataContext.tsx
```

Suggested API:

```ts
type DomainDataContextValue = {
  version: number;
  refresh: () => void;
  db: InMemoryAllChecksOutDatabase;
};
```

Pattern:

```ts
const { db, refresh } = useDomainData();

function onSave() {
  db.createParticipant(...);
  refresh();
}
```

This keeps the prototype simple while making UI mutations visible.

---

# Recommended Implementation Order

Implement in vertical slices. Each slice should be usable and buildable before moving on.

## Phase 1 - Domain Store Plumbing

Goal:

Make the in-memory DB usable from interactive UI flows.

Tasks:

- Add `DomainDataContext`
- Provide it near the app root
- Export `useDomainData`
- Update read selectors, where needed, to run after `version` changes
- Keep existing helper exports from `console.ts` working for now

Suggested files:

```text
monorepo/apps/ui/src/context/DomainDataContext.tsx
monorepo/apps/ui/src/App.tsx
monorepo/apps/ui/src/data/console.ts
```

Acceptance:

- App still loads
- Login screen unchanged
- Existing pages still show seeded data
- `npm run type-check` passes
- `npm run build` passes

---

## Phase 2 - Authority Setup CRUD

Goal:

Implement the Authority user stories that create tenant data and memberships.

Stories covered:

- Authority User Story 1 - Create a Participant
- Authority User Story 2 - Create Participant User
- Authority User Story 3 - Create a Stakeholder
- Authority User Story 4 - Create Stakeholder User
- Authority User Story 5 - Grant Stakeholder Access

Recommended UI:

- Participants page: `Create Participant` button opens modal/form
- Participant detail page: add `Users` area/table and `Create User`
- Stakeholders page: real list/detail page instead of generic placeholder
- Stakeholder detail page: tabs for `Overview`, `Users`, `Participant Access`
- Stakeholder detail page: grant access by selecting participants in the same authority

Suggested new pages/components:

```text
src/pages/StakeholderPages.tsx
src/components/EntityFormDialog.tsx
src/components/UserFormDialog.tsx
```

Keep forms small and direct.

### Create Participant

UI fields:

- Type: `ORGANISATION` or `PERSON`
- Display name
- Status: default `ACTIVE`

Command:

```ts
db.createParticipant({
  authorityId: user.authorityId,
  participantType,
  displayName,
  status: "ACTIVE",
});
```

Acceptance:

- Authority admin can create participant
- Participant appears in Participants table
- Participant belongs to current authority
- Participant is not visible to other authorities

### Create Participant User

UI fields:

- Display name
- Email
- Role: `ADMIN` or `MEMBER`

Command:

```ts
db.createParticipantUser(participantId, {
  displayName,
  email,
  role,
});
```

Acceptance:

- UserAccount is created
- ParticipantUser membership is created
- User kind is `PARTICIPANT`
- New user appears in sign-in user list for that participant
- Same email cannot be reused

### Create Stakeholder

UI fields:

- Type: `ORGANISATION` or `PERSON`
- Display name
- Status: default `ACTIVE`

Command:

```ts
db.createStakeholder({
  authorityId: user.authorityId,
  stakeholderType,
  displayName,
  status: "ACTIVE",
});
```

Acceptance:

- Stakeholder appears in Stakeholders table
- Stakeholder belongs to current authority
- Stakeholder is not visible to other authorities

### Create Stakeholder User

Command:

```ts
db.createStakeholderUser(stakeholderId, {
  displayName,
  email,
  role,
});
```

Acceptance:

- UserAccount is created
- StakeholderUser membership is created
- User kind is `STAKEHOLDER`
- New user appears in sign-in user list for that stakeholder

### Grant Stakeholder Access

UI fields:

- Participant select list, scoped to same authority

Command:

```ts
db.grantStakeholderAccess({
  stakeholderId,
  participantId,
  approvedByUserId: user.authenticatableUserId,
});
```

Acceptance:

- Access record is created
- Stakeholder can see the participant after sign-in
- Duplicate access is blocked
- Cross-authority access is blocked

---

## Phase 3 - Case Template Workflow

Goal:

Implement template creation, task configuration, participant assignment and publishing.

Stories covered:

- Authority User Story 6 - Create a Case Template
- Authority User Story 7 - Add Tasks to a Case Template
- Authority User Story 8 - Assign Participants to a Template
- Authority User Story 9 - Publish a Template

Recommended UI:

- Replace `Case templates` placeholder with list page
- Add case template detail page
- Use tabs:
  - Overview
  - Tasks
  - Participants
  - Generated Cases
  - Activity

Suggested routes:

```text
/admin/case-templates
/admin/case-templates/:templateId
```

### Create Case Template

UI fields:

- Name
- Description

Command:

```ts
db.createCaseTemplate({
  authorityId: user.authorityId,
  name,
  description,
});
```

Acceptance:

- Template appears as `DRAFT`
- Template belongs to current authority
- No cases are created yet

### Add Tasks to Case Template

UI fields:

- Task type select
- Title
- Description
- Parameters JSON or simple parameter fields

Initial simple parameters:

- Due date text

Command:

```ts
db.addTaskToTemplate({
  caseTemplateId,
  taskTypeId,
  title,
  description,
  parametersJson: { due },
});
```

Acceptance:

- Template task appears in task list
- Sort order increments
- If template is already published, corresponding CaseTask is created for every existing Case

### Assign Participants

UI fields:

- Participant select
- Status: `REQUIRED` or `EXEMPT`
- Optional exemption reason

Command:

```ts
db.assignParticipantToTemplate({
  caseTemplateId,
  participantId,
  status,
  exemptionReason,
  decidedByUserId: user.authenticatableUserId,
});
```

Acceptance:

- Required participant appears in template participants list
- Exempt participant appears with reason
- Participant must belong to same authority
- If template is already published and status is `REQUIRED`, a Case and CaseTasks are created immediately

### Publish Template

Command:

```ts
db.publishTemplate(caseTemplateId, user.authenticatableUserId);
```

Validation:

- Template must be `DRAFT`
- Template must have at least one active task
- Template must have at least one required participant

Acceptance:

- Template status becomes `PUBLISHED`
- `publishedAt` is set
- `publishedByUserId` is set
- Case is created for each required participant
- CaseTask is created for every active template task in each Case
- CaseTemplateParticipant is linked to generated Case
- Generated cases appear in Case Management

---

## Phase 4 - Participant Case Workflow

Goal:

Let participant users perform and submit work.

Stories covered:

- Participant User Story 1 - View Assigned Cases
- Participant User Story 2 - Open a Case
- Participant User Story 3 - Complete a Task
- Participant User Story 4 - Upload Evidence
- Participant User Story 5 - Submit a Task
- Participant User Story 6 - Submit a Case
- Participant User Story 7 - View Review Outcomes

Existing pages:

```text
/cases
/cases/:caseId
/cases/:caseId/tasks/:taskId
```

### View Assigned Cases

Current behaviour mostly exists.

Acceptance:

- Participant user sees only their participant's cases
- Authority user sees cases for participants in their authority
- Stakeholder user is redirected to stakeholder portal

### Open Case

Current behaviour mostly exists.

Acceptance:

- Case detail loads tasks
- Case cannot be opened by users outside scope
- Withdrawn tasks are shown as withdrawn or hidden with clear status

### Complete Task

UI:

- Simple response form in task detail page
- For now, a textarea or small structured fields are acceptable

Command:

```ts
db.completeTask({
  caseTaskId,
  responseJson,
});
```

Acceptance:

- Response JSON updates
- Task status becomes `IN_PROGRESS`
- UI shows unsaved/saved state clearly

### Upload Evidence

Prototype UI:

- Use a fake upload control
- Store file metadata only

Command:

```ts
db.uploadEvidence({
  caseTaskId,
  evidenceJson: {
    files: [{ name, size, uploadedAt }],
  },
});
```

Acceptance:

- Evidence metadata is stored on CaseTask
- Task moves from `NOT_STARTED` to `IN_PROGRESS` if needed
- Evidence appears on task detail

### Submit Task

Command:

```ts
db.submitTask(caseTaskId);
```

Acceptance:

- Task status becomes `SUBMITTED`
- Withdrawn tasks cannot be submitted
- Case status recalculates

### Submit Case

Command:

```ts
db.submitCase(caseId);
```

Validation:

- All active tasks must be submitted or passed
- Withdrawn tasks do not block submission

Acceptance:

- Case status becomes `SUBMITTED`
- Case submitted timestamp is set
- Submit button is disabled until all active tasks are ready

### View Review Outcomes

Acceptance:

- Participant can see task statuses `PASSED` and `FAILED`
- Failed task surfaces rejection status clearly
- Case status reflects aggregate review result

---

## Phase 5 - Authority Review Workflow

Goal:

Let authority users approve or reject participant submissions.

Stories covered:

- Authority User Story 10 - Review Participant Submissions

Recommended UI:

- Authority users see review actions on submitted tasks
- Participant users do not see approve/reject controls
- Case detail page has a Review tab or review actions near submitted tasks

Command:

```ts
db.reviewTask(caseTaskId, "PASSED");
db.reviewTask(caseTaskId, "FAILED");
```

Acceptance:

- Authority user can approve submitted task
- Authority user can reject submitted task
- Case status recalculates:
  - Any failed active task means `REJECTED`
  - All active tasks passed means `APPROVED`
  - Otherwise remains `SUBMITTED` or `IN_PROGRESS`
- Participant can see the outcome
- Stakeholder can see task-level outcomes only if access allows

---

## Phase 6 - Stakeholder Read-Only Portal

Goal:

Polish stakeholder visibility according to access records.

Stories covered:

- Stakeholder User Story 1 - View Accessible Participants
- Stakeholder User Story 2 - View Participant Status
- Stakeholder User Story 3 - View Case Details
- Stakeholder User Story 4 - View Task Outcomes
- Stakeholder User Story 5 - View Evidence

Existing routes:

```text
/stakeholder
/stakeholder/:caseId
```

Recommended route additions:

```text
/stakeholder/participants/:participantId
/stakeholder/:caseId/tasks/:taskId
```

### Accessible Participants

Query:

```ts
db.getAccessibleParticipantsForStakeholder(stakeholderId);
```

Acceptance:

- Stakeholder sees only participants with `APPROVED` access
- Suspended/revoked access should not show participant
- Stakeholder cannot open cases for inaccessible participants

### Participant Status

Acceptance:

- Summary is calculated from participant cases
- Shows case counts, completed tasks and current outcome
- No edit controls

### Case Details

Acceptance:

- Stakeholder can open visible participant case
- Stakeholder cannot mutate case or task data
- Case detail uses read-only layout

### Task Outcomes

Acceptance:

- Stakeholder can see task title, status and pass/fail outcome
- Stakeholder cannot submit or review tasks

### Evidence

Important decision needed:

Define evidence visibility before implementation.

Options:

- Stakeholder sees evidence metadata only
- Stakeholder sees evidence only for passed tasks
- Stakeholder sees all submitted evidence

Recommended first-release rule:

```text
Stakeholders see evidence metadata for submitted, passed or failed tasks on participants they are approved to monitor.
```

Acceptance:

- Evidence metadata is visible for accessible participant tasks
- Evidence is not visible cross-authority
- Evidence is read-only

---

## Phase 7 - Published Template Changes

Goal:

Support live template amendment stories.

Stories covered:

- Authority User Story 11 - Withdraw a Task After Publication
- Authority User Story 12 - Add a New Task After Publication

These should be implemented after the normal template and case workflows are stable.

### Withdraw Task After Publication

Command:

```ts
db.withdrawTemplateTask(caseTemplateTaskId, user.authenticatableUserId, reason);
```

Rules:

- Mark CaseTemplateTask as `WITHDRAWN`
- Mark incomplete CaseTasks as `WITHDRAWN`
- Do not overwrite already passed/failed CaseTasks
- Recalculate affected Case statuses

Acceptance:

- Withdrawn template task no longer blocks case submission
- Withdrawn case tasks show withdrawn status
- Passed/failed tasks remain historically visible
- Reason and withdrawn metadata are recorded

### Add New Task After Publication

Command:

```ts
db.addTaskToTemplate({
  caseTemplateId,
  taskTypeId,
  title,
  description,
  parametersJson,
});
```

Rules:

- If template is `PUBLISHED`, set `createdAfterPublish` to true
- Create a new CaseTask for every existing Case under that template
- New CaseTasks start as `NOT_STARTED`

Acceptance:

- New task appears in template
- New task appears in every generated case
- Affected cases recalculate status

---

# Suggested Testing Strategy

There is currently no test runner configured in this app.

Recommended next step:

- Add Vitest for domain command tests
- Test `InMemoryAllChecksOutDatabase` directly

Suggested test file:

```text
monorepo/apps/ui/src/data/console.test.ts
```

High-value tests:

- User cannot belong to multiple user kinds
- Create participant scopes to authority
- Create participant user creates UserAccount and ParticipantUser
- Grant stakeholder access blocks cross-authority access
- Publish template creates cases and case tasks
- Publish template fails without tasks
- Publish template fails without required participants
- Submit case fails while active tasks are incomplete
- Review task recalculates case status
- Withdraw template task withdraws incomplete case tasks
- Add task after publication creates case tasks for existing cases

Run checks after each phase:

```text
npm run type-check
npm run build
```

If Vitest is added:

```text
npm run test
```

---

# Implementation Guardrails

## Do Not Mutate Arrays From UI

Bad:

```ts
db.participants.push(...)
```

Good:

```ts
db.createParticipant(...)
```

## Keep Commands Responsible For Rules

Validation belongs in the database/service layer, not only in buttons.

The UI may disable invalid actions, but the command method must still reject invalid calls.

## Keep Query Scope Explicit

Authority data must always be filtered by authority.

Participant users must only see their participant.

Stakeholder users must only see participants granted through `StakeholderParticipantAccess`.

## Keep First Release Permissions Simple

Only use:

```text
ADMIN
MEMBER
```

Do not introduce Reviewer, Auditor, Approver or Read Only yet.

## Keep Evidence Prototype Lightweight

Do not implement real file storage yet.

Use metadata in `evidenceJson`.

Example:

```json
{
  "files": [
    {
      "name": "policy.pdf",
      "size": 245000,
      "uploadedAt": "2026-06-15T10:00:00.000Z"
    }
  ]
}
```

---

# Story Coverage Checklist

## Authority

- [ ] Create Participant
- [ ] Create Participant User
- [ ] Create Stakeholder
- [ ] Create Stakeholder User
- [ ] Grant Stakeholder Access
- [ ] Create Case Template
- [ ] Add Tasks to Case Template
- [ ] Assign Participants to Template
- [ ] Publish Template
- [ ] Review Participant Submissions
- [ ] Withdraw Task After Publication
- [ ] Add New Task After Publication

## Participant

- [ ] View Assigned Cases
- [ ] Open a Case
- [ ] Complete a Task
- [ ] Upload Evidence
- [ ] Submit a Task
- [ ] Submit a Case
- [ ] View Review Outcomes

## Stakeholder

- [ ] View Accessible Participants
- [ ] View Participant Status
- [ ] View Case Details
- [ ] View Task Outcomes
- [ ] View Evidence

---

# Recommended Agent Work Packages

If multiple agents are used, split the work like this.

## Agent 1 - Domain Store and Tests

Scope:

- Add `DomainDataContext`
- Add Vitest
- Add domain tests
- Keep UI unchanged except provider wiring

Deliverables:

- Store provider
- Tests for domain commands
- Passing type-check/build/test

## Agent 2 - Authority Setup UI

Scope:

- Participants create flow
- Participant users flow
- Stakeholders list/detail
- Stakeholder users flow
- Grant stakeholder access flow

Depends on:

- Agent 1 store/provider

## Agent 3 - Template UI

Scope:

- Case templates list/detail
- Add template tasks
- Assign participants
- Publish template
- Generated cases visibility

Depends on:

- Agent 1 store/provider

## Agent 4 - Participant and Review Workflow

Scope:

- Complete task
- Upload evidence metadata
- Submit task
- Submit case
- Authority approve/reject
- Review outcomes

Depends on:

- Agent 1 store/provider
- Existing case/task pages

## Agent 5 - Stakeholder Portal

Scope:

- Accessible participant list/detail
- Case detail hardening
- Task outcome detail
- Evidence read-only view
- Scope/permission hardening

Depends on:

- Agent 2 stakeholder access
- Agent 4 task/evidence workflow

---

# Final Definition of Done

The full user story set is implemented when:

- Every checklist item above is complete
- Login screen remains visually intact
- No System Owner login exists
- All mutations use domain commands
- Authority tenant scoping is enforced
- Participant scoping is enforced
- Stakeholder access scoping is enforced
- TypeScript passes
- Production build passes
- Domain command tests pass
- Manual browser walkthrough works for:
  - Authority creates setup data
  - Authority publishes a template
  - Participant completes and submits work
  - Authority reviews work
  - Stakeholder views approved outcomes

