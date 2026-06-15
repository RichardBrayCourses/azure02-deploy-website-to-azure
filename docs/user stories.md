# All Checks Out - User Stories

# Purpose

This document describes the expected behaviour of the system from the perspective of each user type.

For each user story:

- The business goal is described.
- The user actions are described.
- The internal system behaviour is described.
- The entities affected are listed.

This document should be used alongside the Domain Model Specification.

---

# Authority User Stories

Authority users administer the tenant and define the business process.

---

# Authority User Story 1 - Create a Participant

## Description

An Authority Administrator creates a new Participant.

The Participant may be either an Organisation or a Person.

Examples:

- Platform Provider
- Resident
- Community Nurse

## User Actions

- Open Participants page
- Click Create Participant
- Select Organisation or Person
- Enter participant details
- Save

## Internal System Actions

- Create Participant record
- Associate Participant with Authority
- Set Participant status to ACTIVE

## Entities Updated

```text
Participant
```

---

# Authority User Story 2 - Create Participant User

## Description

An Authority Administrator creates a login user for a Participant.

## User Actions

- Open Participant
- Select Users
- Click Create User
- Enter details
- Select Admin or Member

## Internal System Actions

- Create UserAccount
- Create ParticipantUser
- Associate User with Participant

## Entities Updated

```text
UserAccount
ParticipantUser
```

---

# Authority User Story 3 - Create a Stakeholder

## Description

An Authority Administrator creates a Stakeholder.

Examples:

- Customer
- Patient
- Observer

## User Actions

- Open Stakeholders page
- Click Create Stakeholder
- Select Organisation or Person
- Enter details
- Save

## Internal System Actions

- Create Stakeholder
- Associate Stakeholder with Authority

## Entities Updated

```text
Stakeholder
```

---

# Authority User Story 4 - Create Stakeholder User

## Description

Create a login user for a Stakeholder.

## User Actions

- Open Stakeholder
- Open Users tab
- Create User

## Internal System Actions

- Create UserAccount
- Create StakeholderUser

## Entities Updated

```text
UserAccount
StakeholderUser
```

---

# Authority User Story 5 - Grant Stakeholder Access

## Description

Allow a Stakeholder to monitor one or more Participants.

## User Actions

- Open Stakeholder
- Select Participant
- Grant Access

## Internal System Actions

- Create StakeholderParticipantAccess
- Record approval details

## Entities Updated

```text
StakeholderParticipantAccess
```

---

# Authority User Story 6 - Create a Case Template

## Description

Create a new Case Template.

Example:

```text
2026 Platform Verification
```

## User Actions

- Open Templates
- Create Template
- Enter name and description

## Internal System Actions

- Create CaseTemplate

## Entities Updated

```text
CaseTemplate
```

---

# Authority User Story 7 - Add Tasks to a Case Template

## Description

Build the Case Template by selecting Task Types.

## User Actions

- Open Template
- Add Task
- Select Task Type
- Configure parameters
- Save

## Internal System Actions

- Create CaseTemplateTask
- Store parameters

## Entities Updated

```text
CaseTemplateTask
```

---

# Authority User Story 8 - Assign Participants to a Template

## Description

Define which Participants are required to complete the template.

## User Actions

- Open Template
- Select Participants
- Mark Required or Exempt

## Internal System Actions

- Create CaseTemplateParticipant

## Entities Updated

```text
CaseTemplateParticipant
```

---

# Authority User Story 9 - Publish a Template

## Description

Make the template active.

## User Actions

- Open Template
- Click Publish

## Internal System Actions

- Update CaseTemplate status
- Create Cases
- Create CaseTasks
- Link Cases to CaseTemplateParticipants

## Entities Updated

```text
CaseTemplate
Case
CaseTask
CaseTemplateParticipant
```

---

# Authority User Story 10 - Review Participant Submissions

## Description

Review work submitted by Participants.

## User Actions

- Open Case
- Open Task
- Review evidence
- Approve or Reject

## Internal System Actions

- Update CaseTask status
- Recalculate Case status

## Entities Updated

```text
CaseTask
Case
```

---

# Authority User Story 11 - Withdraw a Task After Publication

## Description

A mistake has been found in a live template.

The Authority withdraws a task.

## User Actions

- Open Template
- Select Task
- Withdraw Task

## Internal System Actions

- Mark CaseTemplateTask as WITHDRAWN
- Mark incomplete CaseTasks as WITHDRAWN

## Entities Updated

```text
CaseTemplateTask
CaseTask
```

---

# Authority User Story 12 - Add a New Task After Publication

## Description

A missing task must be added.

## User Actions

- Open Template
- Add Task

## Internal System Actions

- Create CaseTemplateTask
- Create CaseTask for every existing Case

## Entities Updated

```text
CaseTemplateTask
CaseTask
```

---

# Participant User Stories

Participants complete work.

---

# Participant User Story 1 - View Assigned Cases

## Description

View Cases assigned to the Participant.

## User Actions

- Login
- Open Dashboard

## Internal System Actions

- Retrieve Participant
- Retrieve Cases

## Entities Read

```text
Participant
Case
```

---

# Participant User Story 2 - Open a Case

## Description

View a specific Case.

## User Actions

- Open Case

## Internal System Actions

- Load Case
- Load CaseTasks

## Entities Read

```text
Case
CaseTask
```

---

# Participant User Story 3 - Complete a Task

## Description

Perform work required by a Case Task.

## User Actions

- Open Task
- Complete task UI
- Save

## Internal System Actions

- Update response_json
- Update CaseTask status

## Entities Updated

```text
CaseTask
```

---

# Participant User Story 4 - Upload Evidence

## Description

Upload supporting documents.

## User Actions

- Open Task
- Upload file

## Internal System Actions

- Store evidence reference
- Update CaseTask

## Entities Updated

```text
CaseTask
```

---

# Participant User Story 5 - Submit a Task

## Description

Submit a completed task for review.

## User Actions

- Click Submit

## Internal System Actions

- Update CaseTask status

## Entities Updated

```text
CaseTask
```

---

# Participant User Story 6 - Submit a Case

## Description

Submit all work for review.

## User Actions

- Submit Case

## Internal System Actions

- Validate all required tasks
- Update Case status

## Entities Updated

```text
Case
```

---

# Participant User Story 7 - View Review Outcomes

## Description

See whether tasks passed or failed.

## User Actions

- Open Case

## Internal System Actions

- Load review status

## Entities Read

```text
Case
CaseTask
```

---

# Stakeholder User Stories

Stakeholders observe outcomes.

---

# Stakeholder User Story 1 - View Accessible Participants

## Description

View Participants that have been approved for monitoring.

## User Actions

- Login
- Open Participants

## Internal System Actions

- Load StakeholderParticipantAccess

## Entities Read

```text
StakeholderParticipantAccess
Participant
```

---

# Stakeholder User Story 2 - View Participant Status

## Description

View summary compliance status.

## User Actions

- Open Participant

## Internal System Actions

- Load Cases
- Calculate summary

## Entities Read

```text
Participant
Case
```

---

# Stakeholder User Story 3 - View Case Details

## Description

View details of a Participant Case.

## User Actions

- Open Case

## Internal System Actions

- Load Case
- Load CaseTasks

## Entities Read

```text
Case
CaseTask
```

---

# Stakeholder User Story 4 - View Task Outcomes

## Description

View task-level pass/fail status.

## User Actions

- Open Task

## Internal System Actions

- Load CaseTask

## Entities Read

```text
CaseTask
```

---

# Stakeholder User Story 5 - View Evidence

## Description

View evidence uploaded by Participants.

## User Actions

- Open Task
- Open Evidence

## Internal System Actions

- Retrieve evidence references

## Entities Read

```text
CaseTask
```
