# Generic Design

## Core Principle

The platform should avoid being tied to one industry-specific idea such as an incident, appointment, inspection, service visit, permit, claim, or renewal.

Instead, the core concept is a **Case**.

A case represents a structured business process involving one or more parties, where information must be collected, tasks must be completed, evidence may be submitted, and an outcome may need to be reviewed, approved, verified, paid for, or recorded.

This makes the platform flexible enough to support many scenarios, including:

- Plumbing and electrical service visits
- Healthcare or nurse home visits
- Council permit renewals
- Trade association compliance checks
- Property inspections
- Insurance assessments
- Membership onboarding
- Contractor approvals
- Annual declarations

The system should be configurable so that each authority can define its own terminology, forms, workflows, participants, permissions, and completion rules.

---

## Generic Product Description

This is a configurable **Case, Compliance and Service Management Platform**.

It allows authorities to define repeatable business processes where people or organizations must:

- create or receive a case
- complete tasks
- submit forms
- upload documents or photos
- provide evidence
- sign declarations
- make payments
- approve or reject submissions
- notify other parties
- report on progress and outcomes

The same underlying platform can then be adapted to different industries without changing the core architecture.

---

## Actor Model

The platform should support three broad categories of user.

These are deliberately generic. Each case type can rename them or use only the ones it needs.

---

## 1. Authority

The authority is the body that manages the system configuration, rules, workflows, branding, reporting, and access control for one or more participants.

Examples:

- Trade association
- Plumbing or electrical firm
- NHS trust
- Local council
- Insurance provider
- Property management company
- Membership body

The authority may define:

- case types
- forms
- workflows
- roles and permissions
- required evidence
- approval processes
- notification rules
- reports
- integrations

---

## 2. Participants

Participants are the people or organizations who carry out work, administer the process, complete duties, submit information, or provide evidence.

Examples:

- Employees
- Contractors
- Nurses
- Inspectors
- IT platform providers
- Residents
- Applicants
- Members
- Field engineers
- Admin staff

This category is intentionally broad.

In one scenario, the participant might be an employee completing a service visit. In another, it might be a resident renewing a permit, a supplier submitting compliance documents, or a member organization completing an annual declaration.

Participants may:

- create cases
- be assigned cases
- complete tasks
- submit forms
- upload evidence
- add notes
- request approval
- respond to queries
- update case status

---

## 3. Stakeholders

Stakeholders are people or organizations who need visibility, assurance, confirmation, audit access, or outcome verification.

Examples:

- Stakeholders
- Patients
- Inspectors
- Auditors
- Regulators
- Family members
- Landlords
- Internal managers
- Association stakeholders

Stakeholders may:

- view selected case information
- receive notifications
- confirm that work was completed
- verify submitted evidence
- review outcomes
- download documents
- provide feedback or signatures

Not every case type needs stakeholders. In some workflows, the case may only involve the authority and the participant.

---

## Core Concepts

The platform can be described using the following generic concepts:

- **Authority**: the tenant-level organization that defines configuration, workflows, permissions, and reporting
- **Case Type**: a configurable template for a business process
- **Case**: a single instance of that process
- **Participant**: a person or organization involved in doing the work, submitting information, or completing case duties
- **Role**: what a participant is allowed to do
- **Task**: a required action within a case
- **Form**: structured data to be captured
- **Evidence**: files, photos, documents, signatures, locations, or declarations
- **Workflow State**: the current stage of the case
- **Approval**: a review decision made by an authorised user
- **Notification**: an email or message triggered by case activity
- **Report**: a summary or dashboard of case data
- **Integration**: an external system such as billing, accounting, identity, or AI services

The current demo data model keeps the three main party types separate:

- **Authority**: `id`, `name`, and descriptive metadata
- **Participant**: `id`, `name`, and an `authorityId` reference
- **Stakeholder**: `id` and `name`, referenced from a participant by `stakeholderId`

Relationships should be stored as dataless keys rather than embedded display fields. For example, a participant references its authority by `authorityId`; the UI resolves that key when it needs a display name. The model should not use a generic `owner` field, because that blurs the difference between authorities, participants, stakeholders, and task responsibility.

---

## Configurable Case Types

Instead of hard-coding a plumbing visit, patient assessment, or permit renewal, the system should allow administrators to create **Case Types**.

Each case type should define:

- what the case is called
- who can create it
- who can be assigned to it
- which participant roles are involved
- which forms must be completed
- which documents or photos are required
- whether signatures are required
- whether GPS/location evidence is required
- which workflow states are used
- what approvals are required
- what notifications are sent
- whether payment or invoicing is required
- what makes the case complete
- who can view the final outcome

This allows the platform to support different industries while retaining one common technical architecture.

---

## Example Mappings

| Generic Concept | Plumbing / Electrical Firm | Nurse / Healthcare Visit | Council Permit Renewal |
|---|---|---|---|
| Authority | Plumbing firm | NHS trust | Local council |
| Participant | Engineer or employee | Nurse or care worker | Resident / applicant / admin officer |
| Stakeholder | Customer / service recipient | Patient / inspector | Usually none, or internal council reviewer |
| Case | Service visit | Patient visit | Permit renewal |
| Evidence | Photos, work notes, signature | Assessment form, notes, care record | Vehicle documents, driving licence, proof of address, payment |
| Workflow | Scheduled, completed, approved, invoiced | Scheduled, submitted, reviewed, closed | Draft, submitted, awaiting review, approved, rejected |
| Outcome | Work completed and verified | Visit recorded and reviewed | Permit renewed or declined |

---

## Example: Plumbing or Electrical Firm

The authority is the firm.

Participants are the employees, contractors, or engineers who fulfil the tasks.

Stakeholders are the people or organizations who want to verify that the service was completed and that all required work, photos, notes, and signatures are present.

Possible case type:

- Service Visit

Required evidence:

- Stakeholder details
- Job notes
- Photos
- Work completed checklist
- Stakeholder signature
- Invoice

---

## Example: Nurse or Healthcare Visit

The authority is the NHS trust or healthcare provider.

Participants are the nurses, care workers, admin staff, or inspectors.

Stakeholders may include patients, inspectors, family members, or internal reviewers, depending on the use case.

Possible case type:

- Patient Visit

Required evidence:

- Patient details
- Assessment form
- Visit notes
- Follow-up date
- Review status

---

## Example: Council Permit Renewal

The authority is the council.

Participants include the residents who must complete the renewal duties and the council employees who administer or review the process.

Stakeholders may not exist in this scenario, unless an internal reviewer, auditor, or external authority needs visibility.

Possible case type:

- Annual Permit Renewal

Required evidence:

- Vehicle documents
- Driving licence
- Proof of residential address
- Declaration
- Payment confirmation

---

## Design Implication

The system should not assume that:

- cases are always created by staff
- tasks are always completed by employees
- evidence is always submitted by internal users
- stakeholders always exist
- every case needs a stakeholder
- every workflow ends in an invoice
- every case represents an incident

Instead, the platform should define flexible roles and permissions per case type.

This makes it possible to support service delivery, compliance, renewals, approvals, inspections, evidence collection, and verification using the same underlying model.

---

## Suggested High-Level Architecture

At a high level, the system can be thought of as:

```text
Authority
  -> Participants
  -> Case Types
    -> Cases
      -> Participants
      -> Tasks
      -> Forms
      -> Evidence
      -> Notes
      -> Workflow
      -> Notifications
      -> Reports
      -> Integrations
```

Or more compactly:

```text
Authority | Participants | Case Type | Case | Forms | Tasks | Evidence | Workflow | Reports | Notifications | Integrations
```

---

## Long-Term Vision

The long-term vision is to build a reusable configurable platform where authorities can define:

- their own case types
- their own participant roles
- their own forms
- their own evidence requirements
- their own workflows
- their own approval processes
- their own notification rules
- their own reporting requirements
- their own integrations

This creates a flexible foundation that can support many industries while remaining realistic and engaging as an Azure course project.
