# Database Entities

Common fields on all entities:

- `id: string`
- `createdAt: string`
- `updatedAt: string`

## SystemOwner

- `name: string`
- `status: EntityStatus`

## Authority

- `systemOwnerId: SystemOwnerId`
- `name: string`
- `description: string`
- `status: EntityStatus`

## AuthorityTerminology

- `authorityId: AuthorityId`
- `labels: TerminologyLabels`

## Participant

- `authorityId: AuthorityId`
- `participantType: PartyType`
- `displayName: string`
- `status: InviteStatus`

## Stakeholder

- `authorityId: AuthorityId`
- `stakeholderType: PartyType`
- `displayName: string`
- `status: InviteStatus`

## Agent

- `authorityId: AuthorityId`
- `agentType: PartyType`
- `displayName: string`
- `status: InviteStatus`

## UserAccount

- `entraObjectId: string`
- `email: string`
- `displayName: string`
- `userKind: UserKind`
- `status: UserAccountStatus`

## SystemOwnerUser

- `entityId: SystemOwnerId`
- `userAccountId: UserAccountId`
- `role: MembershipRole`

## AuthorityUser

- `entityId: AuthorityId`
- `userAccountId: UserAccountId`
- `role: MembershipRole`

## ParticipantUser

- `entityId: ParticipantId`
- `userAccountId: UserAccountId`
- `role: MembershipRole`

## StakeholderUser

- `entityId: StakeholderId`
- `userAccountId: UserAccountId`
- `role: MembershipRole`

## AgentUser

- `entityId: AgentId`
- `userAccountId: UserAccountId`
- `role: MembershipRole`

## StakeholderParticipantAccess

- `stakeholderId: StakeholderId`
- `participantId: ParticipantId`
- `status: AccessStatus`
- `approvedByUserId: UserAccountId`
- `approvedAt: string`

## AccessGrant

- `authorityId: AuthorityId`
- `participantId: ParticipantId`
- `granteeType: AccessGrantGranteeType`
- `granteeStakeholderId: StakeholderId | null`
- `granteeAgentId: AgentId | null`
- `granteeUserId: UserAccountId | null`
- `permissionLevel: AccessGrantPermissionLevel`
- `dataScopeType: AccessGrantDataScopeType`
- `dataScopeId: string | null`
- `status: AccessGrantStatus`
- `createdByUserId: UserAccountId`
- `expiresAt: string | null`

## TaskType

- `code: string`
- `name: string`
- `description: string`
- `parameterSchemaJson: JsonObject`
- `status: TaskTypeStatus`

## CaseTemplate

- `authorityId: AuthorityId`
- `name: string`
- `description: string`
- `status: CaseTemplateStatus`

## CaseTemplateTask

- `caseTemplateId: CaseTemplateId`
- `taskTypeId: TaskTypeId`
- `title: string`
- `description: string`
- `parametersJson: JsonObject`
- `sortOrder: number`
- `status: "ACTIVE" | "WITHDRAWN"`
- `withdrawnReason: string | null`
- `withdrawnAt: string | null`
- `withdrawnByUserId: UserAccountId | null`

## CaseTemplateParticipant

- `caseTemplateId: CaseTemplateId`
- `participantId: ParticipantId`
- `status: TemplateParticipantStatus`
- `caseId: CaseRecordId | null`
- `exemptionReason: string | null`
- `decidedByUserId: UserAccountId | null`
- `decidedAt: string | null`

## Case

- `authorityId: AuthorityId`
- `caseTemplateId: CaseTemplateId`
- `participantId: ParticipantId`
- `participantSupplierId: ParticipantSupplierId | null`
- `status: CaseStatus`
- `submittedAt: string | null`
- `closedAt: string | null`
- `withdrawnAt: string | null`
- `withdrawnByUserId: UserAccountId | null`
- `withdrawnReason: string | null`

## CaseTask

- `caseId: CaseRecordId`
- `caseTemplateTaskId: CaseTemplateTaskId`
- `status: CaseTaskStatus`
- `responseJson: JsonObject`
- `evidenceJson: JsonObject`
- `withdrawnAt: string | null`

## StakeholderReview

- `stakeholderId: StakeholderId`
- `caseId: CaseRecordId`
- `status: StakeholderReviewStatus`
- `note: string`
- `reviewedByUserId: UserAccountId`
- `reviewedAt: string`

## RequestForInformation

- `authorityId: AuthorityId`
- `participantId: ParticipantId`
- `stakeholderId: StakeholderId`
- `caseId: CaseRecordId | null`
- `caseTaskId: CaseTaskId | null`
- `scopeType: RequestForInformationScopeType`
- `requestText: string`
- `responseText: string`
- `status: RequestForInformationStatus`
- `requestedByUserId: UserAccountId`
- `assignedToUserId: UserAccountId | null`
- `respondedByUserId: UserAccountId | null`
- `requestedAt: string`
- `respondedAt: string | null`
- `statusHistory: Array<{ status: RequestForInformationStatus; at: string; byUserId: UserAccountId; note: string }>`

## ParticipantSupplier

- `authorityId: AuthorityId`
- `participantId: ParticipantId`
- `supplierName: string`
- `relationshipType: string`
- `criticality: ParticipantSupplierCriticality`
- `servicesProvided: string`
- `dataExposure: string`
- `status: ParticipantSupplierStatus`
