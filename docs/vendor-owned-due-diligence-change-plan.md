# All Checks Out - Authority-Partitioned Due Diligence Change Plan

## Purpose

This document updates the current All Checks Out functional direction so that it matches the intended trade association due diligence model more accurately.

The system should still be built as a configurable case management platform. However, for the first real business scenario, the product must behave exactly as the trade association and its member vendors need it to behave.

The core correction is:

> The authority remains the tenant, scheme owner, and commercial customer, but member vendors control their own due diligence data and decide which subscribers and third-party helpers can access it.

This gives the system a clean long-term structure:

- The dataset is partitioned by authority.
- Each authority can configure its own terminology, templates, roles, branding, and workflows.
- Inside an authority, participants manage their own due diligence cases.
- Stakeholders and third-party helpers only access participant data when they are explicitly invited or granted access.
- Platform operator users sit above authorities for system management, but do not become default viewers of private participant due diligence data.

## Business Model

### Authority

The authority is the umbrella organisation.

In this scenario, it is a trade association representing IT platform suppliers. The member suppliers pay to belong to the authority, and the authority lobbies or advocates on their behalf.

The authority owns the scheme and the tenant partition. It may define:

- The member onboarding process.
- Due diligence expectations.
- Case or DDQ templates made from a finite task library.
- Annual or periodic verification cycles.
- The terminology used in the UI.
- Which roles and permissions are available.
- Overall reporting needed to run the scheme.

The authority should not automatically have unrestricted access to private vendor due diligence submissions simply because it owns the scheme. Access to participant due diligence records should be governed by explicit permissions.

### Participants

Participants are the authority's member organisations.

In this scenario, participants are IT platform suppliers. James calls them vendors because they sell IT platforms to subscriber/customer organisations.

Participants should be able to:

- Maintain their own organisation profile.
- Create, complete, and manage their due diligence cases or DDQs.
- Upload evidence and supporting information.
- Invite subscribers to review selected due diligence data.
- Invite third-party helpers such as lawyers or compliance consultants.
- Respond to requests for additional information.
- Manage due diligence relating to their own suppliers or vendors, where required.

The participant is the operational owner of its own due diligence data within the authority's tenant.

### Stakeholders

Stakeholders are organisations that buy, use, or are considering buying a participant's platform.

They need assurance that the platform supplier is carrying out appropriate due diligence. They should be able to review due diligence information that a participant has made available to them.

Stakeholders should be able to:

- Accept or use an invitation from a participant.
- Review due diligence records made available by that participant.
- Review evidence metadata and submitted answers.
- Request additional information.
- Track responses to those requests.
- Review due diligence information from multiple participants through one login.

Stakeholders should not be able to modify participant data unless they have also been granted a separate helper or service-provider permission.

### Third-Party Helpers

Some participants may use external professional support.

Examples include:

- Lawyers.
- Outsourced compliance firms.
- Consultants.
- Other specialist service providers.

These helpers are not the same as ordinary stakeholders. A stakeholder primarily reviews data. A helper may be granted permission to create, modify, or manage participant data on the participant's behalf.

A helper may work with multiple participants. A helper may also be a participant in its own right.

## Configurable Terminology

The platform should keep generic internal concepts, but each authority should be able to configure the labels presented in the UI.

Recommended internal concepts:

- Authority.
- Participant.
- Stakeholder.
- Third-party helper.
- Case.
- Case template.
- Task.
- Evidence.
- Access grant.
- Request for information.

For this authority, the displayed labels should probably be:

| Internal concept | Display label for this authority |
| --- | --- |
| Authority | Association |
| Participant | Vendor |
| Stakeholder | Subscriber |
| Third-party helper | Service provider |
| Case | Due diligence pack |
| Case template | DDQ template |
| Task | Due diligence item |
| Evidence | Evidence |
| Access grant | Access grant |
| Request for information | Request for information |

The implementation should avoid hard-coding these labels into business logic. The database should eventually store authority-specific labels so the UI can consistently use the vocabulary configured for the active authority.

For the current frontend-only phase, the in-memory dataset can include a terminology configuration object for the seeded authority.

## Tenant And Data Partitioning

The authority should remain the primary tenant boundary.

Every business record should belong to exactly one authority unless it is truly global platform configuration.

Authority-scoped records include:

- Participants/vendors.
- Stakeholders/subscribers.
- Third-party helper organisations.
- Users and memberships.
- Case/DDQ templates.
- Participant due diligence cases.
- Due diligence tasks/items.
- Evidence metadata.
- Access grants.
- Requests for information.
- Vendor-of-vendor relationships.

Platform operator records sit above authorities and should be reserved for:

- Managing authorities.
- Operating the SaaS platform.
- Supporting deployments, billing, or diagnostics.
- Global system configuration.

Platform operator access to authority data should be deliberate and auditable, not assumed.

## Corrected Ownership Model

The current model should be adjusted from:

> Authority creates and reviews participant cases.

To:

> Authority defines the scheme, terminology, and DDQ templates. Participants receive or create their own case instances from those templates, then manage and control their own due diligence data. Stakeholders and helpers access participant data only through explicit grants.

This keeps the authority central without making it the default owner of each vendor's private data.

### Authority Responsibilities

Authority users may need to:

- Configure scheme terminology.
- Configure DDQ templates from approved task types.
- Configure participant onboarding.
- Manage authority-level users.
- Manage participant membership in the authority.
- See high-level scheme health.
- See aggregate status where permitted.
- Support governance workflows if explicit authority review is required.

Authority users should not automatically:

- Read every participant's evidence.
- Modify participant-submitted due diligence data.
- Grant subscriber access on behalf of a participant unless a specific delegated permission exists.

### Participant Responsibilities

Participant users may need to:

- Manage participant profile data.
- Manage participant users.
- Complete DDQs and due diligence packs.
- Upload evidence.
- Submit due diligence packs.
- Invite subscribers.
- Invite third-party helpers.
- Decide which subscribers can see which data.
- Respond to requests for information.
- Manage due diligence about their own vendors or suppliers.

### Stakeholder Responsibilities

Stakeholder users may need to:

- Review due diligence made available by participants.
- Request additional information.
- Track responses.
- Compare or monitor multiple participant vendors.
- Keep their own review status and notes.

Stakeholder review state should belong to the stakeholder organisation. One stakeholder's review decision should not automatically become another stakeholder's decision.

### Third-Party Helper Responsibilities

Third-party helper users may need to:

- Access participant workspaces where they have been invited.
- Create, edit, or review due diligence data where permission allows.
- Help respond to stakeholder requests.
- Work across multiple participant accounts.
- Maintain their own account context if they are also a participant or stakeholder elsewhere.

## User And Account Model

The current "one user kind only" rule should be replaced.

The corrected rule is:

- A person has one login identity.
- A person can belong to multiple authorities.
- Within an authority, a person can belong to multiple organisations or account contexts.
- The same person can hold different roles in different contexts.
- The active authority and account context determine what the user can see and do.

Examples the system must support:

- A vendor employee manages one vendor's due diligence.
- A subscriber employee reviews due diligence from multiple vendors.
- A lawyer helps several vendors complete due diligence.
- A compliance firm helps vendors and also maintains its own due diligence profile.
- A user has admin rights in one account and read-only rights in another.

## Access Grants

Participant-controlled access grants are essential.

A participant should be able to grant access to:

- A stakeholder/subscriber organisation.
- A third-party helper organisation.
- A specific user, where narrower access is required.

Each grant should record:

- Authority.
- Granting participant.
- Grantee organisation or user.
- Grantee type:
  - Stakeholder/subscriber.
  - Third-party helper/service provider.
  - Authority user, if explicit authority review is required.
- Permission level.
- Data scope.
- Status.
- Created by.
- Created date.
- Optional expiry date.

Suggested permission levels:

- Read only.
- Request information.
- Review and comment.
- Create and edit.
- Administer grants.

Suggested data scopes:

- Entire participant workspace.
- Specific due diligence pack.
- Specific DDQ item.
- Specific vendor-of-vendor record.
- Evidence metadata only, where needed.

Suggested statuses:

- Invited.
- Active.
- Suspended.
- Revoked.
- Expired.

## Requests For Information

The current model needs a first-class request workflow.

Stakeholders should be able to ask for more information when reviewing due diligence. Participants and authorised helpers should be able to respond.

Requests should be attachable to:

- A participant.
- A due diligence pack.
- A due diligence item.
- Evidence metadata, once evidence is represented separately enough.
- A vendor-of-vendor record.

Suggested request statuses:

- Open.
- In progress.
- Answered.
- Accepted.
- Withdrawn.

The request should record:

- Requesting stakeholder.
- Requesting user.
- Owning participant.
- Assigned participant user or helper, if any.
- Request text.
- Response text.
- Related due diligence item, if any.
- Status history.
- Timestamps.

## Vendor-Of-Vendor Due Diligence

The model must support due diligence about a participant's own vendors or suppliers.

This should be represented inside the authority partition but controlled by the participant that owns the relationship.

The first implementation can keep this simple:

- A participant can create vendor-of-vendor records.
- A due diligence pack can relate to the participant itself or to one of its vendor-of-vendor records.
- Access grants can include or exclude vendor-of-vendor information.
- Stakeholders can request additional information about vendor-of-vendor due diligence where they have access.

This supports the important requirement that DDQs may need to cover vendors of vendors.

## Functional Changes Required In The Current Monorepo

### 1. Reframe The Existing Demo Data

The current in-memory dataset should be adjusted so that it tells this story clearly:

- One authority represents the association.
- Several participants represent member vendors.
- Several stakeholders represent subscriber/customer organisations.
- At least one third-party helper represents an external lawyer or compliance firm.
- One stakeholder has access to multiple participants.
- One helper has access to multiple participants.
- One helper is also represented as a participant in its own right.
- At least one participant has a vendor-of-vendor record.
- One authority-defined DDQ template contains realistic IT vendor due diligence tasks.

The UI should feel like James's due diligence system first. Generic flexibility should exist in the structure, not in visible explanatory text.

The initial DDQ task examples should include:

- Information security policy.
- ISO 27001, SOC 2, or equivalent assurance evidence.
- Penetration test summary.
- Vulnerability management process.
- Data protection registration.
- GDPR data processing agreement.
- Subprocessor register.
- Hosting and data residency statement.
- Backup and restore evidence.
- Business continuity and disaster recovery plan.
- Incident response plan.
- Cyber insurance evidence.
- Access control and MFA attestation.
- Secure development lifecycle questionnaire.
- AI usage and customer-data disclosure.
- Critical supplier register.
- Vendor-of-vendor DDQ.
- Senior officer attestation and signature.

### 2. Add Authority Terminology Configuration

Add authority-scoped terminology to the domain data.

For the seeded association, configure labels such as:

- Authority: Association.
- Participant: Vendor.
- Stakeholder: Subscriber.
- Third-party helper: Service provider.
- Case: Due diligence pack.
- Case template: DDQ template.
- Task: Due diligence item.

The UI should read these labels from the active authority context wherever practical.

### 3. Replace User-Kind Exclusivity With Multi-Context Membership

Update the in-memory model so:

- `UserAccount` represents login identity only.
- Memberships connect users to authority, participant, stakeholder, or helper contexts.
- Users can have multiple memberships.
- Users select an authority and account context after sign-in.
- Route access and actions depend on the active context.

### 4. Keep Authority As Tenant Boundary But Restrict Data Access

Update ownership and query rules so:

- All records remain authority-scoped.
- Participant due diligence data is controlled by the participant.
- Stakeholder visibility comes from grants.
- Helper visibility and edit rights come from grants.
- Authority access to participant due diligence data is explicit rather than automatic.

### 5. Split Stakeholder Review From Helper Modification

Stakeholders/subscribers and helpers/service providers should not be treated as the same thing.

Stakeholders primarily:

- Read.
- Review.
- Request information.
- Track responses.

Helpers may, where granted:

- Create.
- Edit.
- Review.
- Respond.
- Manage selected due diligence data.

### 6. Add Access Grants

Add participant-managed access grants.

The initial UI should support:

- Viewing grants for a participant.
- Creating a grant to a stakeholder.
- Creating a grant to a helper.
- Setting a permission level.
- Setting an active, suspended, or revoked status.
- Filtering stakeholder and helper views by active grants.

### 7. Add Requests For Information

Add a workflow that allows stakeholders to request more information.

The initial UI should support:

- Stakeholder creates request.
- Participant sees open requests.
- Authorised helper sees open requests where granted.
- Participant or helper responds.
- Request status updates are visible to both sides.

### 8. Reframe Cases As Due Diligence Packs

Keep the generic internal case concept, but display it using the authority's configured terminology.

For this authority:

- Case should display as due diligence pack.
- Case template should display as DDQ template.
- Case task should display as due diligence item.

The underlying case model can remain generic as long as ownership and access rules are corrected.

### 9. Add Vendor-Of-Vendor Records

Add basic support for participant-owned vendor-of-vendor records.

The initial UI should support:

- Participant can see vendor-of-vendor records.
- Participant can associate a due diligence pack with a vendor-of-vendor record.
- Stakeholder visibility respects grant scope.

## Proposed Domain Shape

The code can evolve from the current entities toward these concepts:

- `Authority`
  - Tenant partition and scheme configuration.
- `AuthorityTerminology`
  - Authority-specific display labels.
- `PartyAccount`
  - Organisation or person inside an authority.
  - Types include participant, stakeholder, helper, and authority-owned account.
- `UserAccount`
  - Login identity.
- `AccountMembership`
  - User membership in an authority or party account.
- `CaseTemplate`
  - Generic template, displayed as DDQ template for this authority.
- `Case`
  - Generic case instance, displayed as due diligence pack for this authority.
- `CaseTask`
  - Generic task or item, displayed as due diligence item for this authority.
- `EvidenceMetadata`
  - Metadata for uploaded files in the current frontend-only phase.
- `AccessGrant`
  - Participant-controlled access to due diligence data.
- `InformationRequest`
  - Stakeholder request for more information.
- `VendorRelationship`
  - Participant-owned vendor-of-vendor relationship.

This shape preserves the generic case management foundation while matching the first real business scenario.

## Recommended Implementation Stages

Codex should execute the correction in seven stages.

### Stage 1 - Authority Terminology And Corrected Seed Data

Goal:

- Make the dataset and UI vocabulary match the association/vendor/subscriber model.

Work:

- Add authority terminology configuration.
- Seed the association as the authority.
- Seed vendors as participants.
- Seed subscribers as stakeholders.
- Seed service providers as helpers.
- Seed users with multiple memberships.
- Seed grants, requests, and vendor-of-vendor examples.
- Seed realistic IT vendor DDQ task types and template tasks.

Acceptance:

- The demo data represents the real business model.
- The UI presents James's vocabulary.
- The generic concepts remain available underneath the labels.

### Stage 2 - Login, Authority Context, And Account Switching

Goal:

- Support one login across multiple contexts.

Work:

- Select user identity first.
- Select authority and account context after sign-in.
- Store active authority and active context.
- Add account switching in the header.
- Route users based on active context and permissions.

Acceptance:

- A user can access multiple vendor, subscriber, or helper contexts.
- Refresh preserves the selected context.
- The UI always knows the active authority partition.

### Stage 3 - Participant-Controlled Workspaces

Goal:

- Put vendors in operational control of their own due diligence data.

Work:

- Reframe participant pages as vendor workspace pages using configured labels.
- Ensure due diligence packs belong to participants.
- Ensure authority users do not automatically see private participant evidence.
- Add participant user management where needed.

Acceptance:

- Vendor users can manage their own workspace.
- Authority data partitioning is preserved.
- Authority access to vendor due diligence is restricted unless explicitly granted.

### Stage 4 - Access Grants

Goal:

- Let vendors invite and control subscribers and helpers.

Work:

- Add grant data, commands, and views.
- Support stakeholder/subscriber grants.
- Support helper/service-provider grants.
- Enforce grant status and permission level in views and actions.

Acceptance:

- Subscribers only see vendors that granted them access.
- Helpers only see vendors that granted them access.
- Create/edit rights are available only when granted.

### Stage 5 - Due Diligence Pack Workflow

Goal:

- Make the case workflow behave like vendor due diligence.

Work:

- Display cases as due diligence packs.
- Display case templates as DDQ templates.
- Display case tasks as due diligence items.
- Allow vendors and authorised helpers to update pack items.
- Allow subscribers to review granted packs.
- Scope subscriber review state to the subscriber organisation.

Acceptance:

- The workflow feels like DDQ management, not authority case review.
- Vendors and helpers can work as intended.
- Subscribers can review but not accidentally own or modify vendor data.

### Stage 6 - Requests For Information

Goal:

- Add the subscriber feedback loop.

Work:

- Add request data and commands.
- Add subscriber request action.
- Add vendor and helper request inboxes.
- Add response and status transitions.

Acceptance:

- Subscribers can request more information.
- Vendors and authorised helpers can respond.
- Both sides can track request state.

### Stage 7 - Vendor-Of-Vendor Support And Final Functional Polish

Goal:

- Cover vendors of vendors and make the corrected model coherent throughout the app.

Work:

- Add vendor-of-vendor records.
- Link due diligence packs to vendor-of-vendor records.
- Add grant scopes for vendor-of-vendor visibility.
- Update search, app launcher, route guards, dashboards, and empty states.
- Update the main functional specification after the UI proves the corrected model.

Acceptance:

- Vendor-of-vendor due diligence is represented.
- Subscriber visibility respects grant scope.
- The app consistently presents the association/vendor/subscriber model.
- Type-check and build pass.

## Open Questions For James

These questions should be confirmed before backend persistence and real identity are implemented:

- Should the association ever review vendor due diligence, or should it only configure the scheme and view aggregate operational status?
- Can a vendor grant access to an entire subscriber organisation, or must access sometimes be limited to named subscriber users?
- Should subscriber review notes and decisions be visible to the vendor?
- Should one subscriber's review outcome ever be visible to another subscriber?
- Can a service provider invite additional users from its own firm into a vendor workspace, or must the vendor invite each helper?
- Should a vendor be able to delegate access-grant management to a service provider?
- Who owns a vendor-of-vendor DDQ when the child vendor is also a participant in the authority?
- What audit trail is required for access, viewing, evidence changes, and requests for information?
