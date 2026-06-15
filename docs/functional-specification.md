# All Checks Out - Functional Specification

## Product Summary

- Product name:
  - All Checks Out
- Current UI name:
  - CaseFlow Console
- Product type:
  - Authority-partitioned due diligence and case management platform
- Core concept:
  - An authority defines a due diligence scheme.
  - The authority creates reusable case templates made from task types.
  - Participants receive or create case instances from those templates.
  - Participants complete and control their own due diligence case data.
  - Stakeholders review participant data only when access has been granted.
  - Third-party helpers can assist participants only when delegated access has been granted.
- Primary scenario:
  - A trade association represents IT platform vendors.
  - The association defines due diligence expectations for its member vendors.
  - Vendors complete due diligence packs and make them available to subscribers.
  - Subscribers are companies that buy, use, or are considering buying the vendors' platforms.
  - Subscribers can request additional information.
  - External helpers such as lawyers or compliance firms can be invited to help vendors manage due diligence.

## Business Model

- Authority:
  - The umbrella organisation, scheme owner, tenant partition, and commercial customer.
  - For the primary scenario, the authority is an association.
  - The authority defines terminology, participant membership, DDQ templates, required tasks, workflows, roles, and high-level scheme rules.
  - The authority does not automatically have unrestricted access to every participant's private due diligence submissions.
- Participant:
  - A member organisation inside an authority.
  - For the primary scenario, a participant is a vendor or IT platform supplier.
  - The participant is the operational owner of its own due diligence case data.
  - The participant completes DDQs, uploads evidence, grants stakeholder access, grants helper access, and responds to information requests.
- Stakeholder:
  - An organisation that needs assurance about one or more participants.
  - For the primary scenario, a stakeholder is a subscriber or customer of a vendor.
  - The stakeholder reviews due diligence data that participants have granted it access to.
  - The stakeholder can request additional information.
- Third-party helper:
  - An organisation or user invited to help a participant.
  - Examples include lawyers, compliance consultants, outsourced compliance firms, and security advisers.
  - Helpers may review, create, or modify participant data only when granted permission.
- Platform operator:
  - Operates the SaaS platform above individual authorities.
  - Can manage authorities and platform configuration.
  - Does not become a default viewer of private participant due diligence data.

## Configurable Terminology

- The product should use generic internal concepts.
- Each authority should be able to configure the labels shown in the UI.
- The primary scenario should display:

| Internal concept | Display label |
| --- | --- |
| Authority | Association |
| Participant | Vendor |
| Stakeholder | Subscriber |
| Third-party helper | Service provider |
| Case template | DDQ template |
| Case | Due diligence pack |
| Case task | Due diligence item |
| Evidence | Evidence |
| Access grant | Access grant |
| Information request | Request for information |

- UI labels should be read from the active authority where practical.
- Business rules should use the generic concepts.
- The current frontend-only phase can store terminology in the in-memory authority dataset.

## User And Account Model

- A user account represents one login identity.
- A user can belong to multiple authorities.
- Within an authority, a user can belong to multiple account contexts.
- A user can hold different roles in different contexts.
- A user is not limited to one permanent user kind.
- The active authority and active account context determine permissions.

### Account Context Types

- Authority context:
  - User acts for the authority.
  - Can configure scheme-level settings and templates.
- Participant context:
  - User acts for a participant/vendor.
  - Can manage that participant's due diligence according to membership role.
- Stakeholder context:
  - User acts for a stakeholder/subscriber.
  - Can review granted participant data and request more information.
- Helper context:
  - User acts for a third-party helper/service provider.
  - Can access participant workspaces where helper access has been granted.
- Platform operator context:
  - User acts for the SaaS operator.
  - Future scope; not required in the current UI.

### Membership Roles

- Owner:
  - Full control for an account context.
- Admin:
  - Manage users, settings, grants, and data within the context.
- Member:
  - Complete assigned work and view relevant data.
- Reviewer:
  - Review and comment on data where granted.
- Contributor:
  - Create or update assigned data where granted.
- Read only:
  - View data where granted.

## Core Business Objects

- Authority:
  - Tenant partition and scheme owner.
  - Owns terminology, templates, participant membership, stakeholder records, helper records, and authority-scoped configuration.
- Authority terminology:
  - Stores authority-specific display labels for generic concepts.
- Party account:
  - Organisation or person inside an authority.
  - Can represent participant, stakeholder, helper, or authority-owned account.
- User account:
  - Authenticatable identity.
  - Can have many memberships.
- Account membership:
  - Connects a user account to an authority or party account.
  - Defines role and status.
- Task type:
  - Reusable task capability with its own screen and completion behaviour.
  - Examples include document upload, questionnaire, evidence register, attestation, signature, policy statement, supplier list, and risk confirmation.
- Case template:
  - Authority-owned reusable definition of a due diligence process.
  - Built from configured template tasks.
  - Displayed as DDQ template for the primary scenario.
  - Can be draft, published, or archived.
- Case template task:
  - Configured use of a task type inside a case template.
  - Has title, description, due metadata, sort order, parameters, and status.
  - Can be withdrawn after publication.
- Case template participant:
  - Participant assignment to a published or draft template.
  - Can be required or exempt.
  - Links to generated case instances where applicable.
- Case:
  - Participant-specific instance of a case template.
  - Displayed as due diligence pack for the primary scenario.
  - Owned operationally by the participant.
  - Authority-scoped but not automatically visible to every authority user.
- Case task:
  - Participant-specific instance of a template task.
  - Displayed as due diligence item for the primary scenario.
  - Tracks response, evidence metadata, completion status, and submission status.
- Access grant:
  - Participant-controlled permission granting another party or user access to participant due diligence data.
- Information request:
  - Request from a stakeholder or reviewer for additional information.
  - Can be answered by the participant or an authorised helper.
- Vendor relationship:
  - Participant-owned relationship to one of its own suppliers/vendors.
  - Supports vendor-of-vendor due diligence.
- Evidence metadata:
  - Metadata for uploaded evidence in the current phase.
  - Does not include binary file storage until later phases.

## Task Type Library

- The system should continue to use a finite list of reusable task types.
- Each task type should have a purpose-built screen for completing that type of work.
- Templates are built by combining task types with scenario-specific titles, descriptions, due dates, and parameters.

### Initial IT Vendor Due Diligence Task Types

- Policy document upload:
  - Used for information security policy, incident response plan, business continuity plan, or similar controlled documents.
- Certification evidence upload:
  - Used for ISO 27001, SOC 2, Cyber Essentials, or equivalent assurance evidence.
- Questionnaire:
  - Used for structured answers about security, data protection, operations, and governance.
- Control attestation:
  - Used when a senior user must confirm a control exists and is operating.
- Supplier register:
  - Used to list subprocessors, hosting providers, monitoring tools, support tools, and other critical suppliers.
- Vendor-of-vendor assessment:
  - Used to collect due diligence information about a participant's own vendors.
- Risk and remediation register:
  - Used to record known issues, mitigation dates, and owner.
- Evidence metadata upload:
  - Used to record uploaded file name, size, date, and document type in the frontend-only phase.
- Digital signature:
  - Used for final senior officer attestation.
- Payment confirmation:
  - Optional task type for scheme fees where required.

### Example DDQ Template Tasks

- Company profile and platform summary.
- Information security policy.
- ISO 27001 or SOC 2 evidence.
- Penetration test summary.
- Vulnerability management process.
- Access control and MFA attestation.
- Data protection registration.
- GDPR data processing agreement.
- Subprocessor register.
- Hosting and data residency statement.
- Backup and restore evidence.
- Business continuity and disaster recovery plan.
- Incident response plan.
- Cyber insurance evidence.
- Secure development lifecycle questionnaire.
- AI usage and customer-data disclosure.
- Financial standing confirmation.
- Critical supplier register.
- Vendor-of-vendor DDQ.
- Senior officer attestation and signature.

## Global Navigation

- Signed-out user:
  - Sees demo sign-in flow.
- Signed-in user:
  - Sees console header.
  - Can view active authority and account context.
  - Can switch account context where multiple memberships or grants exist.
  - Can open app launcher.
  - Can search accessible apps, participants, stakeholders, helpers, cases, tasks, grants, and requests.
  - Can toggle dark mode.
  - Can sign out.
- App launcher:
  - Shows top-level apps only.
  - Does not show direct CRUD actions.
  - Adapts to active account context.

### Available Apps By Context

- Authority context:
  - Scheme Administration.
  - Participants.
  - Stakeholders.
  - Helpers.
  - DDQ Templates.
  - Users.
- Participant context:
  - Vendor Workspace.
  - Due Diligence Packs.
  - Access Grants.
  - Requests.
  - Vendors of Vendors.
- Stakeholder context:
  - Subscriber Portal.
  - Vendors.
  - Reviews.
  - Requests.
- Helper context:
  - Client Workspaces.
  - Assigned Due Diligence Packs.
  - Requests.

## Sign-In Flow

- User selects or enters demo user identity.
- System shows authority/account contexts available to that user.
- User selects:
  - Authority.
  - Account context.
  - Role, if the user has multiple roles in the same context.
- Login context is stored locally for the current frontend-only phase.
- User is routed to default workspace for the active context:
  - Authority: scheme administration.
  - Participant/vendor: due diligence packs.
  - Stakeholder/subscriber: subscriber portal.
  - Helper/service provider: client workspaces.
- User can switch context without signing out.

## Authority Administration Functions

- Authority home:
  - Shows scheme overview.
  - Shows terminology configuration summary.
  - Shows participant count.
  - Shows stakeholder count.
  - Shows helper count.
  - Shows DDQ template count.
  - Shows aggregate due diligence progress where permitted.
- Manage terminology:
  - Configure display labels for internal concepts.
  - Labels are applied throughout the UI where practical.
- Manage participants:
  - Create participant/vendor records.
  - Set participant status.
  - Manage participant membership in the authority.
  - View high-level status and aggregate progress.
  - Does not automatically expose private evidence or answers unless permission allows.
- Manage stakeholders:
  - Create stakeholder/subscriber records.
  - Manage stakeholder users.
  - View which participants have granted access where permitted.
- Manage helpers:
  - Create helper/service-provider records.
  - Manage helper users.
  - View helper relationships where permitted.
- Manage users:
  - Create or invite users.
  - Assign users to authority, participant, stakeholder, or helper contexts.
  - Allow one user to hold multiple memberships.

## DDQ Template Administration

- List case templates:
  - Displayed as DDQ templates for the primary scenario.
  - Shows status, active task count, assigned participant count, and publication state.
- Create template:
  - Enter name.
  - Enter description.
  - Save draft template to current authority.
- Add task to template:
  - Select task type from finite task library.
  - Enter display title.
  - Enter due text.
  - Enter description.
  - Configure task parameters where supported.
  - Automatically assign sort order.
- Assign participant to template:
  - Select participant/vendor.
  - Select required or exempt.
  - Enter exemption reason when exempt.
  - Blocks duplicate assignment.
  - Blocks cross-authority assignment.
- Publish template:
  - Requires at least one active task.
  - Requires at least one required participant.
  - Updates template status to published.
  - Records published timestamp and user.
  - Creates one participant-owned case instance per required participant.
  - Creates one case task per active template task.
  - Links assignment rows to generated cases.
- Add task after publication:
  - Marks task as added after publish.
  - Creates corresponding case tasks for existing active case instances.
  - Recalculates affected case status.
- Withdraw published task:
  - Requires withdrawal reason.
  - Marks template task as withdrawn.
  - Withdraws incomplete generated case tasks.
  - Preserves submitted, accepted, rejected, or completed task history.
  - Recalculates affected case status.

## Participant Vendor Workspace Functions

- Vendor workspace home:
  - Shows due diligence pack summary.
  - Shows open requests.
  - Shows subscriber access count.
  - Shows helper access count.
  - Shows vendor-of-vendor records.
- View due diligence packs:
  - Shows participant-owned cases.
  - Shows template name, status, task progress, request count, last activity, and visibility state.
- Open due diligence pack:
  - Shows task list.
  - Shows completion progress.
  - Shows evidence metadata.
  - Shows subscriber visibility.
  - Shows open requests linked to the pack.
- Complete due diligence item:
  - Opens the purpose-built screen for the task type.
  - Saves response data.
  - Saves evidence metadata.
  - Tracks task status.
- Submit due diligence pack:
  - Blocks submission while required active tasks are incomplete.
  - Records submitted timestamp.
  - Makes submitted content available to active grants according to scope.
- Manage participant users:
  - Add users to participant account.
  - Assign roles.
  - Allow users who already exist in other accounts to be added.
- Manage access grants:
  - Grant subscriber access.
  - Grant helper access.
  - Grant explicit authority-review access if required.
  - Set permission level, data scope, status, and expiry.
- Manage requests:
  - View open requests for information.
  - Assign request to participant user or helper where permitted.
  - Respond to request.
  - Mark request as answered.

## Access Grant Functions

- Grant target types:
  - Stakeholder/subscriber organisation.
  - Third-party helper/service-provider organisation.
  - Specific user where narrower access is needed.
  - Authority user only where explicit authority review is required.
- Permission levels:
  - Read only.
  - Request information.
  - Review and comment.
  - Create and edit.
  - Administer grants.
- Data scopes:
  - Entire participant workspace.
  - Specific due diligence pack.
  - Specific due diligence item.
  - Specific vendor-of-vendor record.
  - Evidence metadata only, where needed.
- Statuses:
  - Invited.
  - Active.
  - Suspended.
  - Revoked.
  - Expired.
- Rules:
  - Grants are scoped to one authority.
  - Grants are controlled by the participant unless delegated.
  - Suspended, revoked, or expired grants do not provide access.
  - Duplicate active grants for the same target and scope should be blocked or merged.
  - Grant changes should be auditable in later phases.

## Stakeholder Subscriber Portal Functions

- Subscriber home:
  - Shows vendors that have granted access.
  - Shows due diligence packs available for review.
  - Shows open requests created by the subscriber.
  - Shows review status across multiple vendors.
- Vendor detail:
  - Shows participant profile information made visible by grant.
  - Shows visible due diligence packs.
  - Shows submitted task outcomes and evidence metadata within granted scope.
  - Shows request history between the subscriber and vendor.
- Due diligence pack review:
  - Read-only by default.
  - Shows submitted answers and evidence metadata.
  - Shows visible vendor-of-vendor information where included in grant scope.
  - Allows subscriber review status and notes.
  - Allows request for information where permission allows.
- Request information:
  - Create request against participant, pack, task, evidence metadata, or vendor-of-vendor record.
  - Enter request text.
  - Submit request to participant.
  - Track status and response.
- Restrictions:
  - Cannot mutate participant due diligence data.
  - Cannot create or modify participant users.
  - Cannot manage participant grants.
  - Cannot access ungranted participant data.
  - Cannot access cross-authority data.

## Third-Party Helper Functions

- Helper home:
  - Shows participant workspaces where helper access is active.
  - Shows assigned due diligence packs.
  - Shows open requests where helper is allowed to assist.
- Client workspace:
  - Shows granted participant data.
  - Shows permission level and scope.
  - Allows read, review, create, or edit actions according to grant.
- Assist with due diligence:
  - Complete assigned due diligence items where permission allows.
  - Upload evidence metadata where permission allows.
  - Draft or update responses where permission allows.
  - Help respond to stakeholder requests where permission allows.
- Restrictions:
  - Cannot access participant data without active grant.
  - Cannot exceed granted permission level.
  - Cannot manage participant grants unless explicitly delegated.

## Information Request Functions

- Create request:
  - Stakeholder or authorised reviewer selects target.
  - Target may be participant, pack, item, evidence metadata, or vendor-of-vendor record.
  - User enters request text.
  - Request status starts as open.
- View request:
  - Participant sees requests against its data.
  - Stakeholder sees requests it created.
  - Helper sees requests only where grant permits.
- Respond to request:
  - Participant or authorised helper enters response.
  - May link response to updated task, new evidence metadata, or comment.
  - Request status moves to in progress or answered.
- Accept or close request:
  - Stakeholder can mark answer accepted where appropriate.
  - Participant may withdraw or close a request only according to configured rules.
- Statuses:
  - `OPEN`
  - `IN_PROGRESS`
  - `ANSWERED`
  - `ACCEPTED`
  - `WITHDRAWN`

## Vendor-Of-Vendor Functions

- Create vendor-of-vendor record:
  - Participant enters supplier/vendor name.
  - Participant enters relationship type and criticality.
  - Participant links record to relevant due diligence packs.
- Manage vendor-of-vendor DDQ:
  - Participant creates or receives due diligence pack for the child vendor record.
  - Participant completes tasks about that vendor relationship.
- Grant visibility:
  - Participant decides whether stakeholder access includes vendor-of-vendor information.
  - Grant scope controls what is visible.
- Review:
  - Stakeholder can review vendor-of-vendor information only where granted.
  - Stakeholder can request additional information where permitted.

## Case And Task Status Behaviour

- Case task statuses:
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `SUBMITTED`
  - `ACCEPTED`
  - `REJECTED`
  - `WITHDRAWN`
- Case statuses:
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `SUBMITTED`
  - `UNDER_REVIEW`
  - `ACCEPTED`
  - `REJECTED`
  - `CLOSED`
- Participant completion:
  - Required active tasks must be submitted or withdrawn before case submission.
  - Withdrawn tasks do not block submission.
  - Added-after-publication tasks may reopen or update participant progress according to template rules.
- Subscriber review:
  - Review status belongs to the reviewing stakeholder.
  - One stakeholder's review status does not automatically become another stakeholder's status.
  - A stakeholder can request more information instead of accepting a pack.
- Authority status:
  - Authority may see aggregate status where permitted.
  - Authority review is not automatic unless the scheme explicitly includes it.

## Current Phase Limitations

- Authentication is a demo selector, not Microsoft Entra External ID.
- Authorization is client-side route scoping, not server-enforced authorization.
- Data is in memory and resets on reload.
- Evidence upload stores metadata only, not binary files.
- Audit history is not yet persistent.
- Real invitations are not yet sent.
- Real file storage is not yet implemented.
- Backend persistence is not yet implemented.
- Platform operator screens are not required in this phase.

## Non-Functional Requirements

- UI should remain console-like and operational.
- UI should feel like the association/vendor/subscriber due diligence product first.
- Generic flexibility should exist in the structure, terminology, and data model rather than visible generic explanation.
- UI should prefer tables, compact forms, tabs, status badges, and resource action panels.
- App launcher should stay focused on top-level apps.
- CRUD actions should stay on resource pages and detail pages.
- Active authority and account context should always be visible.
- Tenant scoping by authority must be preserved.
- Participant data access must be grant-based.
- Users must be allowed to hold multiple memberships.
- Source-of-truth domain commands should be used for mutations.
- UI refresh must happen after successful mutations.
- Future backend phases must enforce all authority, account, and grant boundaries server-side.

