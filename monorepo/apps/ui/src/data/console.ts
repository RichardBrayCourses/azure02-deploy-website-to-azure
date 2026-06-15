import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Handshake,
  FileQuestion,
  FileSignature,
  FolderKanban,
  ImageUp,
  KeyRound,
  Landmark,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
  Users,
  Video,
} from "lucide-react";
import type { AccountContextType, AuthenticatedUser, UserRole } from "@/context/AuthContext";

export type EntityStatus = "ACTIVE" | "INACTIVE";
export type InviteStatus = EntityStatus | "INVITED";
export type UserKind = "SYSTEM_OWNER" | "AUTHORITY" | "PARTICIPANT" | "STAKEHOLDER";
export type MembershipRole = "ADMIN" | "MEMBER";
export type PartyType = "ORGANISATION" | "PERSON";
export type AccessStatus = "APPROVED" | "SUSPENDED" | "REVOKED";
export type AccessGrantStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "REVOKED" | "EXPIRED";
export type AccessGrantGranteeType = "STAKEHOLDER" | "HELPER" | "USER" | "AUTHORITY";
export type AccessGrantPermissionLevel =
  | "READ_ONLY"
  | "REQUEST_INFORMATION"
  | "REVIEW_AND_COMMENT"
  | "CREATE_AND_EDIT"
  | "ADMINISTER_GRANTS";
export type AccessGrantDataScopeType = "PARTICIPANT_WORKSPACE" | "CASE" | "CASE_TASK" | "EVIDENCE_METADATA" | "PARTICIPANT_SUPPLIER";
export type TaskTypeStatus = "ACTIVE" | "DEPRECATED";
export type CaseTemplateStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type TemplateParticipantStatus = "REQUIRED" | "EXEMPT";
export type CaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CLOSED";
export type CaseTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "PASSED" | "FAILED" | "WITHDRAWN";
export type StakeholderReviewStatus = "NOT_REVIEWED" | "IN_REVIEW" | "APPROVED" | "MORE_INFO_REQUESTED";
export type RequestForInformationStatus = "OPEN" | "IN_PROGRESS" | "ANSWERED" | "ACCEPTED" | "WITHDRAWN";
export type RequestForInformationScopeType = "PARTICIPANT" | "CASE" | "CASE_TASK" | "EVIDENCE_METADATA";
export type ParticipantSupplierCriticality = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ParticipantSupplierStatus = "ACTIVE" | "UNDER_REVIEW" | "SUSPENDED" | "EXITING";
export type UserAccountStatus = "ACTIVE" | "DISABLED";
export type Status = "complete" | "in-progress" | "attention" | "not-started" | "withdrawn";

export type SystemOwnerId = string;
export type AuthorityId = string;
export type ParticipantId = string;
export type StakeholderId = string;
export type UserAccountId = string;
export type TaskTypeId = string;
export type CaseTemplateId = string;
export type CaseTemplateTaskId = string;
export type CaseTemplateParticipantId = string;
export type CaseRecordId = string;
export type CaseTaskId = string;
export type StakeholderParticipantAccessId = string;
export type AccessGrantId = string;
export type StakeholderReviewId = string;
export type RequestForInformationId = string;
export type ParticipantSupplierId = string;

type JsonObject = Record<string, unknown>;

type BaseDto = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type SystemOwnerDto = BaseDto & {
  name: string;
  status: EntityStatus;
};

export type AuthorityDto = BaseDto & {
  systemOwnerId: SystemOwnerId;
  name: string;
  description: string;
  status: EntityStatus;
};

export type TerminologyKey =
  | "authority"
  | "participant"
  | "stakeholder"
  | "case"
  | "caseTemplate"
  | "caseTask"
  | "participantSupplier"
  | "evidence"
  | "accessGrant"
  | "requestForInformation";

export type TerminologyLabels = Record<TerminologyKey, { singular: string; plural: string }>;

export type AuthorityTerminologyDto = BaseDto & {
  authorityId: AuthorityId;
  labels: TerminologyLabels;
};

export type ParticipantDto = BaseDto & {
  authorityId: AuthorityId;
  participantType: PartyType;
  displayName: string;
  status: InviteStatus;
};

export type StakeholderDto = BaseDto & {
  authorityId: AuthorityId;
  stakeholderType: PartyType;
  displayName: string;
  status: InviteStatus;
};

export type UserAccountDto = BaseDto & {
  entraObjectId: string;
  email: string;
  displayName: string;
  userKind: UserKind;
  status: UserAccountStatus;
};

export type MembershipDto = BaseDto & {
  entityId: SystemOwnerId | AuthorityId | ParticipantId | StakeholderId;
  userAccountId: UserAccountId;
  role: MembershipRole;
};

export type StakeholderParticipantAccessDto = BaseDto & {
  stakeholderId: StakeholderId;
  participantId: ParticipantId;
  status: AccessStatus;
  approvedByUserId: UserAccountId;
  approvedAt: string;
};

export type AccessGrantDto = BaseDto & {
  authorityId: AuthorityId;
  participantId: ParticipantId;
  granteeType: AccessGrantGranteeType;
  granteeStakeholderId: StakeholderId | null;
  granteeUserId: UserAccountId | null;
  permissionLevel: AccessGrantPermissionLevel;
  dataScopeType: AccessGrantDataScopeType;
  dataScopeId: string | null;
  status: AccessGrantStatus;
  createdByUserId: UserAccountId;
  expiresAt: string | null;
};

export type TaskTypeDto = BaseDto & {
  code: string;
  name: string;
  description: string;
  parameterSchemaJson: JsonObject;
  status: TaskTypeStatus;
};

export type CaseTemplateDto = BaseDto & {
  authorityId: AuthorityId;
  name: string;
  description: string;
  status: CaseTemplateStatus;
  publishedAt: string | null;
  publishedByUserId: UserAccountId | null;
};

export type CaseTemplateTaskDto = BaseDto & {
  caseTemplateId: CaseTemplateId;
  taskTypeId: TaskTypeId;
  title: string;
  description: string;
  parametersJson: JsonObject;
  sortOrder: number;
  status: "ACTIVE" | "WITHDRAWN";
  createdAfterPublish: boolean;
  withdrawnReason: string | null;
  withdrawnAt: string | null;
  withdrawnByUserId: UserAccountId | null;
};

export type CaseTemplateParticipantDto = BaseDto & {
  caseTemplateId: CaseTemplateId;
  participantId: ParticipantId;
  status: TemplateParticipantStatus;
  caseId: CaseRecordId | null;
  exemptionReason: string | null;
  decidedByUserId: UserAccountId | null;
  decidedAt: string | null;
};

export type CaseDto = BaseDto & {
  authorityId: AuthorityId;
  caseTemplateId: CaseTemplateId;
  participantId: ParticipantId;
  participantSupplierId: ParticipantSupplierId | null;
  status: CaseStatus;
  submittedAt: string | null;
  closedAt: string | null;
};

export type CaseTaskDto = BaseDto & {
  caseId: CaseRecordId;
  caseTemplateTaskId: CaseTemplateTaskId;
  status: CaseTaskStatus;
  responseJson: JsonObject;
  evidenceJson: JsonObject;
  withdrawnAt: string | null;
};

export type StakeholderReviewDto = BaseDto & {
  stakeholderId: StakeholderId;
  caseId: CaseRecordId;
  status: StakeholderReviewStatus;
  note: string;
  reviewedByUserId: UserAccountId;
  reviewedAt: string;
};

export type RequestForInformationDto = BaseDto & {
  authorityId: AuthorityId;
  participantId: ParticipantId;
  stakeholderId: StakeholderId;
  caseId: CaseRecordId | null;
  caseTaskId: CaseTaskId | null;
  scopeType: RequestForInformationScopeType;
  requestText: string;
  responseText: string;
  status: RequestForInformationStatus;
  requestedByUserId: UserAccountId;
  assignedToUserId: UserAccountId | null;
  respondedByUserId: UserAccountId | null;
  requestedAt: string;
  respondedAt: string | null;
  statusHistory: Array<{ status: RequestForInformationStatus; at: string; byUserId: UserAccountId; note: string }>;
};

export type ParticipantSupplierDto = BaseDto & {
  authorityId: AuthorityId;
  participantId: ParticipantId;
  supplierName: string;
  relationshipType: string;
  criticality: ParticipantSupplierCriticality;
  servicesProvided: string;
  dataExposure: string;
  status: ParticipantSupplierStatus;
};

export type CreateParticipantCommand = {
  authorityId: AuthorityId;
  participantType: PartyType;
  displayName: string;
  status?: InviteStatus;
};

export type CreateStakeholderCommand = {
  authorityId: AuthorityId;
  stakeholderType: PartyType;
  displayName: string;
  status?: InviteStatus;
};

export type UpdateAuthorityTerminologyCommand = {
  authorityId: AuthorityId;
  labels: TerminologyLabels;
};

export type CreateEntityUserCommand = {
  displayName: string;
  email: string;
  role: MembershipRole;
};

export type GrantStakeholderAccessCommand = {
  stakeholderId: StakeholderId;
  participantId: ParticipantId;
  approvedByUserId: UserAccountId;
};

export type CreateAccessGrantCommand = {
  authorityId: AuthorityId;
  participantId: ParticipantId;
  granteeType: AccessGrantGranteeType;
  granteeStakeholderId?: StakeholderId | null;
  granteeUserId?: UserAccountId | null;
  permissionLevel: AccessGrantPermissionLevel;
  dataScopeType?: AccessGrantDataScopeType;
  dataScopeId?: string | null;
  status?: AccessGrantStatus;
  createdByUserId: UserAccountId;
  expiresAt?: string | null;
};

export type CreateCaseTemplateCommand = {
  authorityId: AuthorityId;
  name: string;
  description: string;
};

export type AddTaskToTemplateCommand = {
  caseTemplateId: CaseTemplateId;
  taskTypeId: TaskTypeId;
  title: string;
  description: string;
  parametersJson?: JsonObject;
};

export type AssignParticipantToTemplateCommand = {
  caseTemplateId: CaseTemplateId;
  participantId: ParticipantId;
  status: TemplateParticipantStatus;
  exemptionReason?: string | null;
  decidedByUserId?: UserAccountId | null;
};

export type CompleteTaskCommand = {
  caseTaskId: CaseTaskId;
  responseJson: JsonObject;
};

export type UploadEvidenceCommand = {
  caseTaskId: CaseTaskId;
  evidenceJson: JsonObject;
};

export type UpsertStakeholderReviewCommand = {
  stakeholderId: StakeholderId;
  caseId: CaseRecordId;
  status: StakeholderReviewStatus;
  note: string;
  reviewedByUserId: UserAccountId;
};

export type CreateRequestForInformationCommand = {
  stakeholderId: StakeholderId;
  caseId: CaseRecordId;
  caseTaskId?: CaseTaskId | null;
  requestText: string;
  requestedByUserId: UserAccountId;
};

export type RespondToRequestForInformationCommand = {
  requestId: RequestForInformationId;
  responseText: string;
  respondedByUserId: UserAccountId;
  status?: Extract<RequestForInformationStatus, "IN_PROGRESS" | "ANSWERED">;
};

export type UpdateRequestForInformationStatusCommand = {
  requestId: RequestForInformationId;
  status: Extract<RequestForInformationStatus, "ACCEPTED" | "WITHDRAWN">;
  updatedByUserId: UserAccountId;
  note?: string;
};

export type CreateParticipantSupplierCommand = {
  authorityId: AuthorityId;
  participantId: ParticipantId;
  supplierName: string;
  relationshipType: string;
  criticality: ParticipantSupplierCriticality;
  servicesProvided: string;
  dataExposure: string;
};

class DomainEntity<TDto extends BaseDto> {
  constructor(protected readonly dto: TDto) {}

  get id() {
    return this.dto.id;
  }

  toDto(): TDto {
    return { ...this.dto };
  }
}

export class SystemOwnerEntity extends DomainEntity<SystemOwnerDto> {}
export class AuthorityEntity extends DomainEntity<AuthorityDto> {}
export class AuthorityTerminologyEntity extends DomainEntity<AuthorityTerminologyDto> {}
export class ParticipantEntity extends DomainEntity<ParticipantDto> {}
export class StakeholderEntity extends DomainEntity<StakeholderDto> {}
export class UserAccountEntity extends DomainEntity<UserAccountDto> {}
export class SystemOwnerUserEntity extends DomainEntity<MembershipDto> {}
export class AuthorityUserEntity extends DomainEntity<MembershipDto> {}
export class ParticipantUserEntity extends DomainEntity<MembershipDto> {}
export class StakeholderUserEntity extends DomainEntity<MembershipDto> {}
export class StakeholderParticipantAccessEntity extends DomainEntity<StakeholderParticipantAccessDto> {}
export class AccessGrantEntity extends DomainEntity<AccessGrantDto> {}
export class TaskTypeEntity extends DomainEntity<TaskTypeDto> {}
export class CaseTemplateEntity extends DomainEntity<CaseTemplateDto> {}
export class CaseTemplateTaskEntity extends DomainEntity<CaseTemplateTaskDto> {}
export class CaseTemplateParticipantEntity extends DomainEntity<CaseTemplateParticipantDto> {}
export class CaseEntity extends DomainEntity<CaseDto> {}
export class CaseTaskEntity extends DomainEntity<CaseTaskDto> {}
export class StakeholderReviewEntity extends DomainEntity<StakeholderReviewDto> {}
export class RequestForInformationEntity extends DomainEntity<RequestForInformationDto> {}
export class ParticipantSupplierEntity extends DomainEntity<ParticipantSupplierDto> {}

export type AuthenticatableUserMembership =
  | { entityType: "authority"; entityId: AuthorityId }
  | { entityType: "participant"; entityId: ParticipantId }
  | { entityType: "stakeholder"; entityId: StakeholderId };

export type ConsoleApp = {
  id: "administration" | "case-management" | "stakeholder-portal" | "helper-workspace";
  name: string;
  shortName: string;
  description: string;
  path: string;
  accent: string;
  Icon: typeof Landmark;
  audience: UserRole[];
};

export type Authority = {
  id: AuthorityId;
  name: string;
  scenario: string;
  description: string;
  status: EntityStatus;
};

export type AuthorityTerminology = {
  authorityId: AuthorityId;
  labels: TerminologyLabels;
};

export type Participant = {
  id: ParticipantId;
  name: string;
  authorityId: AuthorityId;
  stakeholderId: StakeholderId;
  type: string;
  participantRole: string;
  status: Status;
  domainStatus: InviteStatus;
  openCases: number;
  completedTasks: number;
  totalTasks: number;
  lastActivity: string;
};

export type Stakeholder = {
  id: StakeholderId;
  authorityId: AuthorityId;
  name: string;
  type: string;
  status: InviteStatus;
  visibleParticipants: number;
};

export type AccessGrant = {
  id: AccessGrantId;
  authorityId: AuthorityId;
  participantId: ParticipantId;
  participantName: string;
  granteeType: AccessGrantGranteeType;
  granteeName: string;
  granteeStakeholderId: StakeholderId | null;
  permissionLevel: AccessGrantPermissionLevel;
  permissionLabel: string;
  dataScopeType: AccessGrantDataScopeType;
  dataScopeId: string | null;
  scopeLabel: string;
  status: AccessGrantStatus;
  createdByUserId: UserAccountId;
  createdByName: string;
  createdAt: string;
  expiresAt: string | null;
};

export type ParticipantSupplier = {
  id: ParticipantSupplierId;
  authorityId: AuthorityId;
  participantId: ParticipantId;
  participantName: string;
  supplierName: string;
  relationshipType: string;
  criticality: ParticipantSupplierCriticality;
  servicesProvided: string;
  dataExposure: string;
  status: ParticipantSupplierStatus;
  linkedCases: CaseRecord[];
};

export type HelperClientWorkspace = {
  participant: Participant;
  grant: AccessGrant;
  cases: CaseRecord[];
  participantSuppliers: ParticipantSupplier[];
  openRequests: number;
  canEdit: boolean;
  canAdministerGrants: boolean;
};

export type AuthenticatableUser = {
  id: UserAccountId;
  name: string;
  email: string;
  userKind: UserKind;
  membership: AuthenticatableUserMembership;
  membershipRole: MembershipRole;
};

export type UserIdentity = {
  id: UserAccountId;
  name: string;
  email: string;
  status: UserAccountStatus;
};

export type AccountContext = {
  id: string;
  authenticatableUserId: UserAccountId;
  name: string;
  email: string;
  authorityId: AuthorityId;
  authorityName: string;
  role: UserRole;
  entityType: AccountContextType;
  entityId: AuthorityId | ParticipantId | StakeholderId;
  entityName: string;
  membershipRole: MembershipRole;
  participantId: ParticipantId | null;
  stakeholderId: StakeholderId | null;
  description: string;
};

export type Task = {
  id: CaseTaskId;
  title: string;
  type: string;
  status: Status;
  domainStatus: CaseTaskStatus;
  due: string;
  description: string;
  responseText: string;
  evidenceFiles: Array<{ name: string; size: string; uploadedAt: string }>;
  updatedAt: string;
  Icon: typeof ImageUp;
};

export type CaseRecord = {
  id: CaseRecordId;
  title: string;
  participantId: ParticipantId;
  authorityId: AuthorityId;
  caseTemplateId: CaseTemplateId;
  participantSupplierId: ParticipantSupplierId | null;
  participantSupplierName: string | null;
  reference: string;
  caseType: string;
  status: "open" | "closed" | "review";
  domainStatus: CaseStatus;
  completedTasks: number;
  totalTasks: number;
  risk: "low" | "medium" | "high";
  outcome: string;
  lastActivity: string;
  tasks: Task[];
};

export type StakeholderReview = {
  id: StakeholderReviewId;
  stakeholderId: StakeholderId;
  caseId: CaseRecordId;
  status: StakeholderReviewStatus;
  statusLabel: string;
  note: string;
  reviewedByName: string;
  reviewedAt: string;
};

export type RequestForInformation = {
  id: RequestForInformationId;
  authorityId: AuthorityId;
  participantId: ParticipantId;
  participantName: string;
  stakeholderId: StakeholderId;
  stakeholderName: string;
  caseId: CaseRecordId | null;
  caseTitle: string;
  caseTaskId: CaseTaskId | null;
  taskTitle: string | null;
  scopeType: RequestForInformationScopeType;
  scopeLabel: string;
  requestText: string;
  responseText: string;
  status: RequestForInformationStatus;
  statusLabel: string;
  requestedByName: string;
  assignedToName: string | null;
  respondedByName: string | null;
  requestedAt: string;
  respondedAt: string | null;
};

export type CaseTemplate = {
  id: CaseTemplateId;
  authorityId: AuthorityId;
  name: string;
  description: string;
  status: CaseTemplateStatus;
  taskCount: number;
  participantCount: number;
  publishedAt: string | null;
};

export type TaskType = {
  id: TaskTypeId;
  code: string;
  name: string;
  description: string;
  status: TaskTypeStatus;
};

export type CaseTemplateTask = {
  id: CaseTemplateTaskId;
  caseTemplateId: CaseTemplateId;
  taskTypeId: TaskTypeId;
  taskTypeName: string;
  title: string;
  description: string;
  due: string;
  sortOrder: number;
  status: "ACTIVE" | "WITHDRAWN";
  createdAfterPublish: boolean;
  withdrawnReason: string | null;
  withdrawnAt: string | null;
  withdrawnByUserId: UserAccountId | null;
};

export type CaseTemplateParticipant = {
  id: CaseTemplateParticipantId;
  caseTemplateId: CaseTemplateId;
  participantId: ParticipantId;
  participantName: string;
  participantType: string;
  status: TemplateParticipantStatus;
  caseId: CaseRecordId | null;
  exemptionReason: string | null;
};

export type SearchItem = {
  title: string;
  description: string;
  path: string;
  group: string;
  audience: UserRole[];
};

const now = "2026-06-15T09:00:00.000Z";
const created = "2026-01-03T09:00:00.000Z";
const authorityTerminologyStorageKey = "authorityTerminology";

export const defaultTerminologyLabels: TerminologyLabels = {
  authority: { singular: "authority", plural: "authorities" },
  participant: { singular: "participant", plural: "participants" },
  stakeholder: { singular: "stakeholder", plural: "stakeholders" },
  case: { singular: "case", plural: "cases" },
  caseTemplate: { singular: "case template", plural: "case templates" },
  caseTask: { singular: "case task", plural: "case tasks" },
  participantSupplier: { singular: "participant supplier", plural: "participant suppliers" },
  evidence: { singular: "evidence", plural: "evidence" },
  accessGrant: { singular: "access grant", plural: "access grants" },
  requestForInformation: { singular: "request for information", plural: "requests for information" },
};

function base(id: string): BaseDto {
  return { id, createdAt: created, updatedAt: now };
}

function mergeTerminologyLabels(labels: Partial<TerminologyLabels>): TerminologyLabels {
  return Object.fromEntries(
    Object.entries(defaultTerminologyLabels).map(([key, value]) => {
      const candidate = labels[key as TerminologyKey];
      return [
        key,
        {
          singular: candidate?.singular?.trim() || value.singular,
          plural: candidate?.plural?.trim() || value.plural,
        },
      ];
    }),
  ) as TerminologyLabels;
}

function isTerminologyLabels(value: unknown): value is Partial<TerminologyLabels> {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return Object.keys(defaultTerminologyLabels).some((key) => {
    const label = candidate[key];
    if (!label || typeof label !== "object") return false;
    const typedLabel = label as Record<string, unknown>;
    return typeof typedLabel.singular === "string" || typeof typedLabel.plural === "string";
  });
}

function getStoredAuthorityTerminology() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(authorityTerminologyStorageKey);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return [];

    return Object.entries(parsed as Record<string, unknown>)
      .filter((entry): entry is [AuthorityId, Partial<TerminologyLabels>] => {
        const [authorityId, labels] = entry;
        return authorityId.trim().length > 0 && isTerminologyLabels(labels);
      })
      .map(([authorityId, labels]) => ({
        authorityId,
        labels: mergeTerminologyLabels(labels),
      }));
  } catch {
    return [];
  }
}

function saveAuthorityTerminologyToStorage(authorityTerminology: AuthorityTerminologyDto[]) {
  if (typeof window === "undefined") return;

  const stored = Object.fromEntries(
    authorityTerminology.map((terminology) => [
      terminology.authorityId,
      mergeTerminologyLabels(terminology.labels),
    ]),
  );
  window.localStorage.setItem(authorityTerminologyStorageKey, JSON.stringify(stored));
}

const iconByTaskCode: Record<string, typeof ImageUp> = {
  UPLOAD_DOCUMENT: ImageUp,
  CERTIFICATION_EVIDENCE: ShieldCheck,
  QUESTIONNAIRE: FileQuestion,
  POLICY_DOCUMENT: FileSignature,
  CONTROL_ATTESTATION: BadgeCheck,
  SUPPLIER_REGISTER: Users,
  PARTICIPANT_SUPPLIER_CASE: Building2,
  RISK_REGISTER: ClipboardCheck,
  DIGITAL_SIGNATURE: FileSignature,
  AI_USAGE_DISCLOSURE: Video,
  PAYMENT_CONFIRMATION: ReceiptText,
  ACCESS_CONTROL_MFA: KeyRound,
  HOSTING_RESIDENCY: Building2,
};

function uiTaskStatus(status: CaseTaskStatus): Status {
  if (status === "PASSED" || status === "SUBMITTED") return "complete";
  if (status === "FAILED") return "attention";
  if (status === "IN_PROGRESS") return "in-progress";
  if (status === "WITHDRAWN") return "withdrawn";
  return "not-started";
}

function uiCaseStatus(status: CaseStatus): CaseRecord["status"] {
  if (status === "CLOSED" || status === "APPROVED") return "closed";
  if (status === "SUBMITTED" || status === "REJECTED") return "review";
  return "open";
}

function uiParticipantStatus(casesForParticipant: CaseRecord[]): Status {
  if (casesForParticipant.some((caseRecord) => caseRecord.tasks.some((task) => task.status === "attention"))) {
    return "attention";
  }
  if (casesForParticipant.length > 0 && casesForParticipant.every((caseRecord) => caseRecord.status === "closed")) {
    return "complete";
  }
  if (casesForParticipant.some((caseRecord) => caseRecord.status === "open" || caseRecord.status === "review")) {
    return "in-progress";
  }
  return "not-started";
}

export class InMemoryAllChecksOutDatabase {
  readonly systemOwners = [
    new SystemOwnerEntity({ ...base("all-checks-out"), name: "All Checks Out Ltd", status: "ACTIVE" }),
  ];

  readonly authorities = [
    new AuthorityEntity({
      ...base("northstar-association"),
      systemOwnerId: "all-checks-out",
      name: "Digital Platform Assurance Association",
      description: "An authority defining case expectations for member participants.",
      status: "ACTIVE",
    }),
  ];

  readonly authorityTerminology = [
    new AuthorityTerminologyEntity({
      ...base("terminology-northstar-association"),
      authorityId: "northstar-association",
      labels: defaultTerminologyLabels,
    }),
  ];

  readonly participants = [
    new ParticipantEntity({
      ...base("northstar-cloud"),
      authorityId: "northstar-association",
      participantType: "ORGANISATION",
      displayName: "Northstar Cloud Platforms",
      status: "ACTIVE",
    }),
    new ParticipantEntity({
      ...base("cobalt-workflow"),
      authorityId: "northstar-association",
      participantType: "ORGANISATION",
      displayName: "Cobalt Workflow Systems",
      status: "ACTIVE",
    }),
    new ParticipantEntity({
      ...base("pinebridge-data"),
      authorityId: "northstar-association",
      participantType: "ORGANISATION",
      displayName: "Pinebridge Data Exchange",
      status: "ACTIVE",
    }),
    new ParticipantEntity({
      ...base("asteria-identity"),
      authorityId: "northstar-association",
      participantType: "ORGANISATION",
      displayName: "Asteria Identity Services",
      status: "ACTIVE",
    }),
  ];

  readonly stakeholders = [
    new StakeholderEntity({
      ...base("harrington-financial"),
      authorityId: "northstar-association",
      stakeholderType: "ORGANISATION",
      displayName: "Harrington Financial Group",
      status: "ACTIVE",
    }),
    new StakeholderEntity({
      ...base("mercury-retail"),
      authorityId: "northstar-association",
      stakeholderType: "ORGANISATION",
      displayName: "Mercury Retail PLC",
      status: "ACTIVE",
    }),
    new StakeholderEntity({
      ...base("sentinel-grc"),
      authorityId: "northstar-association",
      stakeholderType: "ORGANISATION",
      displayName: "Sentinel GRC Advisory",
      status: "ACTIVE",
    }),
  ];

  readonly userAccounts = [
    this.user("user-jonathan-price", "Jonathan Price", "jonathan.price@dpaa.example", "AUTHORITY"),
    this.user("user-amara-singh", "Amara Singh", "amara.singh@dpaa.example", "AUTHORITY"),
    this.user("user-aisha-khan", "Aisha Khan", "aisha.khan@northstar-cloud.example", "PARTICIPANT"),
    this.user("user-michael-reeves", "Michael Reeves", "michael.reeves@northstar-cloud.example", "PARTICIPANT"),
    this.user("user-lewis-green", "Lewis Green", "lewis.green@cobalt-workflow.example", "PARTICIPANT"),
    this.user("user-amelia-wright", "Amelia Wright", "amelia.wright@cobalt-workflow.example", "PARTICIPANT"),
    this.user("user-maya-patel", "Maya Patel", "maya.patel@pinebridge-data.example", "PARTICIPANT"),
    this.user("user-owen-clarke", "Owen Clarke", "owen.clarke@asteria-identity.example", "PARTICIPANT"),
    this.user("user-rachel-morgan", "Rachel Morgan", "rachel.morgan@harrington.example", "STAKEHOLDER"),
    this.user("user-peter-walsh", "Peter Walsh", "peter.walsh@harrington.example", "STAKEHOLDER"),
    this.user("user-sophie-turner", "Sophie Turner", "sophie.turner@mercury-retail.example", "STAKEHOLDER"),
    this.user("user-benjamin-foster", "Benjamin Foster", "benjamin.foster@mercury-retail.example", "STAKEHOLDER"),
    this.user("user-priya-shah", "Priya Shah", "priya.shah@sentinel-grc.example", "STAKEHOLDER"),
    this.user("user-george-evans", "George Evans", "george.evans@sentinel-grc.example", "STAKEHOLDER"),
    this.user("user-nadia-cole", "Nadia Cole", "nadia.cole@portfolio.example", "PARTICIPANT"),
  ];

  readonly authorityUsers = [
    this.membership("authority-user-jonathan-price", "northstar-association", "user-jonathan-price", "ADMIN", AuthorityUserEntity),
    this.membership("authority-user-amara-singh", "northstar-association", "user-amara-singh", "MEMBER", AuthorityUserEntity),
  ];

  readonly participantUsers = [
    this.membership("participant-user-aisha-khan", "northstar-cloud", "user-aisha-khan", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-michael-reeves", "northstar-cloud", "user-michael-reeves", "MEMBER", ParticipantUserEntity),
    this.membership("participant-user-lewis-green", "cobalt-workflow", "user-lewis-green", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-amelia-wright", "cobalt-workflow", "user-amelia-wright", "MEMBER", ParticipantUserEntity),
    this.membership("participant-user-nadia-cole", "cobalt-workflow", "user-nadia-cole", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-maya-patel", "pinebridge-data", "user-maya-patel", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-owen-clarke", "asteria-identity", "user-owen-clarke", "ADMIN", ParticipantUserEntity),
  ];

  readonly stakeholderUsers = [
    this.membership("stakeholder-user-rachel-morgan", "harrington-financial", "user-rachel-morgan", "ADMIN", StakeholderUserEntity),
    this.membership("stakeholder-user-peter-walsh", "harrington-financial", "user-peter-walsh", "MEMBER", StakeholderUserEntity),
    this.membership("stakeholder-user-sophie-turner", "mercury-retail", "user-sophie-turner", "ADMIN", StakeholderUserEntity),
    this.membership("stakeholder-user-benjamin-foster", "mercury-retail", "user-benjamin-foster", "MEMBER", StakeholderUserEntity),
    this.membership("stakeholder-user-priya-shah", "sentinel-grc", "user-priya-shah", "ADMIN", StakeholderUserEntity),
    this.membership("stakeholder-user-george-evans", "sentinel-grc", "user-george-evans", "MEMBER", StakeholderUserEntity),
    this.membership("stakeholder-user-nadia-cole", "sentinel-grc", "user-nadia-cole", "MEMBER", StakeholderUserEntity),
  ];

  readonly stakeholderParticipantAccess = [
    this.access("access-harrington-northstar", "harrington-financial", "northstar-cloud", "user-aisha-khan"),
    this.access("access-harrington-cobalt", "harrington-financial", "cobalt-workflow", "user-lewis-green"),
    this.access("access-mercury-cobalt", "mercury-retail", "cobalt-workflow", "user-lewis-green"),
    this.access("access-mercury-pinebridge", "mercury-retail", "pinebridge-data", "user-maya-patel"),
    this.access("access-sentinel-northstar", "sentinel-grc", "northstar-cloud", "user-aisha-khan"),
    this.access("access-sentinel-asteria", "sentinel-grc", "asteria-identity", "user-owen-clarke"),
  ];

  readonly accessGrants = [
    this.accessGrant("grant-harrington-northstar", "northstar-cloud", "STAKEHOLDER", "harrington-financial", "REQUEST_INFORMATION", "ACTIVE", "user-aisha-khan"),
    this.accessGrant("grant-harrington-cobalt", "cobalt-workflow", "STAKEHOLDER", "harrington-financial", "REVIEW_AND_COMMENT", "ACTIVE", "user-lewis-green"),
    this.accessGrant("grant-mercury-cobalt", "cobalt-workflow", "STAKEHOLDER", "mercury-retail", "REQUEST_INFORMATION", "ACTIVE", "user-lewis-green"),
    this.accessGrant("grant-mercury-pinebridge", "pinebridge-data", "STAKEHOLDER", "mercury-retail", "REVIEW_AND_COMMENT", "ACTIVE", "user-maya-patel"),
    this.accessGrant("grant-mercury-northstar-stratuspay", "northstar-cloud", "STAKEHOLDER", "mercury-retail", "REQUEST_INFORMATION", "ACTIVE", "user-aisha-khan", "PARTICIPANT_SUPPLIER", "participant-supplier-northstar-stratuspay"),
    this.accessGrant("grant-sentinel-northstar", "northstar-cloud", "HELPER", "sentinel-grc", "CREATE_AND_EDIT", "ACTIVE", "user-aisha-khan"),
    this.accessGrant("grant-sentinel-asteria", "asteria-identity", "HELPER", "sentinel-grc", "REVIEW_AND_COMMENT", "ACTIVE", "user-owen-clarke"),
  ];

  readonly participantSuppliers = [
    this.participantSupplier(
      "participant-supplier-northstar-stratuspay",
      "northstar-cloud",
      "StratusPay Processing",
      "Payment processing subprocessor",
      "CRITICAL",
      "Hosted payment processing, payment tokenisation, and transaction monitoring for regulated customers.",
      "Processes production customer identifiers and payment tokens in UK and EU regions.",
      "UNDER_REVIEW",
    ),
    this.participantSupplier(
      "participant-supplier-northstar-observiq",
      "northstar-cloud",
      "ObservIQ Telemetry",
      "Monitoring and observability provider",
      "HIGH",
      "Infrastructure monitoring, alerting, log aggregation, and incident diagnostics.",
      "Receives service telemetry and limited diagnostic logs with customer tenant references.",
      "ACTIVE",
    ),
    this.participantSupplier(
      "participant-supplier-cobalt-docuhold",
      "cobalt-workflow",
      "DocuHold Archive Services",
      "Document retention provider",
      "HIGH",
      "Long-term document retention and secure archive export for workflow records.",
      "Stores encrypted customer documents and retention metadata.",
      "ACTIVE",
    ),
    this.participantSupplier(
      "participant-supplier-pinebridge-eu-host",
      "pinebridge-data",
      "Azure EU Hosting Operations",
      "Cloud hosting provider",
      "CRITICAL",
      "Primary database hosting, backup replication, key management integration, and platform telemetry.",
      "Hosts production customer data and encrypted backups in EU regions.",
      "UNDER_REVIEW",
    ),
  ];

  readonly taskTypes = [
    this.taskType("task-type-policy-document", "POLICY_DOCUMENT", "Policy document upload", "Upload a controlled policy, plan, or governance document."),
    this.taskType("task-type-certification", "CERTIFICATION_EVIDENCE", "Certification evidence", "Upload ISO 27001, SOC 2, Cyber Essentials, or equivalent assurance evidence."),
    this.taskType("task-type-questionnaire", "QUESTIONNAIRE", "Questionnaire", "Answer structured case questions."),
    this.taskType("task-type-control-attestation", "CONTROL_ATTESTATION", "Control attestation", "Confirm that a required control exists and is operating."),
    this.taskType("task-type-supplier-register", "SUPPLIER_REGISTER", "Supplier register", "List subprocessors, hosting providers, support tools, and critical suppliers."),
    this.taskType("task-type-participant-ddq", "PARTICIPANT_SUPPLIER_CASE", "Participant supplier case", "Record case on a critical supplier or participant supplier."),
    this.taskType("task-type-risk-register", "RISK_REGISTER", "Risk and remediation register", "Record issues, owners, mitigation dates, and residual risk."),
    this.taskType("task-type-upload-document", "UPLOAD_DOCUMENT", "Evidence metadata upload", "Record uploaded evidence metadata in this frontend phase."),
    this.taskType("task-type-signature", "DIGITAL_SIGNATURE", "Digital signature", "Capture a senior officer attestation."),
    this.taskType("task-type-ai-disclosure", "AI_USAGE_DISCLOSURE", "AI usage disclosure", "Declare whether AI services process customer data and how they are controlled."),
    this.taskType("task-type-access-control", "ACCESS_CONTROL_MFA", "Access control and MFA", "Confirm MFA, privileged access, and joiner/mover/leaver controls."),
    this.taskType("task-type-hosting-residency", "HOSTING_RESIDENCY", "Hosting and data residency", "Document hosting provider, regions, backup locations, and customer-data residency."),
  ];

  readonly caseTemplates = [
    this.caseTemplate("template-annual-platform-ddq", "northstar-association", "Annual Platform Participant Case 2026", "Case", "PUBLISHED", "user-jonathan-price"),
    this.caseTemplate("template-critical-supplier-ddq", "northstar-association", "Critical Supplier Case", "Participant supplier case", "PUBLISHED", "user-jonathan-price"),
  ];

  readonly caseTemplateTasks = [
    this.templateTask("template-task-company-profile", "template-annual-platform-ddq", "task-type-questionnaire", "Company profile and platform summary", "Confirm company details, platform summary, core services, and regulated customer sectors.", 1, { due: "18 Jun 2026" }),
    this.templateTask("template-task-security-policy", "template-annual-platform-ddq", "task-type-policy-document", "Information security policy", "Upload the current information security policy and confirm senior management approval date.", 2, { due: "19 Jun 2026" }),
    this.templateTask("template-task-certification", "template-annual-platform-ddq", "task-type-certification", "ISO 27001 or SOC 2 evidence", "Upload current ISO 27001 certificate, SOC 2 Type II report, Cyber Essentials certificate, or equivalent controls evidence.", 3, { due: "20 Jun 2026" }),
    this.templateTask("template-task-penetration-test", "template-annual-platform-ddq", "task-type-upload-document", "Penetration test summary", "Provide latest penetration test executive summary, provider name, test date, and remediation status.", 4, { due: "21 Jun 2026" }),
    this.templateTask("template-task-vulnerability-management", "template-annual-platform-ddq", "task-type-questionnaire", "Vulnerability management process", "Describe scanning cadence, severity thresholds, patching SLAs, and exception governance.", 5, { due: "21 Jun 2026" }),
    this.templateTask("template-task-access-control", "template-annual-platform-ddq", "task-type-access-control", "Access control and MFA attestation", "Confirm MFA enforcement, privileged access controls, joiner/mover/leaver process, and access review cadence.", 6, { due: "22 Jun 2026" }),
    this.templateTask("template-task-data-protection", "template-annual-platform-ddq", "task-type-questionnaire", "Data protection registration", "Provide ICO or equivalent data protection registration details and data protection officer contact.", 7, { due: "23 Jun 2026" }),
    this.templateTask("template-task-dpa", "template-annual-platform-ddq", "task-type-policy-document", "GDPR data processing agreement", "Upload standard DPA and describe controller/processor responsibilities for customer data.", 8, { due: "23 Jun 2026" }),
    this.templateTask("template-task-subprocessor-register", "template-annual-platform-ddq", "task-type-supplier-register", "Subprocessor register", "List subprocessors, hosting providers, support tools, analytics services, and monitoring providers.", 9, { due: "24 Jun 2026" }),
    this.templateTask("template-task-hosting-residency", "template-annual-platform-ddq", "task-type-hosting-residency", "Hosting and data residency statement", "State hosting provider, primary regions, backup regions, and whether customer data leaves the UK or EU.", 10, { due: "24 Jun 2026" }),
    this.templateTask("template-task-backup-restore", "template-annual-platform-ddq", "task-type-upload-document", "Backup and restore evidence", "Describe backup frequency, retention, encryption, and upload most recent restore-test evidence.", 11, { due: "25 Jun 2026" }),
    this.templateTask("template-task-bcp-dr", "template-annual-platform-ddq", "task-type-policy-document", "Business continuity and disaster recovery plan", "Upload BCP or disaster recovery plan and confirm last test date.", 12, { due: "25 Jun 2026" }),
    this.templateTask("template-task-incident-response", "template-annual-platform-ddq", "task-type-policy-document", "Incident response plan", "Upload incident response plan and describe breach notification procedure.", 13, { due: "26 Jun 2026" }),
    this.templateTask("template-task-cyber-insurance", "template-annual-platform-ddq", "task-type-certification", "Cyber insurance evidence", "Upload cyber insurance certificate and coverage summary.", 14, { due: "26 Jun 2026" }),
    this.templateTask("template-task-secure-development", "template-annual-platform-ddq", "task-type-questionnaire", "Secure development lifecycle questionnaire", "Describe secure coding, code review, dependency scanning, release controls, and segregation of duties.", 15, { due: "27 Jun 2026" }),
    this.templateTask("template-task-ai-disclosure", "template-annual-platform-ddq", "task-type-ai-disclosure", "AI usage and customer-data disclosure", "Declare whether AI services process customer data, which providers are used, and what controls apply.", 16, { due: "27 Jun 2026" }),
    this.templateTask("template-task-critical-supplier", "template-annual-platform-ddq", "task-type-participant-ddq", "Critical supplier and participant supplier Case", "Identify critical suppliers and complete case for material third-party dependencies.", 17, { due: "28 Jun 2026" }),
    this.templateTask("template-task-senior-attestation", "template-annual-platform-ddq", "task-type-signature", "Senior officer attestation and signature", "A senior officer confirms the submitted information is accurate and complete.", 18, { due: "30 Jun 2026" }),
    this.templateTask("template-task-supplier-profile", "template-critical-supplier-ddq", "task-type-questionnaire", "Supplier profile", "Record the supplier relationship, criticality, services provided, and customer-data exposure.", 1, { due: "No due date" }),
    this.templateTask("template-task-supplier-controls", "template-critical-supplier-ddq", "task-type-control-attestation", "Supplier control attestation", "Confirm key security and resilience controls for the critical supplier.", 2, { due: "No due date" }),
    this.templateTask("template-task-supplier-risk", "template-critical-supplier-ddq", "task-type-risk-register", "Supplier risk and remediation", "Record known supplier risks, mitigation owners, and target remediation dates.", 3, { due: "No due date" }),
  ];

  readonly cases = [
    this.caseRecord("case-2026-northstar", "northstar-association", "template-annual-platform-ddq", "northstar-cloud", null, "SUBMITTED", "2026-06-12T15:30:00.000Z", null),
    this.caseRecord("case-2026-cobalt", "northstar-association", "template-annual-platform-ddq", "cobalt-workflow", null, "IN_PROGRESS", null, null),
    this.caseRecord("case-2026-pinebridge", "northstar-association", "template-annual-platform-ddq", "pinebridge-data", null, "REJECTED", "2026-06-10T12:00:00.000Z", null),
    this.caseRecord("case-2026-asteria", "northstar-association", "template-annual-platform-ddq", "asteria-identity", null, "APPROVED", "2026-06-05T11:15:00.000Z", "2026-06-14T09:30:00.000Z"),
    this.caseRecord("case-supplier-northstar-stratuspay", "northstar-association", "template-critical-supplier-ddq", "northstar-cloud", "participant-supplier-northstar-stratuspay", "IN_PROGRESS", null, null),
  ];

  readonly caseTemplateParticipants = [
    this.templateParticipant("template-participant-northstar", "template-annual-platform-ddq", "northstar-cloud", "case-2026-northstar"),
    this.templateParticipant("template-participant-cobalt", "template-annual-platform-ddq", "cobalt-workflow", "case-2026-cobalt"),
    this.templateParticipant("template-participant-pinebridge", "template-annual-platform-ddq", "pinebridge-data", "case-2026-pinebridge"),
    this.templateParticipant("template-participant-asteria", "template-annual-platform-ddq", "asteria-identity", "case-2026-asteria"),
    this.templateParticipant("template-participant-northstar-stratuspay", "template-critical-supplier-ddq", "northstar-cloud", "case-supplier-northstar-stratuspay"),
  ];

  readonly caseTasks = [
    this.caseTask("case-task-northstar-profile", "case-2026-northstar", "template-task-company-profile", "PASSED"),
    this.caseTask("case-task-northstar-security-policy", "case-2026-northstar", "template-task-security-policy", "PASSED"),
    this.caseTask("case-task-northstar-certification", "case-2026-northstar", "template-task-certification", "PASSED"),
    this.caseTask("case-task-northstar-penetration-test", "case-2026-northstar", "template-task-penetration-test", "SUBMITTED"),
    this.caseTask("case-task-northstar-vulnerability", "case-2026-northstar", "template-task-vulnerability-management", "SUBMITTED"),
    this.caseTask("case-task-northstar-access-control", "case-2026-northstar", "template-task-access-control", "PASSED"),
    this.caseTask("case-task-northstar-data-protection", "case-2026-northstar", "template-task-data-protection", "PASSED"),
    this.caseTask("case-task-northstar-dpa", "case-2026-northstar", "template-task-dpa", "PASSED"),
    this.caseTask("case-task-northstar-subprocessors", "case-2026-northstar", "template-task-subprocessor-register", "SUBMITTED"),
    this.caseTask("case-task-northstar-hosting", "case-2026-northstar", "template-task-hosting-residency", "PASSED"),
    this.caseTask("case-task-northstar-backup", "case-2026-northstar", "template-task-backup-restore", "SUBMITTED"),
    this.caseTask("case-task-northstar-bcp", "case-2026-northstar", "template-task-bcp-dr", "PASSED"),
    this.caseTask("case-task-northstar-incident", "case-2026-northstar", "template-task-incident-response", "PASSED"),
    this.caseTask("case-task-northstar-insurance", "case-2026-northstar", "template-task-cyber-insurance", "PASSED"),
    this.caseTask("case-task-northstar-sdlc", "case-2026-northstar", "template-task-secure-development", "SUBMITTED"),
    this.caseTask("case-task-northstar-ai", "case-2026-northstar", "template-task-ai-disclosure", "PASSED"),
    this.caseTask("case-task-northstar-critical-supplier", "case-2026-northstar", "template-task-critical-supplier", "IN_PROGRESS"),
    this.caseTask("case-task-northstar-attestation", "case-2026-northstar", "template-task-senior-attestation", "SUBMITTED"),
    this.caseTask("case-task-cobalt-profile", "case-2026-cobalt", "template-task-company-profile", "PASSED"),
    this.caseTask("case-task-cobalt-security-policy", "case-2026-cobalt", "template-task-security-policy", "PASSED"),
    this.caseTask("case-task-cobalt-certification", "case-2026-cobalt", "template-task-certification", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-penetration-test", "case-2026-cobalt", "template-task-penetration-test", "NOT_STARTED"),
    this.caseTask("case-task-cobalt-vulnerability", "case-2026-cobalt", "template-task-vulnerability-management", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-access-control", "case-2026-cobalt", "template-task-access-control", "PASSED"),
    this.caseTask("case-task-cobalt-data-protection", "case-2026-cobalt", "template-task-data-protection", "PASSED"),
    this.caseTask("case-task-cobalt-dpa", "case-2026-cobalt", "template-task-dpa", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-subprocessors", "case-2026-cobalt", "template-task-subprocessor-register", "NOT_STARTED"),
    this.caseTask("case-task-cobalt-hosting", "case-2026-cobalt", "template-task-hosting-residency", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-backup", "case-2026-cobalt", "template-task-backup-restore", "NOT_STARTED"),
    this.caseTask("case-task-cobalt-bcp", "case-2026-cobalt", "template-task-bcp-dr", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-incident", "case-2026-cobalt", "template-task-incident-response", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-insurance", "case-2026-cobalt", "template-task-cyber-insurance", "NOT_STARTED"),
    this.caseTask("case-task-cobalt-sdlc", "case-2026-cobalt", "template-task-secure-development", "IN_PROGRESS"),
    this.caseTask("case-task-cobalt-ai", "case-2026-cobalt", "template-task-ai-disclosure", "NOT_STARTED"),
    this.caseTask("case-task-cobalt-critical-supplier", "case-2026-cobalt", "template-task-critical-supplier", "NOT_STARTED"),
    this.caseTask("case-task-cobalt-attestation", "case-2026-cobalt", "template-task-senior-attestation", "NOT_STARTED"),
    this.caseTask("case-task-pinebridge-profile", "case-2026-pinebridge", "template-task-company-profile", "PASSED"),
    this.caseTask("case-task-pinebridge-security-policy", "case-2026-pinebridge", "template-task-security-policy", "PASSED"),
    this.caseTask("case-task-pinebridge-certification", "case-2026-pinebridge", "template-task-certification", "FAILED"),
    this.caseTask("case-task-pinebridge-penetration-test", "case-2026-pinebridge", "template-task-penetration-test", "FAILED"),
    this.caseTask("case-task-pinebridge-vulnerability", "case-2026-pinebridge", "template-task-vulnerability-management", "SUBMITTED"),
    this.caseTask("case-task-pinebridge-access-control", "case-2026-pinebridge", "template-task-access-control", "PASSED"),
    this.caseTask("case-task-pinebridge-data-protection", "case-2026-pinebridge", "template-task-data-protection", "PASSED"),
    this.caseTask("case-task-pinebridge-dpa", "case-2026-pinebridge", "template-task-dpa", "PASSED"),
    this.caseTask("case-task-pinebridge-subprocessors", "case-2026-pinebridge", "template-task-subprocessor-register", "SUBMITTED"),
    this.caseTask("case-task-pinebridge-hosting", "case-2026-pinebridge", "template-task-hosting-residency", "SUBMITTED"),
    this.caseTask("case-task-pinebridge-backup", "case-2026-pinebridge", "template-task-backup-restore", "FAILED"),
    this.caseTask("case-task-pinebridge-bcp", "case-2026-pinebridge", "template-task-bcp-dr", "SUBMITTED"),
    this.caseTask("case-task-pinebridge-incident", "case-2026-pinebridge", "template-task-incident-response", "PASSED"),
    this.caseTask("case-task-pinebridge-insurance", "case-2026-pinebridge", "template-task-cyber-insurance", "PASSED"),
    this.caseTask("case-task-pinebridge-sdlc", "case-2026-pinebridge", "template-task-secure-development", "SUBMITTED"),
    this.caseTask("case-task-pinebridge-ai", "case-2026-pinebridge", "template-task-ai-disclosure", "SUBMITTED"),
    this.caseTask("case-task-pinebridge-critical-supplier", "case-2026-pinebridge", "template-task-critical-supplier", "FAILED"),
    this.caseTask("case-task-pinebridge-attestation", "case-2026-pinebridge", "template-task-senior-attestation", "SUBMITTED"),
    this.caseTask("case-task-asteria-profile", "case-2026-asteria", "template-task-company-profile", "PASSED"),
    this.caseTask("case-task-asteria-security-policy", "case-2026-asteria", "template-task-security-policy", "PASSED"),
    this.caseTask("case-task-asteria-certification", "case-2026-asteria", "template-task-certification", "PASSED"),
    this.caseTask("case-task-asteria-penetration-test", "case-2026-asteria", "template-task-penetration-test", "PASSED"),
    this.caseTask("case-task-asteria-vulnerability", "case-2026-asteria", "template-task-vulnerability-management", "PASSED"),
    this.caseTask("case-task-asteria-access-control", "case-2026-asteria", "template-task-access-control", "PASSED"),
    this.caseTask("case-task-asteria-data-protection", "case-2026-asteria", "template-task-data-protection", "PASSED"),
    this.caseTask("case-task-asteria-dpa", "case-2026-asteria", "template-task-dpa", "PASSED"),
    this.caseTask("case-task-asteria-subprocessors", "case-2026-asteria", "template-task-subprocessor-register", "PASSED"),
    this.caseTask("case-task-asteria-hosting", "case-2026-asteria", "template-task-hosting-residency", "PASSED"),
    this.caseTask("case-task-asteria-backup", "case-2026-asteria", "template-task-backup-restore", "PASSED"),
    this.caseTask("case-task-asteria-bcp", "case-2026-asteria", "template-task-bcp-dr", "PASSED"),
    this.caseTask("case-task-asteria-incident", "case-2026-asteria", "template-task-incident-response", "PASSED"),
    this.caseTask("case-task-asteria-insurance", "case-2026-asteria", "template-task-cyber-insurance", "PASSED"),
    this.caseTask("case-task-asteria-sdlc", "case-2026-asteria", "template-task-secure-development", "PASSED"),
    this.caseTask("case-task-asteria-ai", "case-2026-asteria", "template-task-ai-disclosure", "PASSED"),
    this.caseTask("case-task-asteria-critical-supplier", "case-2026-asteria", "template-task-critical-supplier", "PASSED"),
    this.caseTask("case-task-asteria-attestation", "case-2026-asteria", "template-task-senior-attestation", "PASSED"),
    this.caseTask("case-task-stratuspay-profile", "case-supplier-northstar-stratuspay", "template-task-supplier-profile", "PASSED"),
    this.caseTask("case-task-stratuspay-controls", "case-supplier-northstar-stratuspay", "template-task-supplier-controls", "IN_PROGRESS"),
    this.caseTask("case-task-stratuspay-risk", "case-supplier-northstar-stratuspay", "template-task-supplier-risk", "NOT_STARTED"),
  ];

  readonly stakeholderReviews = [
    this.stakeholderReview("review-harrington-northstar", "harrington-financial", "case-2026-northstar", "IN_REVIEW", "Security and subprocessor evidence is under procurement review.", "user-rachel-morgan"),
    this.stakeholderReview("review-harrington-cobalt", "harrington-financial", "case-2026-cobalt", "NOT_REVIEWED", "Waiting for Cobalt to submit the full Case.", "user-rachel-morgan"),
    this.stakeholderReview("review-mercury-cobalt", "mercury-retail", "case-2026-cobalt", "IN_REVIEW", "Review started after access grant was accepted.", "user-sophie-turner"),
    this.stakeholderReview("review-mercury-pinebridge", "mercury-retail", "case-2026-pinebridge", "MORE_INFO_REQUESTED", "Restore-test evidence and certification evidence need clarification.", "user-sophie-turner"),
  ];

  readonly requestsForInformation = [
    this.requestForInformation(
      "rfi-harrington-northstar-subprocessors",
      "harrington-financial",
      "case-2026-northstar",
      "case-task-northstar-subprocessors",
      "Please confirm whether the EU monitoring provider listed in the subprocessor register has access to production customer data.",
      "user-rachel-morgan",
      "OPEN",
    ),
    this.requestForInformation(
      "rfi-mercury-pinebridge-restore",
      "mercury-retail",
      "case-2026-pinebridge",
      "case-task-pinebridge-backup",
      "The restore-test evidence is older than the current policy cycle. Please provide a 2026 restore-test summary or explain the gap.",
      "user-sophie-turner",
      "ANSWERED",
      "The May 2026 restore-test summary has been added to the evidence metadata and the exception is tracked in the remediation register.",
      "user-maya-patel",
    ),
    this.requestForInformation(
      "rfi-mercury-cobalt-pack",
      "mercury-retail",
      "case-2026-cobalt",
      null,
      "When do you expect to submit the remaining certification and incident response evidence for stakeholder review?",
      "user-sophie-turner",
      "IN_PROGRESS",
      "Certification evidence is being validated by the audit team. We expect to submit the remaining items by 21 June.",
      "user-lewis-green",
    ),
  ];

  constructor() {
    this.hydrateAuthorityTerminology();
  }

  listAuthorities() {
    return this.authorities.map((authority) => authority.toDto());
  }

  getAuthority(authorityId: AuthorityId) {
    return this.authorities.find((authority) => authority.id === authorityId)?.toDto() ?? null;
  }

  getAuthorityTerminology(authorityId: AuthorityId) {
    return this.authorityTerminology.find((terminology) => terminology.toDto().authorityId === authorityId)?.toDto() ?? null;
  }

  updateAuthorityTerminology(command: UpdateAuthorityTerminologyCommand) {
    this.requireAuthority(command.authorityId);
    const timestamp = this.timestamp();
    const existing = this.getAuthorityTerminology(command.authorityId);
    const terminology: AuthorityTerminologyDto = {
      ...(existing ?? this.createBase(this.nextId("terminology", this.authorityTerminology))),
      authorityId: command.authorityId,
      labels: mergeTerminologyLabels(command.labels),
      updatedAt: timestamp,
    };
    if (existing) {
      this.replaceById(this.authorityTerminology, new AuthorityTerminologyEntity(terminology));
    } else {
      this.authorityTerminology.push(new AuthorityTerminologyEntity(terminology));
    }
    saveAuthorityTerminologyToStorage(this.authorityTerminology.map((item) => item.toDto()));
    return terminology;
  }

  getParticipant(participantId: ParticipantId) {
    return this.participants.find((participant) => participant.id === participantId)?.toDto() ?? null;
  }

  getParticipantsForAuthority(authorityId: AuthorityId) {
    return this.participants
      .map((participant) => participant.toDto())
      .filter((participant) => participant.authorityId === authorityId);
  }

  getStakeholder(stakeholderId: StakeholderId) {
    return this.stakeholders.find((stakeholder) => stakeholder.id === stakeholderId)?.toDto() ?? null;
  }

  getStakeholdersForAuthority(authorityId: AuthorityId) {
    return this.stakeholders
      .map((stakeholder) => stakeholder.toDto())
      .filter((stakeholder) => stakeholder.authorityId === authorityId);
  }

  getCaseTemplate(caseTemplateId: CaseTemplateId) {
    return this.caseTemplates.find((template) => template.id === caseTemplateId)?.toDto() ?? null;
  }

  getCaseTemplatesForAuthority(authorityId: AuthorityId) {
    return this.caseTemplates
      .map((template) => template.toDto())
      .filter((template) => template.authorityId === authorityId);
  }

  getCase(caseId: CaseRecordId) {
    return this.cases.find((caseRecord) => caseRecord.id === caseId)?.toDto() ?? null;
  }

  getCasesForParticipant(participantId: ParticipantId) {
    return this.cases
      .map((caseRecord) => caseRecord.toDto())
      .filter((caseRecord) => caseRecord.participantId === participantId);
  }

  getParticipantSuppliersForParticipant(participantId: ParticipantId) {
    return this.participantSuppliers
      .map((relationship) => relationship.toDto())
      .filter((relationship) => relationship.participantId === participantId);
  }

  getCaseTasksForCase(caseId: CaseRecordId) {
    return this.caseTasks
      .map((caseTask) => caseTask.toDto())
      .filter((caseTask) => caseTask.caseId === caseId);
  }

  getStakeholderParticipantAccess(stakeholderId: StakeholderId) {
    return this.stakeholderParticipantAccess
      .map((access) => access.toDto())
      .filter((access) => access.stakeholderId === stakeholderId);
  }

  getAccessGrantsForParticipant(participantId: ParticipantId) {
    return this.accessGrants
      .map((grant) => grant.toDto())
      .filter((grant) => grant.participantId === participantId);
  }

  getActiveAccessGrantsForStakeholder(stakeholderId: StakeholderId) {
    return this.accessGrants
      .map((grant) => grant.toDto())
      .filter((grant) => grant.granteeStakeholderId === stakeholderId && grant.status === "ACTIVE");
  }

  getActiveHelperAccessGrants(helperStakeholderId: StakeholderId) {
    return this.accessGrants
      .map((grant) => grant.toDto())
      .filter(
        (grant) =>
          grant.granteeStakeholderId === helperStakeholderId &&
          grant.granteeType === "HELPER" &&
          grant.status === "ACTIVE",
      );
  }

  getAccessibleParticipantsForStakeholder(stakeholderId: StakeholderId) {
    const participantIds = new Set(
      this.getActiveAccessGrantsForStakeholder(stakeholderId).map((grant) => grant.participantId),
    );

    return this.participants
      .map((participant) => participant.toDto())
      .filter((participant) => participantIds.has(participant.id));
  }

  getUsersForParticipant(participantId: ParticipantId) {
    return this.getMembershipUsers(this.participantUsers, participantId);
  }

  getUsersForStakeholder(stakeholderId: StakeholderId) {
    return this.getMembershipUsers(this.stakeholderUsers, stakeholderId);
  }

  getUsersForAuthority(authorityId: AuthorityId) {
    return this.getMembershipUsers(this.authorityUsers, authorityId);
  }

  createParticipant(command: CreateParticipantCommand) {
    this.requireAuthority(command.authorityId);
    const participant = new ParticipantEntity({
      ...this.createBase(this.nextId("participant", this.participants)),
      authorityId: command.authorityId,
      participantType: command.participantType,
      displayName: command.displayName,
      status: command.status ?? "ACTIVE",
    });
    this.participants.push(participant);
    return participant.toDto();
  }

  createParticipantUser(participantId: ParticipantId, command: CreateEntityUserCommand) {
    this.requireParticipant(participantId);
    const userAccount = this.createUserAccount(command.displayName, command.email, "PARTICIPANT");
    const membership = new ParticipantUserEntity({
      ...this.createBase(this.nextId("participant-user", this.participantUsers)),
      entityId: participantId,
      userAccountId: userAccount.id,
      role: command.role,
    });
    this.participantUsers.push(membership);
    return { userAccount, participantUser: membership.toDto() };
  }

  createStakeholder(command: CreateStakeholderCommand) {
    this.requireAuthority(command.authorityId);
    const stakeholder = new StakeholderEntity({
      ...this.createBase(this.nextId("stakeholder", this.stakeholders)),
      authorityId: command.authorityId,
      stakeholderType: command.stakeholderType,
      displayName: command.displayName,
      status: command.status ?? "ACTIVE",
    });
    this.stakeholders.push(stakeholder);
    return stakeholder.toDto();
  }

  createStakeholderUser(stakeholderId: StakeholderId, command: CreateEntityUserCommand) {
    this.requireStakeholder(stakeholderId);
    const userAccount = this.createUserAccount(command.displayName, command.email, "STAKEHOLDER");
    const membership = new StakeholderUserEntity({
      ...this.createBase(this.nextId("stakeholder-user", this.stakeholderUsers)),
      entityId: stakeholderId,
      userAccountId: userAccount.id,
      role: command.role,
    });
    this.stakeholderUsers.push(membership);
    return { userAccount, stakeholderUser: membership.toDto() };
  }

  grantStakeholderAccess(command: GrantStakeholderAccessCommand) {
    const stakeholder = this.requireStakeholder(command.stakeholderId);
    const participant = this.requireParticipant(command.participantId);
    this.requireUserAccount(command.approvedByUserId);
    if (stakeholder.authorityId !== participant.authorityId) {
      throw new Error("Stakeholder and participant must belong to the same authority.");
    }
    const existing = this.stakeholderParticipantAccess.some((access) => {
      const dto = access.toDto();
      return dto.stakeholderId === command.stakeholderId && dto.participantId === command.participantId;
    });
    if (existing) {
      throw new Error("Stakeholder access already exists for this participant.");
    }

    const access = new StakeholderParticipantAccessEntity({
      ...this.createBase(this.nextId("access", this.stakeholderParticipantAccess)),
      stakeholderId: command.stakeholderId,
      participantId: command.participantId,
      status: "APPROVED",
      approvedByUserId: command.approvedByUserId,
      approvedAt: this.timestamp(),
    });
    this.stakeholderParticipantAccess.push(access);
    this.createAccessGrant({
      authorityId: participant.authorityId,
      participantId: command.participantId,
      granteeType: "STAKEHOLDER",
      granteeStakeholderId: command.stakeholderId,
      permissionLevel: "REQUEST_INFORMATION",
      status: "ACTIVE",
      createdByUserId: command.approvedByUserId,
    });
    return access.toDto();
  }

  createAccessGrant(command: CreateAccessGrantCommand) {
    const authority = this.requireAuthority(command.authorityId);
    const participant = this.requireParticipant(command.participantId);
    this.requireUserAccount(command.createdByUserId);
    if (participant.authorityId !== authority.id) {
      throw new Error("Access grant participant must belong to the selected authority.");
    }
    if (command.granteeType === "STAKEHOLDER" || command.granteeType === "HELPER") {
      if (!command.granteeStakeholderId) {
        throw new Error("Select a stakeholder or service provider for this access grant.");
      }
      const stakeholder = this.requireStakeholder(command.granteeStakeholderId);
      if (stakeholder.authorityId !== authority.id) {
        throw new Error("Access grant grantee must belong to the selected authority.");
      }
    }
    if (command.granteeType === "USER" && !command.granteeUserId) {
      throw new Error("Select a user for this access grant.");
    }
    if (command.dataScopeType === "PARTICIPANT_SUPPLIER") {
      if (!command.dataScopeId) {
        throw new Error("Select a participant supplier record for this scoped grant.");
      }
      const relationship = this.requireParticipantSupplier(command.dataScopeId);
      if (relationship.participantId !== participant.id || relationship.authorityId !== authority.id) {
        throw new Error("Participant supplier grant scope must belong to the granting participant.");
      }
    }

    const existing = this.accessGrants.some((grant) => {
      const dto = grant.toDto();
      return (
        dto.participantId === command.participantId &&
        dto.granteeType === command.granteeType &&
        dto.granteeStakeholderId === (command.granteeStakeholderId ?? null) &&
        dto.granteeUserId === (command.granteeUserId ?? null) &&
        dto.dataScopeType === (command.dataScopeType ?? "PARTICIPANT_WORKSPACE") &&
        dto.dataScopeId === (command.dataScopeId ?? null) &&
        dto.status !== "REVOKED"
      );
    });
    if (existing) {
      throw new Error("An active access grant already exists for that grantee and scope.");
    }

    const grant = new AccessGrantEntity({
      ...this.createBase(this.nextId("grant", this.accessGrants)),
      authorityId: command.authorityId,
      participantId: command.participantId,
      granteeType: command.granteeType,
      granteeStakeholderId: command.granteeStakeholderId ?? null,
      granteeUserId: command.granteeUserId ?? null,
      permissionLevel: command.permissionLevel,
      dataScopeType: command.dataScopeType ?? "PARTICIPANT_WORKSPACE",
      dataScopeId: command.dataScopeId ?? null,
      status: command.status ?? "ACTIVE",
      createdByUserId: command.createdByUserId,
      expiresAt: command.expiresAt ?? null,
    });
    this.accessGrants.push(grant);
    return grant.toDto();
  }

  updateAccessGrantStatus(accessGrantId: AccessGrantId, status: AccessGrantStatus) {
    const grant = this.accessGrants.find((item) => item.id === accessGrantId)?.toDto();
    if (!grant) throw new Error(`Access grant ${accessGrantId} was not found.`);
    const updated = { ...grant, status, updatedAt: this.timestamp() };
    this.replaceById(this.accessGrants, new AccessGrantEntity(updated));
    return updated;
  }

  createParticipantSupplier(command: CreateParticipantSupplierCommand) {
    const authority = this.requireAuthority(command.authorityId);
    const participant = this.requireParticipant(command.participantId);
    if (participant.authorityId !== authority.id) {
      throw new Error("Participant supplier record must belong to the selected authority.");
    }
    const supplierName = command.supplierName.trim();
    if (!supplierName) throw new Error("Enter a participant supplier name.");
    const relationship = new ParticipantSupplierEntity({
      ...this.createBase(this.nextId("participant-supplier", this.participantSuppliers)),
      authorityId: command.authorityId,
      participantId: command.participantId,
      supplierName,
      relationshipType: command.relationshipType.trim() || "Supplier",
      criticality: command.criticality,
      servicesProvided: command.servicesProvided.trim(),
      dataExposure: command.dataExposure.trim(),
      status: "UNDER_REVIEW",
    });
    this.participantSuppliers.push(relationship);
    return relationship.toDto();
  }

  getStakeholderReview(stakeholderId: StakeholderId, caseId: CaseRecordId) {
    return this.stakeholderReviews
      .map((review) => review.toDto())
      .find((review) => review.stakeholderId === stakeholderId && review.caseId === caseId) ?? null;
  }

  upsertStakeholderReview(command: UpsertStakeholderReviewCommand) {
    const stakeholder = this.requireStakeholder(command.stakeholderId);
    const caseRecord = this.requireCase(command.caseId);
    this.requireUserAccount(command.reviewedByUserId);
    const activeGrant = this.getActiveAccessGrantsForStakeholder(stakeholder.id).find(
      (grant) =>
        grant.participantId === caseRecord.participantId &&
        grant.granteeType === "STAKEHOLDER" &&
        this.accessGrantAllowsCase(grant, caseRecord),
    );
    if (!activeGrant) {
      throw new Error("Stakeholder review requires an active participant access grant.");
    }

    const reviewedAt = this.timestamp();
    const existing = this.getStakeholderReview(command.stakeholderId, command.caseId);
    const review: StakeholderReviewDto = {
      ...(existing ?? this.createBase(this.nextId("stakeholder-review", this.stakeholderReviews))),
      stakeholderId: command.stakeholderId,
      caseId: command.caseId,
      status: command.status,
      note: command.note,
      reviewedByUserId: command.reviewedByUserId,
      reviewedAt,
      updatedAt: reviewedAt,
    };

    if (existing) {
      this.replaceById(this.stakeholderReviews, new StakeholderReviewEntity(review));
    } else {
      this.stakeholderReviews.push(new StakeholderReviewEntity(review));
    }

    return review;
  }

  getRequestsForCase(caseId: CaseRecordId) {
    return this.requestsForInformation
      .map((request) => request.toDto())
      .filter((request) => request.caseId === caseId);
  }

  getRequestsForParticipant(participantId: ParticipantId) {
    return this.requestsForInformation
      .map((request) => request.toDto())
      .filter((request) => request.participantId === participantId);
  }

  createRequestForInformation(command: CreateRequestForInformationCommand) {
    const stakeholder = this.requireStakeholder(command.stakeholderId);
    const caseRecord = this.requireCase(command.caseId);
    this.requireUserAccount(command.requestedByUserId);
    let caseTask: CaseTaskDto | null = null;
    if (command.caseTaskId) {
      caseTask = this.requireCaseTask(command.caseTaskId);
      if (caseTask.caseId !== caseRecord.id) {
        throw new Error("The selected case task does not belong to this Case.");
      }
    }
    const grant = this.getActiveAccessGrantsForStakeholder(stakeholder.id).find(
      (candidate) =>
        candidate.participantId === caseRecord.participantId &&
        candidate.granteeType === "STAKEHOLDER" &&
        this.accessGrantAllowsCase(candidate, caseRecord),
    );
    if (!grant || grant.permissionLevel === "READ_ONLY") {
      throw new Error("Requesting information requires an active participant access grant with request permission.");
    }
    const requestText = command.requestText.trim();
    if (!requestText) {
      throw new Error("Enter a request for information.");
    }
    const requestedAt = this.timestamp();
    const request = new RequestForInformationEntity({
      ...this.createBase(this.nextId("rfi", this.requestsForInformation)),
      authorityId: caseRecord.authorityId,
      participantId: caseRecord.participantId,
      stakeholderId: stakeholder.id,
      caseId: caseRecord.id,
      caseTaskId: caseTask?.id ?? null,
      scopeType: caseTask ? "CASE_TASK" : "CASE",
      requestText,
      responseText: "",
      status: "OPEN",
      requestedByUserId: command.requestedByUserId,
      assignedToUserId: null,
      respondedByUserId: null,
      requestedAt,
      respondedAt: null,
      statusHistory: [{ status: "OPEN", at: requestedAt, byUserId: command.requestedByUserId, note: "Request created" }],
    });
    this.requestsForInformation.push(request);
    return request.toDto();
  }

  respondToRequestForInformation(command: RespondToRequestForInformationCommand) {
    const request = this.requireRequestForInformation(command.requestId);
    const respondent = this.requireUserAccount(command.respondedByUserId);
    const isParticipantUser = this.participantUsers.some((membership) => {
      const dto = membership.toDto();
      return dto.entityId === request.participantId && dto.userAccountId === respondent.id;
    });
    const helperStakeholderIds = this.stakeholderUsers
      .map((membership) => membership.toDto())
      .filter((membership) => membership.userAccountId === respondent.id)
      .map((membership) => membership.entityId);
    const hasHelperEditGrant = helperStakeholderIds.some((stakeholderId) =>
      this.getActiveHelperAccessGrants(stakeholderId).some(
        (grant) =>
          grant.participantId === request.participantId &&
          (grant.permissionLevel === "CREATE_AND_EDIT" || grant.permissionLevel === "ADMINISTER_GRANTS") &&
          (!request.caseId || this.accessGrantAllowsCase(grant, this.requireCase(request.caseId))),
      ),
    );
    if (!isParticipantUser && !hasHelperEditGrant) {
      throw new Error("Only the owning participant or an authorised service provider can respond to this request.");
    }
    const responseText = command.responseText.trim();
    if (!responseText) {
      throw new Error("Enter a response before updating the request.");
    }
    const respondedAt = this.timestamp();
    const status = command.status ?? "ANSWERED";
    const updated: RequestForInformationDto = {
      ...request,
      responseText,
      status,
      assignedToUserId: request.assignedToUserId ?? respondent.id,
      respondedByUserId: respondent.id,
      respondedAt,
      updatedAt: respondedAt,
      statusHistory: [
        ...request.statusHistory,
        { status, at: respondedAt, byUserId: respondent.id, note: status === "ANSWERED" ? "Participant answered request" : "Participant response in progress" },
      ],
    };
    this.replaceById(this.requestsForInformation, new RequestForInformationEntity(updated));
    return updated;
  }

  updateRequestForInformationStatus(command: UpdateRequestForInformationStatusCommand) {
    const request = this.requireRequestForInformation(command.requestId);
    this.requireUserAccount(command.updatedByUserId);
    const updatedAt = this.timestamp();
    const updated: RequestForInformationDto = {
      ...request,
      status: command.status,
      updatedAt,
      statusHistory: [
        ...request.statusHistory,
        { status: command.status, at: updatedAt, byUserId: command.updatedByUserId, note: command.note ?? command.status.toLowerCase() },
      ],
    };
    this.replaceById(this.requestsForInformation, new RequestForInformationEntity(updated));
    return updated;
  }

  createCaseTemplate(command: CreateCaseTemplateCommand) {
    this.requireAuthority(command.authorityId);
    const template = new CaseTemplateEntity({
      ...this.createBase(this.nextId("template", this.caseTemplates)),
      authorityId: command.authorityId,
      name: command.name,
      description: command.description,
      status: "DRAFT",
      publishedAt: null,
      publishedByUserId: null,
    });
    this.caseTemplates.push(template);
    return template.toDto();
  }

  addTaskToTemplate(command: AddTaskToTemplateCommand) {
    const template = this.requireCaseTemplate(command.caseTemplateId);
    this.requireTaskType(command.taskTypeId);
    const sortOrder =
      Math.max(
        0,
        ...this.caseTemplateTasks
          .map((task) => task.toDto())
          .filter((task) => task.caseTemplateId === command.caseTemplateId)
          .map((task) => task.sortOrder),
      ) + 1;
    const templateTask = new CaseTemplateTaskEntity({
      ...this.createBase(this.nextId("template-task", this.caseTemplateTasks)),
      caseTemplateId: command.caseTemplateId,
      taskTypeId: command.taskTypeId,
      title: command.title,
      description: command.description,
      parametersJson: command.parametersJson ?? {},
      sortOrder,
      status: "ACTIVE",
      createdAfterPublish: template.status === "PUBLISHED",
      withdrawnReason: null,
      withdrawnAt: null,
      withdrawnByUserId: null,
    });
    this.caseTemplateTasks.push(templateTask);

    if (template.status === "PUBLISHED") {
      this.cases
        .map((caseRecord) => caseRecord.toDto())
        .filter((caseRecord) => caseRecord.caseTemplateId === command.caseTemplateId)
        .forEach((caseRecord) => {
          this.caseTasks.push(
            new CaseTaskEntity({
              ...this.createBase(this.nextId("case-task", this.caseTasks)),
              caseId: caseRecord.id,
              caseTemplateTaskId: templateTask.id,
              status: "NOT_STARTED",
              responseJson: {},
              evidenceJson: {},
              withdrawnAt: null,
            }),
          );
          this.recalculateCaseStatus(caseRecord.id);
        });
    }

    return templateTask.toDto();
  }

  assignParticipantToTemplate(command: AssignParticipantToTemplateCommand) {
    const template = this.requireCaseTemplate(command.caseTemplateId);
    const participant = this.requireParticipant(command.participantId);
    if (template.authorityId !== participant.authorityId) {
      throw new Error("Participant must belong to the template authority.");
    }
    const existing = this.caseTemplateParticipants.some((assignment) => {
      const dto = assignment.toDto();
      return dto.caseTemplateId === command.caseTemplateId && dto.participantId === command.participantId;
    });
    if (existing) {
      throw new Error("Participant is already assigned to this template.");
    }

    const caseId =
      template.status === "PUBLISHED" && command.status === "REQUIRED"
        ? this.createCaseForTemplateParticipant(template, command.participantId).id
        : null;
    const assignment = new CaseTemplateParticipantEntity({
      ...this.createBase(this.nextId("template-participant", this.caseTemplateParticipants)),
      caseTemplateId: command.caseTemplateId,
      participantId: command.participantId,
      status: command.status,
      caseId,
      exemptionReason: command.exemptionReason ?? null,
      decidedByUserId: command.decidedByUserId ?? null,
      decidedAt: command.decidedByUserId ? this.timestamp() : null,
    });
    this.caseTemplateParticipants.push(assignment);
    return assignment.toDto();
  }

  publishTemplate(caseTemplateId: CaseTemplateId, publishedByUserId: UserAccountId) {
    const template = this.requireCaseTemplate(caseTemplateId);
    this.requireUserAccount(publishedByUserId);
    if (template.status !== "DRAFT") {
      throw new Error("Only draft templates can be published.");
    }

    const activeTasks = this.getActiveTemplateTasks(caseTemplateId);
    if (activeTasks.length === 0) {
      throw new Error("A template must have at least one active task before publication.");
    }
    const requiredParticipants = this.caseTemplateParticipants
      .map((assignment) => assignment.toDto())
      .filter((assignment) => assignment.caseTemplateId === caseTemplateId && assignment.status === "REQUIRED");
    if (requiredParticipants.length === 0) {
      throw new Error("A template must have at least one required participant before publication.");
    }

    const publishedTemplate: CaseTemplateDto = {
      ...template,
      status: "PUBLISHED",
      publishedAt: this.timestamp(),
      publishedByUserId,
      updatedAt: this.timestamp(),
    };
    this.replaceById(this.caseTemplates, new CaseTemplateEntity(publishedTemplate));

    requiredParticipants.forEach((assignment) => {
      if (assignment.caseId) return;
      const caseRecord = this.createCaseForTemplateParticipant(publishedTemplate, assignment.participantId);
      this.replaceById(
        this.caseTemplateParticipants,
        new CaseTemplateParticipantEntity({
          ...assignment,
          caseId: caseRecord.id,
          updatedAt: this.timestamp(),
        }),
      );
    });

    return publishedTemplate;
  }

  completeTask(command: CompleteTaskCommand) {
    const caseTask = this.requireCaseTask(command.caseTaskId);
    if (caseTask.status === "WITHDRAWN") {
      throw new Error("Withdrawn tasks cannot be completed.");
    }
    return this.updateCaseTask({
      ...caseTask,
      responseJson: command.responseJson,
      status: "IN_PROGRESS",
      updatedAt: this.timestamp(),
    });
  }

  uploadEvidence(command: UploadEvidenceCommand) {
    const caseTask = this.requireCaseTask(command.caseTaskId);
    if (caseTask.status === "WITHDRAWN") {
      throw new Error("Withdrawn tasks cannot receive evidence.");
    }
    return this.updateCaseTask({
      ...caseTask,
      evidenceJson: command.evidenceJson,
      status: caseTask.status === "NOT_STARTED" ? "IN_PROGRESS" : caseTask.status,
      updatedAt: this.timestamp(),
    });
  }

  submitTask(caseTaskId: CaseTaskId) {
    const caseTask = this.requireCaseTask(caseTaskId);
    if (caseTask.status === "WITHDRAWN") {
      throw new Error("Withdrawn tasks cannot be submitted.");
    }
    const updated = this.updateCaseTask({
      ...caseTask,
      status: "SUBMITTED",
      updatedAt: this.timestamp(),
    });
    this.recalculateCaseStatus(caseTask.caseId);
    return updated;
  }

  submitCase(caseId: CaseRecordId) {
    const caseRecord = this.requireCase(caseId);
    const activeTasks = this.getCaseTasksForCase(caseId).filter((caseTask) => caseTask.status !== "WITHDRAWN");
    const hasUnsubmittedTasks = activeTasks.some(
      (caseTask) => caseTask.status === "NOT_STARTED" || caseTask.status === "IN_PROGRESS",
    );
    if (hasUnsubmittedTasks) {
      throw new Error("All active case tasks must be submitted before the case can be submitted.");
    }
    const submittedCase = {
      ...caseRecord,
      status: "SUBMITTED" as const,
      submittedAt: this.timestamp(),
      updatedAt: this.timestamp(),
    };
    this.replaceById(this.cases, new CaseEntity(submittedCase));
    return submittedCase;
  }

  reviewTask(caseTaskId: CaseTaskId, decision: "PASSED" | "FAILED") {
    const caseTask = this.requireCaseTask(caseTaskId);
    if (caseTask.status === "WITHDRAWN") {
      throw new Error("Withdrawn tasks cannot be reviewed.");
    }
    const updated = this.updateCaseTask({
      ...caseTask,
      status: decision,
      updatedAt: this.timestamp(),
    });
    this.recalculateCaseStatus(caseTask.caseId);
    return updated;
  }

  withdrawTemplateTask(caseTemplateTaskId: CaseTemplateTaskId, withdrawnByUserId: UserAccountId, withdrawnReason: string) {
    const templateTask = this.requireCaseTemplateTask(caseTemplateTaskId);
    this.requireUserAccount(withdrawnByUserId);
    const withdrawnAt = this.timestamp();
    const updatedTemplateTask: CaseTemplateTaskDto = {
      ...templateTask,
      status: "WITHDRAWN",
      withdrawnAt,
      withdrawnByUserId,
      withdrawnReason,
      updatedAt: withdrawnAt,
    };
    this.replaceById(this.caseTemplateTasks, new CaseTemplateTaskEntity(updatedTemplateTask));

    this.caseTasks
      .map((caseTask) => caseTask.toDto())
      .filter(
        (caseTask) =>
          caseTask.caseTemplateTaskId === caseTemplateTaskId &&
          !["PASSED", "FAILED", "WITHDRAWN"].includes(caseTask.status),
      )
      .forEach((caseTask) => {
        this.updateCaseTask({
          ...caseTask,
          status: "WITHDRAWN",
          withdrawnAt,
          updatedAt: withdrawnAt,
        });
        this.recalculateCaseStatus(caseTask.caseId);
      });

    return updatedTemplateTask;
  }

  private user(id: UserAccountId, displayName: string, email: string, userKind: UserKind) {
    return new UserAccountEntity({
      ...base(id),
      entraObjectId: `entra-${id}`,
      displayName,
      email,
      userKind,
      status: "ACTIVE",
    });
  }

  private membership<T extends DomainEntity<MembershipDto>>(
    id: string,
    entityId: MembershipDto["entityId"],
    userAccountId: UserAccountId,
    role: MembershipRole,
    EntityClass: new (dto: MembershipDto) => T,
  ) {
    return new EntityClass({ ...base(id), entityId, userAccountId, role });
  }

  private access(
    id: StakeholderParticipantAccessId,
    stakeholderId: StakeholderId,
    participantId: ParticipantId,
    approvedByUserId: UserAccountId,
  ) {
    return new StakeholderParticipantAccessEntity({
      ...base(id),
      stakeholderId,
      participantId,
      status: "APPROVED",
      approvedByUserId,
      approvedAt: "2026-01-20T10:00:00.000Z",
    });
  }

  private accessGrant(
    id: AccessGrantId,
    participantId: ParticipantId,
    granteeType: AccessGrantGranteeType,
    granteeStakeholderId: StakeholderId,
    permissionLevel: AccessGrantPermissionLevel,
    status: AccessGrantStatus,
    createdByUserId: UserAccountId,
    dataScopeType: AccessGrantDataScopeType = "PARTICIPANT_WORKSPACE",
    dataScopeId: string | null = null,
  ) {
    const participant = this.participants.find((item) => item.id === participantId)?.toDto();
    return new AccessGrantEntity({
      ...base(id),
      authorityId: participant?.authorityId ?? "northstar-association",
      participantId,
      granteeType,
      granteeStakeholderId,
      granteeUserId: null,
      permissionLevel,
      dataScopeType,
      dataScopeId,
      status,
      createdByUserId,
      expiresAt: null,
    });
  }

  private participantSupplier(
    id: ParticipantSupplierId,
    participantId: ParticipantId,
    supplierName: string,
    relationshipType: string,
    criticality: ParticipantSupplierCriticality,
    servicesProvided: string,
    dataExposure: string,
    status: ParticipantSupplierStatus,
  ) {
    const participant = this.participants.find((item) => item.id === participantId)?.toDto();
    return new ParticipantSupplierEntity({
      ...base(id),
      authorityId: participant?.authorityId ?? "northstar-association",
      participantId,
      supplierName,
      relationshipType,
      criticality,
      servicesProvided,
      dataExposure,
      status,
    });
  }

  private taskType(id: TaskTypeId, code: string, name: string, description: string) {
    return new TaskTypeEntity({
      ...base(id),
      code,
      name,
      description,
      parameterSchemaJson: {},
      status: "ACTIVE",
    });
  }

  private caseTemplate(
    id: CaseTemplateId,
    authorityId: AuthorityId,
    name: string,
    description: string,
    status: CaseTemplateStatus,
    publishedByUserId: UserAccountId,
  ) {
    return new CaseTemplateEntity({
      ...base(id),
      authorityId,
      name,
      description,
      status,
      publishedAt: status === "PUBLISHED" ? "2026-05-01T10:00:00.000Z" : null,
      publishedByUserId: status === "PUBLISHED" ? publishedByUserId : null,
    });
  }

  private templateTask(
    id: CaseTemplateTaskId,
    caseTemplateId: CaseTemplateId,
    taskTypeId: TaskTypeId,
    title: string,
    description: string,
    sortOrder: number,
    parametersJson: JsonObject,
  ) {
    return new CaseTemplateTaskEntity({
      ...base(id),
      caseTemplateId,
      taskTypeId,
      title,
      description,
      parametersJson,
      sortOrder,
      status: "ACTIVE",
      createdAfterPublish: false,
      withdrawnReason: null,
      withdrawnAt: null,
      withdrawnByUserId: null,
    });
  }

  private templateParticipant(
    id: CaseTemplateParticipantId,
    caseTemplateId: CaseTemplateId,
    participantId: ParticipantId,
    caseId: CaseRecordId,
  ) {
    return new CaseTemplateParticipantEntity({
      ...base(id),
      caseTemplateId,
      participantId,
      status: "REQUIRED",
      caseId,
      exemptionReason: null,
      decidedByUserId: null,
      decidedAt: null,
    });
  }

  private caseRecord(
    id: CaseRecordId,
    authorityId: AuthorityId,
    caseTemplateId: CaseTemplateId,
    participantId: ParticipantId,
    participantSupplierId: ParticipantSupplierId | null,
    status: CaseStatus,
    submittedAt: string | null,
    closedAt: string | null,
  ) {
    return new CaseEntity({ ...base(id), authorityId, caseTemplateId, participantId, participantSupplierId, status, submittedAt, closedAt });
  }

  private caseTask(id: CaseTaskId, caseId: CaseRecordId, caseTemplateTaskId: CaseTemplateTaskId, status: CaseTaskStatus) {
    return new CaseTaskEntity({
      ...base(id),
      caseId,
      caseTemplateTaskId,
      status,
      responseJson: {},
      evidenceJson: {},
      withdrawnAt: null,
    });
  }

  private stakeholderReview(
    id: StakeholderReviewId,
    stakeholderId: StakeholderId,
    caseId: CaseRecordId,
    status: StakeholderReviewStatus,
    note: string,
    reviewedByUserId: UserAccountId,
  ) {
    return new StakeholderReviewEntity({
      ...base(id),
      stakeholderId,
      caseId,
      status,
      note,
      reviewedByUserId,
      reviewedAt: now,
    });
  }

  private requestForInformation(
    id: RequestForInformationId,
    stakeholderId: StakeholderId,
    caseId: CaseRecordId,
    caseTaskId: CaseTaskId | null,
    requestText: string,
    requestedByUserId: UserAccountId,
    status: RequestForInformationStatus,
    responseText = "",
    respondedByUserId: UserAccountId | null = null,
  ) {
    const caseRecord = this.cases.find((item) => item.id === caseId)?.toDto();
    const requestedAt = "2026-06-13T10:00:00.000Z";
    const respondedAt = respondedByUserId ? "2026-06-14T11:30:00.000Z" : null;
    return new RequestForInformationEntity({
      ...base(id),
      authorityId: caseRecord?.authorityId ?? "northstar-association",
      participantId: caseRecord?.participantId ?? "northstar-cloud",
      stakeholderId,
      caseId,
      caseTaskId,
      scopeType: caseTaskId ? "CASE_TASK" : "CASE",
      requestText,
      responseText,
      status,
      requestedByUserId,
      assignedToUserId: respondedByUserId,
      respondedByUserId,
      requestedAt,
      respondedAt,
      statusHistory: [
        { status: "OPEN", at: requestedAt, byUserId: requestedByUserId, note: "Request created" },
        ...(respondedByUserId
          ? [{ status, at: respondedAt ?? requestedAt, byUserId: respondedByUserId, note: "Participant response updated" }]
          : []),
      ],
    });
  }

  private timestamp() {
    return new Date().toISOString();
  }

  private createBase(id: string): BaseDto {
    const timestamp = this.timestamp();
    return { id, createdAt: timestamp, updatedAt: timestamp };
  }

  private nextId(prefix: string, existing: Array<{ id: string }>) {
    let index = existing.length + 1;
    let id = `${prefix}-${index}`;
    const existingIds = new Set(existing.map((item) => item.id));
    while (existingIds.has(id)) {
      index += 1;
      id = `${prefix}-${index}`;
    }
    return id;
  }

  private createUserAccount(displayName: string, email: string, userKind: UserKind) {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.userAccounts.some((account) => account.toDto().email.toLowerCase() === normalizedEmail)) {
      throw new Error("A user account with this email already exists.");
    }
    const userAccount = new UserAccountEntity({
      ...this.createBase(this.nextId("user", this.userAccounts)),
      entraObjectId: `entra-${normalizedEmail}`,
      displayName,
      email: normalizedEmail,
      userKind,
      status: "ACTIVE",
    });
    this.userAccounts.push(userAccount);
    return userAccount.toDto();
  }

  private getMembershipUsers(memberships: Array<DomainEntity<MembershipDto>>, entityId: MembershipDto["entityId"]) {
    return memberships
      .map((membership) => membership.toDto())
      .filter((membership) => membership.entityId === entityId)
      .map((membership) => ({
        membership,
        userAccount: this.requireUserAccount(membership.userAccountId),
      }));
  }

  private requireAuthority(authorityId: AuthorityId) {
    const authority = this.getAuthority(authorityId);
    if (!authority) throw new Error(`Authority ${authorityId} was not found.`);
    return authority;
  }

  private hydrateAuthorityTerminology() {
    getStoredAuthorityTerminology().forEach((stored) => {
      if (!this.getAuthority(stored.authorityId)) return;

      const existing = this.getAuthorityTerminology(stored.authorityId);
      const terminology: AuthorityTerminologyDto = {
        ...(existing ?? this.createBase(this.nextId("terminology", this.authorityTerminology))),
        authorityId: stored.authorityId,
        labels: stored.labels,
      };

      if (existing) {
        this.replaceById(this.authorityTerminology, new AuthorityTerminologyEntity(terminology));
      } else {
        this.authorityTerminology.push(new AuthorityTerminologyEntity(terminology));
      }
    });
  }

  private requireParticipant(participantId: ParticipantId) {
    const participant = this.getParticipant(participantId);
    if (!participant) throw new Error(`Participant ${participantId} was not found.`);
    return participant;
  }

  private requireStakeholder(stakeholderId: StakeholderId) {
    const stakeholder = this.getStakeholder(stakeholderId);
    if (!stakeholder) throw new Error(`Stakeholder ${stakeholderId} was not found.`);
    return stakeholder;
  }

  private requireUserAccount(userAccountId: UserAccountId) {
    const userAccount = this.userAccounts.find((account) => account.id === userAccountId)?.toDto();
    if (!userAccount) throw new Error(`User account ${userAccountId} was not found.`);
    return userAccount;
  }

  private requireTaskType(taskTypeId: TaskTypeId) {
    const taskType = this.taskTypes.find((item) => item.id === taskTypeId)?.toDto();
    if (!taskType) throw new Error(`Task type ${taskTypeId} was not found.`);
    return taskType;
  }

  private requireCaseTemplate(caseTemplateId: CaseTemplateId) {
    const template = this.getCaseTemplate(caseTemplateId);
    if (!template) throw new Error(`Case template ${caseTemplateId} was not found.`);
    return template;
  }

  private requireCaseTemplateTask(caseTemplateTaskId: CaseTemplateTaskId) {
    const templateTask = this.caseTemplateTasks.find((task) => task.id === caseTemplateTaskId)?.toDto();
    if (!templateTask) throw new Error(`Case template task ${caseTemplateTaskId} was not found.`);
    return templateTask;
  }

  private requireCase(caseId: CaseRecordId) {
    const caseRecord = this.getCase(caseId);
    if (!caseRecord) throw new Error(`Case ${caseId} was not found.`);
    return caseRecord;
  }

  private requireCaseTask(caseTaskId: CaseTaskId) {
    const caseTask = this.caseTasks.find((task) => task.id === caseTaskId)?.toDto();
    if (!caseTask) throw new Error(`Case task ${caseTaskId} was not found.`);
    return caseTask;
  }

  private requireRequestForInformation(requestId: RequestForInformationId) {
    const request = this.requestsForInformation.find((item) => item.id === requestId)?.toDto();
    if (!request) throw new Error(`Request for information ${requestId} was not found.`);
    return request;
  }

  private accessGrantAllowsCase(grant: AccessGrantDto, caseRecord: CaseDto) {
    if (grant.status !== "ACTIVE") return false;
    if (grant.participantId !== caseRecord.participantId) return false;
    if (grant.dataScopeType === "PARTICIPANT_WORKSPACE") return true;
    if (grant.dataScopeType === "CASE") return grant.dataScopeId === caseRecord.id;
    if (grant.dataScopeType === "CASE_TASK") {
      return this.getCaseTasksForCase(caseRecord.id).some((task) => task.id === grant.dataScopeId);
    }
    if (grant.dataScopeType === "PARTICIPANT_SUPPLIER") return caseRecord.participantSupplierId === grant.dataScopeId;
    if (grant.dataScopeType === "EVIDENCE_METADATA") return true;
    return false;
  }

  private requireParticipantSupplier(participantSupplierId: ParticipantSupplierId) {
    const relationship = this.participantSuppliers.find((item) => item.id === participantSupplierId)?.toDto();
    if (!relationship) throw new Error(`Participant supplier record ${participantSupplierId} was not found.`);
    return relationship;
  }

  private getActiveTemplateTasks(caseTemplateId: CaseTemplateId) {
    return this.caseTemplateTasks
      .map((task) => task.toDto())
      .filter((task) => task.caseTemplateId === caseTemplateId && task.status === "ACTIVE");
  }

  private createCaseForTemplateParticipant(template: CaseTemplateDto, participantId: ParticipantId) {
    const existingCase = this.cases
      .map((caseRecord) => caseRecord.toDto())
      .find((caseRecord) => caseRecord.caseTemplateId === template.id && caseRecord.participantId === participantId);
    if (existingCase) return existingCase;

    const caseRecord = new CaseEntity({
      ...this.createBase(this.nextId("case", this.cases)),
      authorityId: template.authorityId,
      caseTemplateId: template.id,
      participantId,
      participantSupplierId: null,
      status: "NOT_STARTED",
      submittedAt: null,
      closedAt: null,
    });
    this.cases.push(caseRecord);

    this.getActiveTemplateTasks(template.id).forEach((templateTask) => {
      this.caseTasks.push(
        new CaseTaskEntity({
          ...this.createBase(this.nextId("case-task", this.caseTasks)),
          caseId: caseRecord.id,
          caseTemplateTaskId: templateTask.id,
          status: "NOT_STARTED",
          responseJson: {},
          evidenceJson: {},
          withdrawnAt: null,
        }),
      );
    });

    return caseRecord.toDto();
  }

  private replaceById<TDto extends BaseDto, TEntity extends DomainEntity<TDto>>(collection: TEntity[], nextEntity: TEntity) {
    const index = collection.findIndex((item) => item.id === nextEntity.id);
    if (index === -1) {
      throw new Error(`Entity ${nextEntity.id} was not found.`);
    }
    collection[index] = nextEntity;
  }

  private updateCaseTask(caseTask: CaseTaskDto) {
    this.replaceById(this.caseTasks, new CaseTaskEntity(caseTask));
    return caseTask;
  }

  private recalculateCaseStatus(caseId: CaseRecordId) {
    const caseRecord = this.requireCase(caseId);
    const activeTasks = this.getCaseTasksForCase(caseId).filter((caseTask) => caseTask.status !== "WITHDRAWN");
    const nextStatus: CaseStatus =
      activeTasks.length === 0
        ? "IN_PROGRESS"
        : activeTasks.some((caseTask) => caseTask.status === "FAILED")
          ? "REJECTED"
          : activeTasks.every((caseTask) => caseTask.status === "PASSED")
            ? "APPROVED"
            : activeTasks.every((caseTask) => caseTask.status === "SUBMITTED" || caseTask.status === "PASSED")
              ? "SUBMITTED"
              : activeTasks.some((caseTask) => caseTask.status !== "NOT_STARTED")
                ? "IN_PROGRESS"
                : "NOT_STARTED";
    const timestamp = this.timestamp();
    this.replaceById(
      this.cases,
      new CaseEntity({
        ...caseRecord,
        status: nextStatus,
        submittedAt: nextStatus === "SUBMITTED" ? caseRecord.submittedAt ?? timestamp : caseRecord.submittedAt,
        closedAt: nextStatus === "APPROVED" ? caseRecord.closedAt ?? timestamp : caseRecord.closedAt,
        updatedAt: timestamp,
      }),
    );
  }

}

export const db = new InMemoryAllChecksOutDatabase();

export const consoleApps: ConsoleApp[] = [
  {
    id: "administration",
    name: "Authority Administration",
    shortName: "Admin",
    description: "Manage authority settings, participants, stakeholders, case templates, task types, and users.",
    path: "/admin",
    accent: "bg-[#1d70b8]",
    Icon: Landmark,
    audience: ["authority-admin"],
  },
  {
    id: "case-management",
    name: "Cases",
    shortName: "Cases",
    description: "Open participant cases, complete case tasks, upload evidence metadata, and track progress.",
    path: "/cases",
    accent: "bg-[#0078d4]",
    Icon: FolderKanban,
    audience: ["participant"],
  },
  {
    id: "stakeholder-portal",
    name: "Stakeholder Portal",
    shortName: "Stakeholders",
    description: "Review granted participant cases, submitted case tasks, evidence metadata, and outcomes.",
    path: "/stakeholder",
    accent: "bg-[#00703c]",
    Icon: BadgeCheck,
    audience: ["stakeholder"],
  },
  {
    id: "helper-workspace",
    name: "Service Provider Workspace",
    shortName: "Service",
    description: "Assist participant workspaces where delegated helper access is active.",
    path: "/helper",
    accent: "bg-[#4c2c92]",
    Icon: Handshake,
    audience: ["helper"],
  },
];

function buildAuthorities(): Authority[] {
  return db.authorities.map((authority) => {
    const dto = authority.toDto();
    return {
      id: dto.id,
      name: dto.name,
      scenario: "Association participant case",
      description: dto.description,
      status: dto.status,
    };
  });
}

function buildAuthorityTerminology(): AuthorityTerminology[] {
  return db.authorityTerminology.map((terminology) => {
    const dto = terminology.toDto();
    return {
      authorityId: dto.authorityId,
      labels: mergeTerminologyLabels(dto.labels),
    };
  });
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function terminologyLabel(terminology: AuthorityTerminology | undefined, key: TerminologyKey, plural = false) {
  const labels = terminology?.labels ?? defaultTerminologyLabels;
  return plural ? labels[key].plural : labels[key].singular;
}

export function terminologyTitle(terminology: AuthorityTerminology | undefined, key: TerminologyKey, plural = false) {
  return titleCase(terminologyLabel(terminology, key, plural));
}

function buildTaskTypes(): TaskType[] {
  return db.taskTypes.map((taskType) => {
    const dto = taskType.toDto();
    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      status: dto.status,
    };
  });
}

function buildCaseTemplates(): CaseTemplate[] {
  return db.caseTemplates.map((template) => {
    const dto = template.toDto();
    const taskCount = db.caseTemplateTasks
      .map((task) => task.toDto())
      .filter((task) => task.caseTemplateId === dto.id && task.status === "ACTIVE").length;
    const participantCount = db.caseTemplateParticipants.filter((participant) => participant.toDto().caseTemplateId === dto.id).length;
    return {
      id: dto.id,
      authorityId: dto.authorityId,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      taskCount,
      participantCount,
      publishedAt: dto.publishedAt,
    };
  });
}

function buildCaseRecords(): CaseRecord[] {
  return db.cases.map((caseEntity) => {
    const caseDto = caseEntity.toDto();
    const template = db.caseTemplates.find((item) => item.id === caseDto.caseTemplateId)?.toDto();
    const participantSupplier = caseDto.participantSupplierId
      ? db.participantSuppliers.find((item) => item.id === caseDto.participantSupplierId)?.toDto()
      : null;
    const caseTasks = db.caseTasks
      .filter((caseTask) => caseTask.toDto().caseId === caseDto.id)
      .map((caseTask) => {
        const taskDto = caseTask.toDto();
        const templateTask = db.caseTemplateTasks.find((item) => item.id === taskDto.caseTemplateTaskId)?.toDto();
        const taskType = db.taskTypes.find((item) => item.id === templateTask?.taskTypeId)?.toDto();
        const evidenceFiles = Array.isArray(taskDto.evidenceJson.files)
          ? taskDto.evidenceJson.files
              .filter((file): file is { name: string; size: string; uploadedAt: string } => {
                if (!file || typeof file !== "object") return false;
                const candidate = file as Record<string, unknown>;
                return (
                  typeof candidate.name === "string" &&
                  typeof candidate.size === "string" &&
                  typeof candidate.uploadedAt === "string"
                );
              })
          : [];
        return {
          id: taskDto.id,
          title: templateTask?.title ?? "Task",
          type: taskType?.name ?? "Task",
          status: uiTaskStatus(taskDto.status),
          domainStatus: taskDto.status,
          due: typeof templateTask?.parametersJson.due === "string" ? templateTask.parametersJson.due : "No due date",
          description: templateTask?.description ?? "",
          responseText: typeof taskDto.responseJson.summary === "string" ? taskDto.responseJson.summary : "",
          evidenceFiles,
          updatedAt: taskDto.updatedAt,
          Icon: iconByTaskCode[taskType?.code ?? "UPLOAD_DOCUMENT"] ?? ImageUp,
        };
      });
    const completedTasks = caseTasks.filter((task) => task.status === "complete").length;
    const failedTasks = caseTasks.filter((task) => task.status === "attention").length;
    return {
      id: caseDto.id,
      title: template?.name ?? "Case",
      participantId: caseDto.participantId,
      authorityId: caseDto.authorityId,
      caseTemplateId: caseDto.caseTemplateId,
      participantSupplierId: caseDto.participantSupplierId,
      participantSupplierName: participantSupplier?.supplierName ?? null,
      reference:
        caseDto.id === "case-2026-northstar"
          ? "Case-2026-NSCP"
          : caseDto.id === "case-2026-cobalt"
            ? "Case-2026-CWS"
            : caseDto.id === "case-2026-pinebridge"
              ? "Case-2026-PDE"
              : caseDto.id === "case-2026-asteria"
                ? "Case-2026-AIS"
                : "VOV-2026-SPP",
      caseType: template?.description ?? "Case",
      status: uiCaseStatus(caseDto.status),
      domainStatus: caseDto.status,
      completedTasks,
      totalTasks: caseTasks.length,
      risk: failedTasks > 0 ? "high" : completedTasks === caseTasks.length ? "low" : "medium",
      outcome:
        caseDto.status === "APPROVED" || caseDto.status === "CLOSED"
          ? "Stakeholder-ready case"
          : failedTasks > 0
            ? "Requests for additional information are outstanding"
            : caseDto.status === "SUBMITTED"
              ? "Submitted for stakeholder review"
              : "Participant case is in progress",
      lastActivity:
        caseDto.id === "case-2026-northstar"
          ? "Critical supplier Case updated"
          : caseDto.id === "case-2026-cobalt"
            ? "SOC 2 evidence upload started"
            : caseDto.id === "case-2026-pinebridge"
              ? "Stakeholder requested restore-test evidence"
              : caseDto.id === "case-2026-asteria"
                ? "Senior officer attestation accepted"
                : "Supplier control attestation updated",
      tasks: caseTasks,
    };
  });
}

function buildParticipantSuppliers(): ParticipantSupplier[] {
  return db.participantSuppliers.map((relationship) => {
    const dto = relationship.toDto();
    const participant = getParticipant(dto.participantId);
    const linkedCases = cases.filter((caseRecord) => caseRecord.participantSupplierId === dto.id);
    return {
      id: dto.id,
      authorityId: dto.authorityId,
      participantId: dto.participantId,
      participantName: participant?.name ?? "Unknown participant",
      supplierName: dto.supplierName,
      relationshipType: dto.relationshipType,
      criticality: dto.criticality,
      servicesProvided: dto.servicesProvided,
      dataExposure: dto.dataExposure,
      status: dto.status,
      linkedCases,
    };
  });
}

function buildStakeholders(): Stakeholder[] {
  return db.stakeholders.map((stakeholder) => {
    const dto = stakeholder.toDto();
    return {
      id: dto.id,
      authorityId: dto.authorityId,
      name: dto.displayName,
      type: dto.stakeholderType === "ORGANISATION" ? "Organisation" : "Person",
      status: dto.status,
      visibleParticipants: db.getActiveAccessGrantsForStakeholder(dto.id).length,
    };
  });
}

function accessGrantPermissionLabel(permissionLevel: AccessGrantPermissionLevel) {
  const labels: Record<AccessGrantPermissionLevel, string> = {
    READ_ONLY: "Read only",
    REQUEST_INFORMATION: "Request information",
    REVIEW_AND_COMMENT: "Review and comment",
    CREATE_AND_EDIT: "Create and edit",
    ADMINISTER_GRANTS: "Administer grants",
  };
  return labels[permissionLevel];
}

function accessGrantScopeLabel(dataScopeType: AccessGrantDataScopeType, dataScopeId: string | null) {
  if (dataScopeType === "PARTICIPANT_WORKSPACE") return "Entire participant workspace";
  if (dataScopeType === "EVIDENCE_METADATA") return "Evidence metadata";
  if (dataScopeType === "PARTICIPANT_SUPPLIER") return participantSuppliers.find((relationship) => relationship.id === dataScopeId)?.supplierName ?? "Specific participant supplier record";
  if (dataScopeType === "CASE") return cases.find((caseRecord) => caseRecord.id === dataScopeId)?.title ?? "Specific case";
  if (dataScopeType === "CASE_TASK") {
    const task = cases.flatMap((caseRecord) => caseRecord.tasks).find((candidate) => candidate.id === dataScopeId);
    return task?.title ?? "Specific case task";
  }
  return "Configured scope";
}

function buildAccessGrants(): AccessGrant[] {
  return db.accessGrants.map((grant) => {
    const dto = grant.toDto();
    const participant = getParticipant(dto.participantId);
    const stakeholder = dto.granteeStakeholderId ? getStakeholder(dto.granteeStakeholderId) : null;
    const user = dto.granteeUserId ? db.userAccounts.find((account) => account.id === dto.granteeUserId)?.toDto() : null;
    const createdBy = db.userAccounts.find((account) => account.id === dto.createdByUserId)?.toDto();
    return {
      id: dto.id,
      authorityId: dto.authorityId,
      participantId: dto.participantId,
      participantName: participant?.name ?? "Unknown participant",
      granteeType: dto.granteeType,
      granteeName: stakeholder?.name ?? user?.displayName ?? "Unknown grantee",
      granteeStakeholderId: dto.granteeStakeholderId,
      permissionLevel: dto.permissionLevel,
      permissionLabel: accessGrantPermissionLabel(dto.permissionLevel),
      dataScopeType: dto.dataScopeType,
      dataScopeId: dto.dataScopeId,
      scopeLabel: accessGrantScopeLabel(dto.dataScopeType, dto.dataScopeId),
      status: dto.status,
      createdByUserId: dto.createdByUserId,
      createdByName: createdBy?.displayName ?? "Unknown user",
      createdAt: dto.createdAt,
      expiresAt: dto.expiresAt,
    };
  });
}

function stakeholderReviewStatusLabel(status: StakeholderReviewStatus) {
  const labels: Record<StakeholderReviewStatus, string> = {
    NOT_REVIEWED: "Not reviewed",
    IN_REVIEW: "In review",
    APPROVED: "Approved",
    MORE_INFO_REQUESTED: "More information requested",
  };
  return labels[status];
}

function buildStakeholderReviews(): StakeholderReview[] {
  return db.stakeholderReviews.map((review) => {
    const dto = review.toDto();
    const reviewedBy = db.userAccounts.find((account) => account.id === dto.reviewedByUserId)?.toDto();
    return {
      id: dto.id,
      stakeholderId: dto.stakeholderId,
      caseId: dto.caseId,
      status: dto.status,
      statusLabel: stakeholderReviewStatusLabel(dto.status),
      note: dto.note,
      reviewedByName: reviewedBy?.displayName ?? "Unknown user",
      reviewedAt: dto.reviewedAt,
    };
  });
}

function requestForInformationStatusLabel(status: RequestForInformationStatus) {
  const labels: Record<RequestForInformationStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    ANSWERED: "Answered",
    ACCEPTED: "Accepted",
    WITHDRAWN: "Withdrawn",
  };
  return labels[status];
}

function buildRequestsForInformation(): RequestForInformation[] {
  return db.requestsForInformation.map((request) => {
    const dto = request.toDto();
    const participant = getParticipant(dto.participantId);
    const stakeholder = getStakeholder(dto.stakeholderId);
    const caseRecord = cases.find((item) => item.id === dto.caseId);
    const task = cases.flatMap((item) => item.tasks).find((candidate) => candidate.id === dto.caseTaskId);
    const requestedBy = db.userAccounts.find((account) => account.id === dto.requestedByUserId)?.toDto();
    const assignedTo = dto.assignedToUserId ? db.userAccounts.find((account) => account.id === dto.assignedToUserId)?.toDto() : null;
    const respondedBy = dto.respondedByUserId ? db.userAccounts.find((account) => account.id === dto.respondedByUserId)?.toDto() : null;
    return {
      id: dto.id,
      authorityId: dto.authorityId,
      participantId: dto.participantId,
      participantName: participant?.name ?? "Unknown participant",
      stakeholderId: dto.stakeholderId,
      stakeholderName: stakeholder?.name ?? "Unknown stakeholder",
      caseId: dto.caseId,
      caseTitle: caseRecord?.title ?? "Case",
      caseTaskId: dto.caseTaskId,
      taskTitle: task?.title ?? null,
      scopeType: dto.scopeType,
      scopeLabel: task?.title ?? caseRecord?.title ?? "Participant workspace",
      requestText: dto.requestText,
      responseText: dto.responseText,
      status: dto.status,
      statusLabel: requestForInformationStatusLabel(dto.status),
      requestedByName: requestedBy?.displayName ?? "Unknown user",
      assignedToName: assignedTo?.displayName ?? null,
      respondedByName: respondedBy?.displayName ?? null,
      requestedAt: dto.requestedAt,
      respondedAt: dto.respondedAt,
    };
  });
}

function buildParticipants(caseRecords: CaseRecord[]): Participant[] {
  return db.participants.map((participant) => {
    const dto = participant.toDto();
    const participantCases = caseRecords.filter((caseRecord) => caseRecord.participantId === dto.id);
    const access = db.stakeholderParticipantAccess.find((item) => item.toDto().participantId === dto.id)?.toDto();
    const completedTasks = participantCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);
    const totalTasks = participantCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
    return {
      id: dto.id,
      authorityId: dto.authorityId,
      stakeholderId: access?.stakeholderId ?? "",
      name: dto.displayName,
      type: dto.participantType === "ORGANISATION" ? "Organisation" : "Person",
      participantRole: "Member participant completing association Case requirements",
      status: uiParticipantStatus(participantCases),
      domainStatus: dto.status,
      openCases: participantCases.filter((caseRecord) => caseRecord.status !== "closed").length,
      completedTasks,
      totalTasks,
      lastActivity: participantCases[0]?.lastActivity ?? "No case activity",
    };
  });
}

function buildAuthenticatableUsers(): AuthenticatableUser[] {
  return [
    ...db.authorityUsers.map((membership) => {
      const dto = membership.toDto();
      const user = db.userAccounts.find((account) => account.id === dto.userAccountId)?.toDto();
      return {
        id: dto.userAccountId,
        name: user?.displayName ?? "Unknown user",
        email: user?.email ?? "",
        userKind: "AUTHORITY" as const,
        membership: { entityType: "authority" as const, entityId: dto.entityId },
        membershipRole: dto.role,
      };
    }),
    ...db.participantUsers.map((membership) => {
      const dto = membership.toDto();
      const user = db.userAccounts.find((account) => account.id === dto.userAccountId)?.toDto();
      return {
        id: dto.userAccountId,
        name: user?.displayName ?? "Unknown user",
        email: user?.email ?? "",
        userKind: "PARTICIPANT" as const,
        membership: { entityType: "participant" as const, entityId: dto.entityId },
        membershipRole: dto.role,
      };
    }),
    ...db.stakeholderUsers.map((membership) => {
      const dto = membership.toDto();
      const user = db.userAccounts.find((account) => account.id === dto.userAccountId)?.toDto();
      return {
        id: dto.userAccountId,
        name: user?.displayName ?? "Unknown user",
        email: user?.email ?? "",
        userKind: "STAKEHOLDER" as const,
        membership: { entityType: "stakeholder" as const, entityId: dto.entityId },
        membershipRole: dto.role,
      };
    }),
  ];
}

function buildUserIdentities(): UserIdentity[] {
  return db.userAccounts
    .map((account) => account.toDto())
    .filter((account) => account.status === "ACTIVE")
    .map((account) => ({
      id: account.id,
      name: account.displayName,
      email: account.email,
      status: account.status,
    }));
}

function roleForContext(entityType: AccountContextType): UserRole {
  if (entityType === "authority") return "authority-admin";
  return entityType;
}

function buildAccountContexts(): AccountContext[] {
  return authenticatableUsers.flatMap<AccountContext>((membership) => {
    const role = roleForContext(membership.membership.entityType);

    if (membership.membership.entityType === "authority") {
      const authority = getAuthority(membership.membership.entityId);
      if (!authority) return [];
      return [{
        id: `${membership.id}:authority:${authority.id}`,
        authenticatableUserId: membership.id,
        name: membership.name,
        email: membership.email,
        authorityId: authority.id,
        authorityName: authority.name,
        role,
        entityType: membership.membership.entityType,
        entityId: authority.id,
        entityName: authority.name,
        membershipRole: membership.membershipRole,
        participantId: null,
        stakeholderId: null,
        description: "Configure scheme settings, Case templates, participants, stakeholders, and users.",
      }];
    }

    if (membership.membership.entityType === "participant") {
      const participant = getParticipant(membership.membership.entityId);
      const authority = getAuthority(participant?.authorityId);
      if (!participant || !authority) return [];
      return [{
        id: `${membership.id}:participant:${participant.id}`,
        authenticatableUserId: membership.id,
        name: membership.name,
        email: membership.email,
        authorityId: authority.id,
        authorityName: authority.name,
        role,
        entityType: membership.membership.entityType,
        entityId: participant.id,
        entityName: participant.name,
        membershipRole: membership.membershipRole,
        participantId: participant.id,
        stakeholderId: null,
        description: "Complete cases, manage evidence, and control stakeholder access.",
      }];
    }

    const stakeholder = getStakeholder(membership.membership.entityId);
    const authority = getAuthority(stakeholder?.authorityId);
    if (!stakeholder || !authority) return [];
    const stakeholderContext: AccountContext = {
      id: `${membership.id}:stakeholder:${stakeholder.id}`,
      authenticatableUserId: membership.id,
      name: membership.name,
      email: membership.email,
      authorityId: authority.id,
      authorityName: authority.name,
      role,
      entityType: membership.membership.entityType,
      entityId: stakeholder.id,
      entityName: stakeholder.name,
      membershipRole: membership.membershipRole,
      participantId: null,
      stakeholderId: stakeholder.id,
      description: "Review participant case that has been granted to this stakeholder account.",
    };
    const helperGrantCount = db.getActiveHelperAccessGrants(stakeholder.id).length;
    if (helperGrantCount === 0) return [stakeholderContext];
    return [
      stakeholderContext,
      {
        ...stakeholderContext,
        id: `${membership.id}:helper:${stakeholder.id}`,
        role: "helper",
        entityType: "helper",
        description: `Assist ${helperGrantCount} participant workspace${helperGrantCount === 1 ? "" : "s"} through active service-provider grants.`,
      },
    ];
  });
}

function buildAdminResources() {
  const terminology = authorityTerminology[0];
  return [
    { name: terminologyTitle(terminology, "participant", true), path: "/admin/participants", Icon: Building2, count: `${participants.length} in scope` },
    { name: terminologyTitle(terminology, "stakeholder", true), path: "/admin/stakeholders", Icon: UserRoundCheck, count: `${stakeholders.length} in scope` },
    { name: terminologyTitle(terminology, "caseTemplate", true), path: "/admin/case-templates", Icon: ShieldCheck, count: `${caseTemplates.length} configured` },
    { name: "Task types", path: "/admin/task-types", Icon: ClipboardCheck, count: `${taskTypes.length} available` },
    { name: "Users", path: "/admin/users", Icon: Users, count: `${authenticatableUsers.length} users` },
    { name: "Parameters", path: "/admin/parameters", Icon: KeyRound, count: "Terminology" },
  ];
}

function buildSearchItems(): SearchItem[] {
  return [
    ...consoleApps.map((app) => ({
      title: app.name,
      description: app.description,
      path: app.path,
      group: "Apps",
      audience: app.audience,
    })),
    ...participants.map((participant) => ({
      title: participant.name,
      description: `${participant.type} - ${participant.openCases} open case`,
      path: `/admin/participants/${participant.id}`,
      group: "Participants",
      audience: ["authority-admin", "stakeholder"] as UserRole[],
    })),
    ...participants.map((participant) => ({
      title: participant.name,
      description: `${participant.type} service-provider client workspace`,
      path: `/helper/participants/${participant.id}`,
      group: "Participants",
      audience: ["helper"] as UserRole[],
    })),
    ...stakeholders.map((stakeholder) => ({
      title: stakeholder.name,
      description: `${stakeholder.visibleParticipants} active participant access record`,
      path: "/admin/stakeholders",
      group: "Stakeholders",
      audience: ["authority-admin"] as UserRole[],
    })),
    ...caseTemplates.map((template) => ({
      title: template.name,
      description: `${template.status.toLowerCase()} Case template with ${template.taskCount} items`,
      path: "/admin/case-templates",
      group: "Case templates",
      audience: ["authority-admin"] as UserRole[],
    })),
    ...cases.map((caseRecord) => {
      const participant = participants.find((item) => item.id === caseRecord.participantId);
      return {
        title: `${caseRecord.title} - ${participant?.name ?? "Unknown participant"}`,
        description: `${caseRecord.completedTasks}/${caseRecord.totalTasks} case tasks complete`,
        path: `/cases/${caseRecord.id}`,
        group: "Cases",
        audience: ["participant", "helper"] as UserRole[],
      };
    }),
    ...cases.flatMap((caseRecord) => caseRecord.tasks.map((task) => ({
      title: task.title,
      description: task.type,
      path: `/cases/${caseRecord.id}/tasks/${task.id}`,
      group: "Case tasks",
      audience: ["participant", "helper"] as UserRole[],
    }))),
  ];
}

export let authorities: Authority[] = [];
export let authorityTerminology: AuthorityTerminology[] = [];
export let taskTypes: TaskType[] = [];
export let caseTemplates: CaseTemplate[] = [];
export let cases: CaseRecord[] = [];
export let stakeholders: Stakeholder[] = [];
export let participants: Participant[] = [];
export let accessGrants: AccessGrant[] = [];
export let stakeholderReviews: StakeholderReview[] = [];
export let requestsForInformation: RequestForInformation[] = [];
export let participantSuppliers: ParticipantSupplier[] = [];
export let authenticatableUsers: AuthenticatableUser[] = [];
export let userIdentities: UserIdentity[] = [];
export let accountContexts: AccountContext[] = [];
export let adminResources: ReturnType<typeof buildAdminResources> = [];
export let searchItems: SearchItem[] = [];

export function refreshConsoleViewModels() {
  authorities = buildAuthorities();
  authorityTerminology = buildAuthorityTerminology();
  taskTypes = buildTaskTypes();
  caseTemplates = buildCaseTemplates();
  cases = buildCaseRecords();
  participantSuppliers = buildParticipantSuppliers();
  stakeholders = buildStakeholders();
  participants = buildParticipants(cases);
  accessGrants = buildAccessGrants();
  stakeholderReviews = buildStakeholderReviews();
  requestsForInformation = buildRequestsForInformation();
  authenticatableUsers = buildAuthenticatableUsers();
  userIdentities = buildUserIdentities();
  accountContexts = buildAccountContexts();
  adminResources = buildAdminResources();
  searchItems = buildSearchItems();
}

refreshConsoleViewModels();

export function getConsoleAppsForRole(role: UserRole) {
  return consoleApps.filter((app) => app.audience.includes(role));
}

export function getDefaultConsolePath(role: UserRole) {
  if (role === "helper") return "/helper";
  if (role === "stakeholder") return "/stakeholder";
  if (role === "authority-admin") return "/admin";
  return "/cases";
}

export function getDefaultConsolePathForUser(user: AuthenticatedUser) {
  return getDefaultConsolePath(user.role);
}

export function getAccountContextsForUser(userAccountId: string | null | undefined) {
  if (!userAccountId) return [];
  return accountContexts.filter((context) => context.authenticatableUserId === userAccountId);
}

export function getAccountContext(id: string | null | undefined) {
  return accountContexts.find((context) => context.id === id);
}

export function getUserIdentity(id: string | null | undefined) {
  return userIdentities.find((identity) => identity.id === id);
}

export function getSearchItemsForUser(user: AuthenticatedUser) {
  const scopedParticipants = getScopedParticipants(user);
  const scopedCases = getScopedCases(user);
  const scopedStakeholders = getStakeholdersForAuthority(user.authorityId ?? undefined);
  const scopedTemplates = getCaseTemplatesForAuthority(user.authorityId ?? undefined);
  const scopedParticipantIds = new Set(scopedParticipants.map((participant) => participant.id));
  const scopedCaseIds = new Set(scopedCases.map((caseRecord) => caseRecord.id));

  return searchItems.filter((item) => {
    if (!item.audience.includes(user.role)) return false;
    if (item.group === "Participants") {
      return scopedParticipants.some((participant) => item.path.endsWith(participant.id));
    }
    if (item.group === "Stakeholders") {
      return scopedStakeholders.some((stakeholder) => item.title === stakeholder.name);
    }
    if (item.group === "Case templates") {
      return scopedTemplates.some((template) => item.title === template.name);
    }
    if (item.group === "Cases") {
      return scopedCases.some((caseRecord) => item.path.endsWith(caseRecord.id));
    }
    if (item.group === "Case tasks") {
      return scopedCaseIds.has(item.path.split("/")[2] ?? "");
    }
    return true;
  }).filter((item) => item.group !== "Participants" || scopedParticipantIds.size > 0);
}

export function getParticipant(id: string | undefined) {
  return participants.find((participant) => participant.id === id);
}

export function getAuthority(id: string | undefined) {
  return authorities.find((authority) => authority.id === id);
}

export function getAuthorityTerminology(id: string | undefined) {
  return authorityTerminology.find((terminology) => terminology.authorityId === id) ?? {
    authorityId: id ?? "default",
    labels: defaultTerminologyLabels,
  };
}

export function getTerminologyForUser(user: AuthenticatedUser) {
  return getAuthorityTerminology(user.authorityId ?? undefined);
}

export function getStakeholder(id: string | undefined) {
  return stakeholders.find((stakeholder) => stakeholder.id === id);
}

export function getAuthenticatableUsersForEntity(membership: AuthenticatableUserMembership | null) {
  if (!membership) return [];
  return authenticatableUsers.filter(
    (user) =>
      user.membership.entityType === membership.entityType &&
      user.membership.entityId === membership.entityId,
  );
}

export function getParticipantsForAuthority(authorityId: string | undefined) {
  return participants.filter((participant) => participant.authorityId === authorityId);
}

export function getStakeholdersForAuthority(authorityId: string | undefined) {
  return stakeholders.filter((stakeholder) => stakeholder.authorityId === authorityId);
}

export function getAccessGrantsForParticipant(participantId: string | undefined) {
  if (!participantId) return [];
  return accessGrants.filter((grant) => grant.participantId === participantId);
}

export function getParticipantSuppliersForParticipant(participantId: string | undefined) {
  if (!participantId) return [];
  return participantSuppliers.filter((relationship) => relationship.participantId === participantId);
}

export function getGrantableStakeholdersForParticipant(participantId: string | undefined) {
  const participant = getParticipant(participantId);
  if (!participant) return [];
  return stakeholders.filter((stakeholder) => stakeholder.authorityId === participant.authorityId);
}

export function grantAllowsHelperEdit(grant: AccessGrant | undefined) {
  return grant?.permissionLevel === "CREATE_AND_EDIT" || grant?.permissionLevel === "ADMINISTER_GRANTS";
}

export function grantAllowsGrantAdministration(grant: AccessGrant | undefined) {
  return grant?.permissionLevel === "ADMINISTER_GRANTS";
}

export function getActiveHelperGrantsForUser(user: AuthenticatedUser) {
  const helperStakeholderId =
    user.stakeholderId ??
    (user.accountContextType === "helper" ? user.accountContextEntityId : null) ??
    undefined;
  if (!helperStakeholderId) return [];
  return accessGrants.filter(
    (grant) =>
      grant.granteeType === "HELPER" &&
      grant.granteeStakeholderId === helperStakeholderId &&
      grant.status === "ACTIVE",
  );
}

function grantAllowsCaseVisibility(grant: AccessGrant, caseRecord: CaseRecord) {
  if (grant.status !== "ACTIVE") return false;
  if (grant.participantId !== caseRecord.participantId) return false;
  if (grant.dataScopeType === "PARTICIPANT_WORKSPACE") return true;
  if (grant.dataScopeType === "CASE") return grant.dataScopeId === caseRecord.id;
  if (grant.dataScopeType === "CASE_TASK") return caseRecord.tasks.some((task) => task.id === grant.dataScopeId);
  if (grant.dataScopeType === "PARTICIPANT_SUPPLIER") return caseRecord.participantSupplierId === grant.dataScopeId;
  if (grant.dataScopeType === "EVIDENCE_METADATA") return true;
  return false;
}

function grantAllowsParticipantSupplierVisibility(grant: AccessGrant, relationship: ParticipantSupplier) {
  if (grant.status !== "ACTIVE") return false;
  if (grant.participantId !== relationship.participantId) return false;
  if (grant.dataScopeType === "PARTICIPANT_WORKSPACE") return true;
  if (grant.dataScopeType === "PARTICIPANT_SUPPLIER") return grant.dataScopeId === relationship.id;
  return relationship.linkedCases.some((caseRecord) => grantAllowsCaseVisibility(grant, caseRecord));
}

export function getHelperGrantForParticipant(user: AuthenticatedUser, participantId: string | undefined) {
  if (!participantId || user.role !== "helper") return undefined;
  return getActiveHelperGrantsForUser(user).find((grant) => grant.participantId === participantId);
}

export function getHelperClientWorkspaces(user: AuthenticatedUser): HelperClientWorkspace[] {
  if (user.role !== "helper") return [];
  return getActiveHelperGrantsForUser(user)
    .map((grant) => {
      const participant = getParticipant(grant.participantId);
      if (!participant) return null;
      const participantCases = cases.filter((caseRecord) => grantAllowsCaseVisibility(grant, caseRecord));
      const participantCaseIds = new Set(participantCases.map((caseRecord) => caseRecord.id));
      const participantSuppliersForParticipant = participantSuppliers.filter((relationship) => grantAllowsParticipantSupplierVisibility(grant, relationship));
      const openRequests = requestsForInformation.filter(
        (request) =>
          request.participantId === participant.id &&
          (!request.caseId || participantCaseIds.has(request.caseId)) &&
          (request.status === "OPEN" || request.status === "IN_PROGRESS"),
      ).length;
      return {
        participant,
        grant,
        cases: participantCases,
        participantSuppliers: participantSuppliersForParticipant,
        openRequests,
        canEdit: grantAllowsHelperEdit(grant),
        canAdministerGrants: grantAllowsGrantAdministration(grant),
      };
    })
    .filter((workspace): workspace is HelperClientWorkspace => Boolean(workspace));
}

export function getStakeholderReviewForCase(user: AuthenticatedUser, caseId: string | undefined) {
  if (!caseId || user.role !== "stakeholder") return undefined;
  const stakeholderId =
    user.stakeholderId ??
    (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
    undefined;
  if (!stakeholderId) return undefined;
  return stakeholderReviews.find((review) => review.stakeholderId === stakeholderId && review.caseId === caseId);
}

export function getRequestsForCase(caseId: string | undefined, user?: AuthenticatedUser) {
  if (!caseId) return [];
  const caseRequests = requestsForInformation.filter((request) => request.caseId === caseId);
  if (!user) return caseRequests;
  if (user.role === "participant") {
    return caseRequests.filter((request) => request.participantId === user.participantId);
  }
  if (user.role === "stakeholder") {
    const stakeholderId =
      user.stakeholderId ??
      (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
      undefined;
    return caseRequests.filter((request) => request.stakeholderId === stakeholderId);
  }
  if (user.role === "helper") {
    const scopedCaseIds = new Set(getScopedCases(user).map((caseRecord) => caseRecord.id));
    return caseRequests.filter((request) => request.caseId ? scopedCaseIds.has(request.caseId) : false);
  }
  return [];
}

export function getRequestsForTask(taskId: string | undefined, user?: AuthenticatedUser) {
  if (!taskId) return [];
  return requestsForInformation
    .filter((request) => request.caseTaskId === taskId)
    .filter((request) => {
      if (!user) return true;
      if (user.role === "participant") return request.participantId === user.participantId;
      if (user.role === "stakeholder") {
        const stakeholderId =
          user.stakeholderId ??
          (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
          undefined;
        return request.stakeholderId === stakeholderId;
      }
      if (user.role === "helper") {
        const scopedCaseIds = new Set(getScopedCases(user).map((caseRecord) => caseRecord.id));
        return request.caseId ? scopedCaseIds.has(request.caseId) : false;
      }
      return false;
    });
}

export function getRequestsForParticipant(participantId: string | undefined, user?: AuthenticatedUser) {
  if (!participantId) return [];
  const participantRequests = requestsForInformation.filter((request) => request.participantId === participantId);
  if (!user) return participantRequests;
  if (user.role === "participant") return participantRequests.filter((request) => request.participantId === user.participantId);
  if (user.role === "stakeholder") {
    const stakeholderId =
      user.stakeholderId ??
      (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
      undefined;
    return participantRequests.filter((request) => request.stakeholderId === stakeholderId);
  }
  if (user.role === "helper") {
    const scopedCaseIds = new Set(getScopedCases(user).map((caseRecord) => caseRecord.id));
    return participantRequests.filter((request) => request.caseId ? scopedCaseIds.has(request.caseId) : false);
  }
  return [];
}

export function getCaseTemplatesForAuthority(authorityId: string | undefined) {
  return caseTemplates.filter((template) => template.authorityId === authorityId);
}

export function getCaseTemplate(id: string | undefined) {
  return caseTemplates.find((template) => template.id === id);
}

export function getCaseTemplateTasks(caseTemplateId: string | undefined): CaseTemplateTask[] {
  if (!caseTemplateId) return [];
  return db.caseTemplateTasks
    .map((task) => task.toDto())
    .filter((task) => task.caseTemplateId === caseTemplateId)
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((task) => {
      const taskType = taskTypes.find((item) => item.id === task.taskTypeId);
      return {
        id: task.id,
        caseTemplateId: task.caseTemplateId,
        taskTypeId: task.taskTypeId,
        taskTypeName: taskType?.name ?? "Task type",
        title: task.title,
        description: task.description,
        due: typeof task.parametersJson.due === "string" ? task.parametersJson.due : "No due date",
        sortOrder: task.sortOrder,
        status: task.status,
        createdAfterPublish: task.createdAfterPublish,
        withdrawnReason: task.withdrawnReason,
        withdrawnAt: task.withdrawnAt,
        withdrawnByUserId: task.withdrawnByUserId,
      };
    });
}

export function getCaseTemplateParticipants(caseTemplateId: string | undefined): CaseTemplateParticipant[] {
  if (!caseTemplateId) return [];
  return db.caseTemplateParticipants
    .map((assignment) => assignment.toDto())
    .filter((assignment) => assignment.caseTemplateId === caseTemplateId)
    .map((assignment) => {
      const participant = getParticipant(assignment.participantId);
      return {
        id: assignment.id,
        caseTemplateId: assignment.caseTemplateId,
        participantId: assignment.participantId,
        participantName: participant?.name ?? "Unknown participant",
        participantType: participant?.type ?? "Participant",
        status: assignment.status,
        caseId: assignment.caseId,
        exemptionReason: assignment.exemptionReason,
      };
    });
}

export function getScopedParticipants(user: AuthenticatedUser) {
  if (!user.authorityId) return [];
  const authorityParticipants = getParticipantsForAuthority(user.authorityId);
  if (user.role === "authority-admin") return authorityParticipants;
  if (user.role === "participant") {
    return authorityParticipants.filter((participant) => participant.id === user.participantId);
  }
  if (user.role === "helper") {
    const helperParticipantIds = new Set(getActiveHelperGrantsForUser(user).map((grant) => grant.participantId));
    return authorityParticipants.filter((participant) => helperParticipantIds.has(participant.id));
  }

  const stakeholderId =
    user.stakeholderId ??
    (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
    authenticatableUsers.find(
      (candidate) =>
        candidate.id === user.authenticatableUserId &&
        candidate.membership.entityType === "stakeholder",
    )?.membership.entityId;
  if (!stakeholderId) return [];
  const visibleParticipantIds = new Set(
    db.getActiveAccessGrantsForStakeholder(stakeholderId)
      .filter((grant) => grant.granteeType === "STAKEHOLDER")
      .map((grant) => grant.participantId),
  );
  return authorityParticipants.filter((participant) => visibleParticipantIds.has(participant.id));
}

export function getScopedCases(user: AuthenticatedUser) {
  if (user.role === "authority-admin") return [];
  if (user.role === "participant") {
    const scopedParticipantIds = new Set(getScopedParticipants(user).map((participant) => participant.id));
    return cases.filter((caseRecord) => scopedParticipantIds.has(caseRecord.participantId));
  }
  if (user.role === "helper") {
    const grants = getActiveHelperGrantsForUser(user);
    return cases.filter((caseRecord) => grants.some((grant) => grantAllowsCaseVisibility(grant, caseRecord)));
  }

  const stakeholderId =
    user.stakeholderId ??
    (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
    undefined;
  if (!stakeholderId) return [];
  const grants = db.getActiveAccessGrantsForStakeholder(stakeholderId)
    .filter((grant) => grant.granteeType === "STAKEHOLDER")
    .map((grant) => accessGrants.find((viewGrant) => viewGrant.id === grant.id))
    .filter((grant): grant is AccessGrant => Boolean(grant));
  return cases.filter((caseRecord) => grants.some((grant) => grantAllowsCaseVisibility(grant, caseRecord)));
}

export function getScopedParticipantSuppliers(user: AuthenticatedUser) {
  if (user.role === "authority-admin") return [];
  if (user.role === "participant") {
    return getParticipantSuppliersForParticipant(user.participantId ?? undefined);
  }
  if (user.role === "helper") {
    const grants = getActiveHelperGrantsForUser(user);
    return participantSuppliers.filter((relationship) => grants.some((grant) => grantAllowsParticipantSupplierVisibility(grant, relationship)));
  }
  const stakeholderId =
    user.stakeholderId ??
    (user.accountContextType === "stakeholder" ? user.accountContextEntityId : null) ??
    undefined;
  if (!stakeholderId) return [];
  const grants = db.getActiveAccessGrantsForStakeholder(stakeholderId)
    .filter((grant) => grant.granteeType === "STAKEHOLDER")
    .map((grant) => accessGrants.find((viewGrant) => viewGrant.id === grant.id))
    .filter((grant): grant is AccessGrant => Boolean(grant));
  return participantSuppliers.filter((relationship) => grants.some((grant) => grantAllowsParticipantSupplierVisibility(grant, relationship)));
}

export function getCase(id: string | undefined) {
  return cases.find((caseRecord) => caseRecord.id === id);
}

export function getTask(caseId: string | undefined, taskId: string | undefined) {
  return getCase(caseId)?.tasks.find((task) => task.id === taskId);
}
