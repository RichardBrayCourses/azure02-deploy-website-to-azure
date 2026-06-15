# All Checks Out - Domain Model Specification

# Status

This document is the authoritative description of the domain model.

Future agents should read this document before making any architectural, database or UI decisions.

The design has been intentionally simplified to support a first release while leaving room for future enhancements.

---

# Core Principles

## Multi-Tenant System

The platform is multi-tenant.

The tenant boundary is:

```text
Authority
```

All business data belongs to exactly one Authority.

There is no sharing of Participants, Stakeholders, Cases or Templates between Authorities.

---

# Top Level Hierarchy

```text
System Owner
|
+-- Authorities
      |
      +-- Authority Users
      |
      +-- Participants
      |     |
      |     +-- Participant Users
      |
      +-- Stakeholders
      |     |
      |     +-- Stakeholder Users
      |
      +-- Stakeholder Participant Access
      |
      +-- Case Templates
      |     |
      |     +-- Case Template Tasks
      |     |
      |     +-- Case Template Participants
      |
      +-- Cases
            |
            +-- Case Tasks

Task Types
```

---

# Identity Model

Authentication is performed by Microsoft Entra ID.

Entra is responsible for:

- Authentication
- Email address
- Display name
- Broad application role

The application database is responsible for:

- Authority membership
- Participant membership
- Stakeholder membership
- Permissions
- Business relationships

---

# User Kind

Every user belongs to exactly one User Kind.

```text
SYSTEM_OWNER
AUTHORITY
PARTICIPANT
STAKEHOLDER
```

A user cannot belong to multiple User Kinds.

Examples:

Invalid:

```text
AUTHORITY + PARTICIPANT
```

```text
PARTICIPANT + STAKEHOLDER
```

```text
SYSTEM_OWNER + AUTHORITY
```

---

# User Permissions

Each user is either:

```text
ADMIN
MEMBER
```

No additional permission levels currently exist.

Future versions may introduce:

- Reviewer
- Read Only
- Approver
- Auditor

but these are not part of the initial model.

---

# Entity: SystemOwner

Represents the organisation operating the SaaS platform.

Properties:

```text
id
name
status
created_at
updated_at
```

Status:

```text
ACTIVE
INACTIVE
```

Relationships:

```text
SystemOwner
    1 -> many Authorities

SystemOwner
    1 -> many SystemOwnerUsers
```

System Owners are always organisations.

---

# Entity: SystemOwnerUser

Properties:

```text
id
system_owner_id
user_account_id
role
created_at
updated_at
```

Role:

```text
ADMIN
MEMBER
```

Responsibilities:

```text
Create Authorities
Manage System Owner users
Platform administration
```

---

# Entity: Authority

Represents the tenant boundary.

Examples:

```text
IT Platform Association
Oxfordshire Council
NHS Trust
```

Properties:

```text
id
system_owner_id
name
description
status
created_at
updated_at
```

Status:

```text
ACTIVE
INACTIVE
```

Relationships:

```text
Authority
    many Participants

Authority
    many Stakeholders

Authority
    many AuthorityUsers

Authority
    many CaseTemplates

Authority
    many Cases
```

Authorities are always organisations.

---

# Entity: AuthorityUser

Properties:

```text
id
authority_id
user_account_id
role
created_at
updated_at
```

Role:

```text
ADMIN
MEMBER
```

Responsibilities:

```text
Manage Participants
Manage Stakeholders
Create Templates
Assign Cases
Review Submissions
```

---

# Entity: Participant

Represents the organisation or person completing work.

Properties:

```text
id
authority_id
participant_type
display_name
status
created_at
updated_at
```

participant_type:

```text
ORGANISATION
PERSON
```

status:

```text
ACTIVE
INACTIVE
INVITED
```

Relationships:

```text
Participant
    belongs to one Authority

Participant
    many ParticipantUsers

Participant
    many Cases

Participant
    many CaseTemplateParticipants
```

Rules:

Organisation:

```text
0..many users
```

Person:

```text
normally exactly 1 user
```

A Person may temporarily exist without a user while being invited.

---

# Entity: ParticipantUser

Properties:

```text
id
participant_id
user_account_id
role
created_at
updated_at
```

Role:

```text
ADMIN
MEMBER
```

---

# Entity: Stakeholder

Represents an entity interested in Participant outcomes.

Properties:

```text
id
authority_id
stakeholder_type
display_name
status
created_at
updated_at
```

stakeholder_type:

```text
ORGANISATION
PERSON
```

status:

```text
ACTIVE
INACTIVE
INVITED
```

Relationships:

```text
Stakeholder
    belongs to one Authority

Stakeholder
    many StakeholderUsers

Stakeholder
    many StakeholderParticipantAccess records
```

Rules identical to Participant.

---

# Entity: StakeholderUser

Properties:

```text
id
stakeholder_id
user_account_id
role
created_at
updated_at
```

Role:

```text
ADMIN
MEMBER
```

---

# Entity: StakeholderParticipantAccess

Controls which Participants a Stakeholder may monitor.

Properties:

```text
id
stakeholder_id
participant_id
status
approved_by_user_id
approved_at
created_at
updated_at
```

status:

```text
APPROVED
SUSPENDED
REVOKED
```

Relationships:

```text
Stakeholder
    many Participants

Participant
    many Stakeholders
```

---

# Entity: UserAccount

Represents a login identity.

Properties:

```text
id
entra_object_id
email
display_name
user_kind
status
created_at
updated_at
```

user_kind:

```text
SYSTEM_OWNER
AUTHORITY
PARTICIPANT
STAKEHOLDER
```

status:

```text
ACTIVE
DISABLED
```

---

# Entity: TaskType

Task Types are hardcoded software capabilities.

Task Types are global.

Task Types do not belong to an Authority.

Properties:

```text
id
code
name
description
parameter_schema_json
status
created_at
updated_at
```

status:

```text
ACTIVE
DEPRECATED
```

Examples:

```text
UPLOAD_DOCUMENT
UPLOAD_DRIVING_LICENCE
QUESTIONNAIRE
UPLOAD_POLICY
```

---

# Entity: CaseTemplate

Designed by an Authority.

Represents a reusable case definition.

Properties:

```text
id
authority_id
name
description
status
created_at
updated_at
published_at
published_by_user_id
```

status:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Relationships:

```text
CaseTemplate
    many CaseTemplateTasks

CaseTemplate
    many CaseTemplateParticipants

CaseTemplate
    many Cases
```

---

# Entity: CaseTemplateTask

Configured use of a TaskType.

Properties:

```text
id
case_template_id
task_type_id
title
description
parameters_json
sort_order
status
created_after_publish
withdrawn_reason
withdrawn_at
withdrawn_by_user_id
created_at
updated_at
```

status:

```text
ACTIVE
WITHDRAWN
```

Important:

Tasks are never physically deleted.

Future functionality may withdraw tasks after publication.

---

# Entity: CaseTemplateParticipant

Represents a Participant that is in scope for a CaseTemplate.

Properties:

```text
id
case_template_id
participant_id
status
case_id
exemption_reason
decided_by_user_id
decided_at
created_at
updated_at
```

status:

```text
REQUIRED
EXEMPT
```

No row means:

```text
Participant not in scope.
```

Relationships:

```text
CaseTemplate
    many Participants

Participant
    many CaseTemplates
```

---

# Entity: Case

Participant-specific instance of a CaseTemplate.

Properties:

```text
id
authority_id
case_template_id
participant_id
status
created_at
updated_at
submitted_at
closed_at
```

status:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
APPROVED
REJECTED
CLOSED
```

Relationships:

```text
Case
    one Authority

Case
    one Participant

Case
    one CaseTemplate

Case
    many CaseTasks
```

Cases are generated immediately after publication.

Cases are not lazily created.

---

# Entity: CaseTask

Participant-specific task instance.

Properties:

```text
id
case_id
case_template_task_id
status
response_json
evidence_json
withdrawn_at
created_at
updated_at
```

status:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
PASSED
FAILED
WITHDRAWN
```

Relationships:

```text
CaseTask
    belongs to one Case

CaseTask
    belongs to one CaseTemplateTask
```

---

# Future Features

The schema must support future additions.

These features are expected but not yet implemented:

```text
Audit History
Notifications
Comments
Task Amendments
Task Replacement
Email Reminders
Workflow Automation
External Integrations
File Storage
Evidence Versioning
```

The schema should be designed so these can be added without redesigning the core model.
