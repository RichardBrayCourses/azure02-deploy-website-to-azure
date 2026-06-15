# All Checks Out - Functional Specification

## Product Summary

- Product name:
  - All Checks Out
- Current UI name:
  - CaseFlow Console
- Product type:
  - Configurable case, compliance, and service management platform
- Core concept:
  - A case is a structured business process.
  - A case contains tasks, evidence, workflow status, review outcomes, and visibility rules.
- Current concrete scenario:
  - An IT platform association verifies member platform companies each year.
  - Platform companies complete verification tasks.
  - Approved stakeholders can view participant status and outcomes.
- Broader reusable scenarios:
  - Trade association compliance checks
  - Plumbing or electrical service visits
  - Healthcare or nurse home visits
  - Council permit renewals
  - Property inspections
  - Insurance assessments
  - Membership onboarding
  - Contractor approvals

## User Types

- System Owner
  - Exists in the domain model.
  - Operates the SaaS platform.
  - Not exposed in the current UI.
- Authority
  - Tenant owner.
  - Configures participants, stakeholders, templates, users, and review workflow.
  - Current UI sign-in option.
- Participant
  - Completes cases and tasks.
  - Uploads evidence metadata.
  - Submits tasks and cases.
  - Current UI sign-in option.
- Stakeholder
  - Views approved participant status.
  - Reads visible cases, task outcomes, and evidence metadata.
  - Cannot mutate data.
  - Current UI sign-in option.

## Core Business Objects

- Authority
  - Owns tenant data.
  - Owns participants.
  - Owns stakeholders.
  - Owns case templates.
  - Owns generated cases.
- Participant
  - Organisation or person.
  - Completes case work.
  - Has zero or more users.
  - Belongs to one authority.
- Stakeholder
  - Organisation or person.
  - Observes approved participants.
  - Has zero or more users.
  - Belongs to one authority.
- Stakeholder participant access
  - Grants a stakeholder visibility of a participant.
  - Supports approved, suspended, and revoked states in the model.
- User account
  - Represents an authenticatable identity.
  - Has one user kind only.
- Task type
  - Global reusable capability.
  - Examples include document upload, driving licence upload, questionnaire, video attestation, GPS evidence, digital signature, payment confirmation, address proof, and vehicle document.
- Case template
  - Authority-owned reusable case definition.
  - Contains configured template tasks.
  - Contains participant assignments.
  - Can be draft, published, or archived.
- Case template task
  - Configured use of a task type.
  - Has title, description, due metadata, sort order, and status.
  - Can be withdrawn after publication.
- Case template participant
  - Participant assignment to a template.
  - Can be required or exempt.
  - Links to generated case after publication.
- Case
  - Participant-specific instance of a case template.
  - Generated when a template is published.
  - Tracks overall status.
- Case task
  - Participant-specific instance of a template task.
  - Tracks response, evidence metadata, and review status.

## Global Navigation

- Signed-out user:
  - Sees demo sign-in flow.
- Signed-in user:
  - Sees console header.
  - Can open app launcher.
  - Can search accessible apps, cases, participants, and tasks.
  - Can view account context.
  - Can toggle dark mode.
  - Can sign out.
- App launcher:
  - Shows top-level apps only.
  - Does not show direct CRUD actions.
- Available apps:
  - Administration
  - Case Management
  - Stakeholder Portal

## Sign-In Flow

- User selects authority.
- User selects role:
  - Authority
  - Participant
  - Stakeholder
- Participant and stakeholder roles require participant context selection.
- User selects one authenticatable user for the selected entity.
- Login context is stored locally.
- User is routed to default workspace:
  - Authority: `/admin`
  - Participant: `/cases`
  - Stakeholder: `/stakeholder`

## Administration Functions

- Administration home
  - Shows resource navigation.
  - Links to participants.
  - Links to stakeholders.
  - Links to case templates.
  - Links to task types placeholder.
  - Links to users placeholder.
- Administration resource navigation
  - Present on administration pages.
  - Provides consistent movement between admin resources.

## Participant Administration

- List participants
  - Shows participants scoped to current authority.
  - Shows participant type.
  - Shows status.
  - Shows open case count.
  - Shows task progress.
  - Shows last activity.
- Create participant
  - Select type:
    - Organisation
    - Person
  - Enter display name.
  - Save participant to current authority.
  - New participant status defaults to active.
- View participant detail
  - Shows status metrics.
  - Shows stakeholder relationship where available.
  - Shows users.
  - Shows cases.
- Create participant user
  - Enter display name.
  - Enter email.
  - Select role:
    - Admin
    - Member
  - Creates user account.
  - Creates participant membership.
  - Blocks duplicate email addresses.
  - Preserves user-kind exclusivity.

## Stakeholder Administration

- List stakeholders
  - Shows stakeholders scoped to current authority.
  - Shows stakeholder type.
  - Shows status.
  - Shows participant access count.
- Create stakeholder
  - Select type:
    - Organisation
    - Person
  - Enter display name.
  - Save stakeholder to current authority.
  - New stakeholder status defaults to active.
- View stakeholder detail
  - Shows status metrics.
  - Shows stakeholder users.
  - Shows approved participant access.
- Create stakeholder user
  - Enter display name.
  - Enter email.
  - Select role:
    - Admin
    - Member
  - Creates user account.
  - Creates stakeholder membership.
  - Blocks duplicate email addresses.
  - Preserves user-kind exclusivity.
- Grant participant access
  - Select participant from same authority.
  - Save approved access.
  - Blocks duplicate stakeholder-participant access.
  - Blocks cross-authority access.

## Case Template Administration

- List case templates
  - Shows templates scoped to current authority.
  - Shows status.
  - Shows active task count.
  - Shows participant assignment count.
  - Shows published state.
- Create case template
  - Enter name.
  - Enter description.
  - Save draft template to current authority.
- View case template detail
  - Shows template metrics.
  - Shows tasks.
  - Shows participant assignments.
  - Shows generated cases.
  - Shows publish action for draft templates.
- Add task to template
  - Select task type.
  - Enter title.
  - Enter due text.
  - Enter description.
  - Save configured template task.
  - Automatically assigns sort order.
  - If template is already published:
    - Marks task as added after publish.
    - Creates generated case tasks for existing cases.
    - Recalculates affected case status.
- Assign participant to template
  - Select participant.
  - Select status:
    - Required
    - Exempt
  - Enter exemption reason when exempt.
  - Blocks duplicate assignment.
  - Blocks cross-authority assignment.
  - If template is already published and participant is required:
    - Creates generated case immediately.
- Publish template
  - Requires at least one active task.
  - Requires at least one required participant.
  - Updates template status to published.
  - Records published timestamp and user.
  - Creates one case per required participant.
  - Creates one case task per active template task.
  - Links template participant rows to generated cases.
- Withdraw published task
  - Available for published templates.
  - Requires withdrawal reason.
  - Marks template task as withdrawn.
  - Records withdrawal timestamp, reason, and user.
  - Withdraws incomplete generated case tasks.
  - Preserves passed and failed generated case tasks.
  - Recalculates affected case status.

## Case Management Functions

- Case list
  - Authority users see authority-scoped cases.
  - Participant users see participant-scoped cases.
  - Stakeholders are redirected to stakeholder portal.
  - Shows case title.
  - Shows participant for authority users.
  - Shows case type.
  - Shows status.
  - Shows task progress.
  - Shows risk.
  - Shows last activity.
- Case detail for authority
  - Shows case summary metrics.
  - Shows task review table.
  - Shows task status.
  - Shows participant response.
  - Shows evidence metadata.
  - Allows review only for submitted tasks.
  - Pass action marks task as passed.
  - Fail action marks task as failed.
  - Case status recalculates after review.
- Case detail for participant
  - Shows case summary metrics.
  - Shows task cards.
  - Shows task due text.
  - Shows task status.
  - Shows pass/fail outcomes.
  - Links to task workbench.
  - Allows case submission only when all active tasks are submitted, passed, or withdrawn.
- Case submission
  - Blocks submission while active tasks are not started or in progress.
  - Sets case to submitted.
  - Records submitted timestamp.

## Participant Task Functions

- Open task
  - Participant only.
  - Authority users are redirected to case summary.
  - Stakeholder users are redirected to stakeholder portal.
- Save response
  - Enter response text.
  - Save response JSON summary.
  - Sets task to in progress.
  - Blocks withdrawn tasks.
- Upload evidence
  - Select local files.
  - Stores metadata only:
    - name
    - size
    - uploaded timestamp
  - Does not upload binary file content in this phase.
  - Sets not-started task to in progress.
  - Blocks withdrawn tasks.
- Submit task
  - Requires response text or evidence metadata.
  - Saves pending response first when needed.
  - Sets task to submitted.
  - Recalculates case status.
  - Blocks withdrawn tasks.
- View review outcomes
  - Passed tasks show passed outcome.
  - Failed tasks show more-evidence-requested outcome.
  - Submitted tasks remain waiting for review.

## Stakeholder Portal Functions

- Stakeholder home
  - Shows only approved participant access.
  - Shows watched case count.
  - Shows approved outcome count.
  - Shows in-progress count.
  - Shows attention count.
  - Lists visible participant case status.
- Stakeholder participant detail
  - Read-only.
  - Shows visible case counts.
  - Shows open case count.
  - Shows task progress.
  - Shows attention count.
  - Lists visible cases.
  - Lists task outcomes and evidence metadata.
- Stakeholder case detail
  - Read-only.
  - Requires case to belong to an approved participant.
  - Shows visible outcome.
  - Shows participant performance.
  - Shows task outcomes.
  - Shows evidence metadata for visible submitted, passed, or failed tasks.
- Stakeholder restrictions
  - Cannot mutate participant data.
  - Cannot mutate stakeholder data.
  - Cannot mutate template data.
  - Cannot complete tasks.
  - Cannot review tasks.
  - Cannot access unapproved participants.
  - Cannot access cross-authority data.

## Status Behaviour

- Case task statuses:
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `SUBMITTED`
  - `PASSED`
  - `FAILED`
  - `WITHDRAWN`
- Case statuses:
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `SUBMITTED`
  - `APPROVED`
  - `REJECTED`
  - `CLOSED`
- Case recalculation:
  - Any failed task makes the case rejected.
  - All passed tasks make the case approved.
  - All tasks submitted or passed make the case submitted.
  - Any active progress makes the case in progress.
  - No active progress keeps the case not started.
  - Withdrawn tasks do not block submission.

## Current Placeholders

- Task type administration page
- User administration page
- Case tasks aggregate page
- Evidence aggregate page
- Stakeholder preview aggregate page
- Real audit/activity history
- Real authentication
- Real file storage
- Backend persistence

## Non-Functional Requirements

- UI should remain console-like and operational.
- UI should prefer tables, compact forms, tabs, status badges, and resource action panels.
- App launcher should stay focused on top-level apps.
- CRUD actions should stay on resource pages and detail pages.
- Login screen should remain role-scoped and simple.
- Tenant scoping must be preserved.
- User-kind exclusivity must be preserved.
- Source-of-truth domain commands should be used for mutations.
- UI refresh must happen after successful mutations.
