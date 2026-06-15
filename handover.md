# All Checks Out - Domain Model and Architecture

# Overview

All Checks Out is a multi-tenant case management platform.

The system is designed to support a wide range of business processes including:

- Verification schemes
- Accreditation programmes
- Licensing
- Permit applications
- Healthcare workflows
- Service delivery
- Compliance programmes
- Audits and inspections

The platform intentionally avoids business-specific terminology so that it can be reused across multiple industries.

Examples include:

| Authority               | Participant          | Stakeholder |
| ----------------------- | -------------------- | ----------- |
| IT Platform Association | IT Platform Provider | Customer    |
| Local Council           | Resident             | N/A         |
| NHS Trust               | Community Nurse      | Patient     |
| Service Company         | Contractor           | Customer    |

---

# Multi-Tenant Architecture

The platform is multi-tenant.

The tenant boundary is the Authority.

All business data belongs to exactly one Authority.

```text
System Owner
|
+-- Authority
      |
      +-- Participants
      +-- Stakeholders
      +-- Users
      +-- Case Templates
      +-- Cases
```

---

# Core Business Entities

## System Owner

The System Owner operates the SaaS platform.

Responsibilities:

- Create Authorities
- Manage System Owner users
- Platform administration

System Owners are always organisations.

---

## Authority

An Authority manages a business process.

Responsibilities:

- Create Participants
- Create Stakeholders
- Create Case Templates
- Assign Cases
- Review submissions

Examples:

- IT Platform Association
- Oxfordshire Council
- NHS Trust

Authorities are always organisations.

---

## Participant

A Participant performs work within the system.

Examples:

- Platform Provider
- Resident
- Contractor
- Community Nurse

Participants may be:

```text
ORGANISATION
PERSON
```

Participants belong to exactly one Authority.

---

## Stakeholder

A Stakeholder views or consumes outcomes produced by Participants.

Examples:

- Customer
- Patient
- Regulatory Observer

Stakeholders may be:

```text
ORGANISATION
PERSON
```

Stakeholders belong to exactly one Authority.

---

# User Model

Users authenticate using Microsoft Entra ID.

Entra provides identity information and broad application roles.

The application database provides business relationships.

## User Kinds

```text
SYSTEM_OWNER
AUTHORITY
PARTICIPANT
STAKEHOLDER
```

A user belongs to exactly one User Kind.

A user cannot belong to multiple User Kinds.

Examples:

```text
Authority User
    Cannot also be Participant User

Participant User
    Cannot also be Stakeholder User
```

---

## Membership Levels

Each entity supports:

```text
ADMIN
MEMBER
```

Examples:

```text
AUTHORITY_ADMIN
AUTHORITY_MEMBER

PARTICIPANT_ADMIN
PARTICIPANT_MEMBER

STAKEHOLDER_ADMIN
STAKEHOLDER_MEMBER

SYSTEM_OWNER_ADMIN
SYSTEM_OWNER_MEMBER
```

---

# Organisation and Person Rules

## Organisations

An Organisation may have:

```text
0..many users
```

Examples:

```text
Acme Platforms Ltd
Big Bank plc
```

---

## Persons

A Person normally has:

```text
1 user
```

Examples:

```text
Richard Bray
Jane Smith
```

A Person may temporarily exist without a user during invitation or onboarding.

---

# Case Model

The platform distinguishes between:

```text
Task Type
Case Template
Case
```

These are different concepts.

---

# Task Types

Task Types are hard-coded capabilities implemented by software developers.

Examples:

```text
Upload Driving Licence
Upload Insurance Certificate
Answer Questionnaire
Upload Policy Document
```

Each Task Type:

- Has custom UI
- Has custom validation logic
- Has configurable parameters

Example:

```json
{
  "documentType": "Driving Licence",
  "requiresReview": true
}
```

The list of Task Types grows over time as the platform evolves.

---

# Case Templates

Authorities design Case Templates.

A Case Template defines:

- Which tasks must be completed
- Task ordering
- Task configuration parameters

Examples:

```text
2026 Platform Verification

2027 Platform Verification

Resident Parking Permit
```

Case Templates belong to exactly one Authority.

---

# Case Template Tasks

A Case Template contains a list of configured tasks.

Each configured task references a Task Type.

```text
Case Template
    -> Task Type A
    -> Task Type B
    -> Task Type C
```

Task configuration is stored separately from the Task Type implementation.

---

# Participant Assignment

Participants are assigned to Case Templates using:

```text
case_template_participant
```

This means:

> This Participant is in scope for this Case Template.

Status values:

```text
REQUIRED
EXEMPT
```

No row means:

```text
Participant is not in scope
```

This is intentional.

---

# Cases

A Case is a Participant-specific instance of a Case Template.

Examples:

```text
Case Template:
    2026 Platform Verification

Participant:
    Acme Platforms Ltd

Case:
    Acme Platforms Ltd - 2026 Platform Verification
```

A Case belongs to:

```text
1 Authority
1 Participant
1 Case Template
```

---

# Case Tasks

When a Case is created, Case Tasks are generated from the Case Template Tasks.

Case Tasks contain:

- Status
- Responses
- Evidence
- Review outcomes

Case Tasks are the participant-specific working data.

---

# Case Creation

Cases are created immediately.

Workflow:

```text
Create Case Template
Assign Participants
Publish Template
Generate Cases
Generate Case Tasks
```

Cases are not created lazily.

---

# Stakeholder Access

Stakeholders belong to an Authority.

A Stakeholder may monitor multiple Participants.

This relationship is managed through:

```text
stakeholder_participant_access
```

Example:

```text
Big Bank
    -> Acme Platforms

Big Bank
    -> Contoso Platforms
```

Access is controlled by the Authority.

---

# Template Amendments

Case Templates do not use full versioning.

Instead, templates support non-destructive amendment.

This allows Authorities to fix mistakes after publication.

Examples:

```text
Add new task
Withdraw task
Replace task
Update guidance
```

---

## Task Withdrawal

Tasks are never physically deleted.

Instead:

```text
ACTIVE
WITHDRAWN
```

is used.

Completed participant work is preserved.

This supports audit requirements and avoids data loss.

---

# Future Features

The schema should support future additions without redesign.

Examples:

- Task amendments
- Additional Task Types
- Notifications
- Comments
- Audit history
- Evidence management
- Workflow automation
- Reminder emails
- External integrations

The database schema should be designed to support these features even if they are not implemented in the initial release.

---

# Entity Relationship Summary

```text
System Owner
|
+-- System Owner Users
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
    referenced by Case Template Tasks
```
