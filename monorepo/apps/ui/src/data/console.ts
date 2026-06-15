import {
  BadgeCheck,
  Building2,
  Car,
  ClipboardCheck,
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
import type { AuthenticatedUser, UserRole } from "@/context/AuthContext";

export type EntityStatus = "ACTIVE" | "INACTIVE";
export type InviteStatus = EntityStatus | "INVITED";
export type UserKind = "SYSTEM_OWNER" | "AUTHORITY" | "PARTICIPANT" | "STAKEHOLDER";
export type MembershipRole = "ADMIN" | "MEMBER";
export type PartyType = "ORGANISATION" | "PERSON";
export type AccessStatus = "APPROVED" | "SUSPENDED" | "REVOKED";
export type TaskTypeStatus = "ACTIVE" | "DEPRECATED";
export type CaseTemplateStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type TemplateParticipantStatus = "REQUIRED" | "EXEMPT";
export type CaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CLOSED";
export type CaseTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "PASSED" | "FAILED" | "WITHDRAWN";
export type UserAccountStatus = "ACTIVE" | "DISABLED";
export type Status = "complete" | "in-progress" | "attention" | "not-started";

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
export class ParticipantEntity extends DomainEntity<ParticipantDto> {}
export class StakeholderEntity extends DomainEntity<StakeholderDto> {}
export class UserAccountEntity extends DomainEntity<UserAccountDto> {}
export class SystemOwnerUserEntity extends DomainEntity<MembershipDto> {}
export class AuthorityUserEntity extends DomainEntity<MembershipDto> {}
export class ParticipantUserEntity extends DomainEntity<MembershipDto> {}
export class StakeholderUserEntity extends DomainEntity<MembershipDto> {}
export class StakeholderParticipantAccessEntity extends DomainEntity<StakeholderParticipantAccessDto> {}
export class TaskTypeEntity extends DomainEntity<TaskTypeDto> {}
export class CaseTemplateEntity extends DomainEntity<CaseTemplateDto> {}
export class CaseTemplateTaskEntity extends DomainEntity<CaseTemplateTaskDto> {}
export class CaseTemplateParticipantEntity extends DomainEntity<CaseTemplateParticipantDto> {}
export class CaseEntity extends DomainEntity<CaseDto> {}
export class CaseTaskEntity extends DomainEntity<CaseTaskDto> {}

export type AuthenticatableUserMembership =
  | { entityType: "authority"; entityId: AuthorityId }
  | { entityType: "participant"; entityId: ParticipantId }
  | { entityType: "stakeholder"; entityId: StakeholderId };

export type ConsoleApp = {
  id: "administration" | "case-management" | "stakeholder-portal";
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

export type AuthenticatableUser = {
  id: UserAccountId;
  name: string;
  email: string;
  userKind: UserKind;
  membership: AuthenticatableUserMembership;
  membershipRole: MembershipRole;
};

export type Task = {
  id: CaseTaskId;
  title: string;
  type: string;
  status: Status;
  domainStatus: CaseTaskStatus;
  due: string;
  description: string;
  Icon: typeof ImageUp;
};

export type CaseRecord = {
  id: CaseRecordId;
  title: string;
  participantId: ParticipantId;
  authorityId: AuthorityId;
  caseTemplateId: CaseTemplateId;
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

export type SearchItem = {
  title: string;
  description: string;
  path: string;
  group: string;
  audience: UserRole[];
};

const now = "2026-06-15T09:00:00.000Z";
const created = "2026-01-03T09:00:00.000Z";

function base(id: string): BaseDto {
  return { id, createdAt: created, updatedAt: now };
}

const iconByTaskCode: Record<string, typeof ImageUp> = {
  UPLOAD_DOCUMENT: ImageUp,
  UPLOAD_DRIVING_LICENCE: KeyRound,
  QUESTIONNAIRE: FileQuestion,
  UPLOAD_POLICY: FileSignature,
  VIDEO_ATTESTATION: Video,
  GPS_EVIDENCE: Landmark,
  DIGITAL_SIGNATURE: FileSignature,
  PAYMENT_CONFIRMATION: ReceiptText,
  ADDRESS_PROOF: Building2,
  VEHICLE_DOCUMENT: Car,
};

function uiTaskStatus(status: CaseTaskStatus): Status {
  if (status === "PASSED" || status === "SUBMITTED") return "complete";
  if (status === "FAILED") return "attention";
  if (status === "IN_PROGRESS") return "in-progress";
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
      name: "Northstar Trade Association",
      description: "An authority managing annual verification for member IT platform providers.",
      status: "ACTIVE",
    }),
    new AuthorityEntity({
      ...base("cobalt-home-services"),
      systemOwnerId: "all-checks-out",
      name: "Cobalt Home Services",
      description: "A service company assigning field work and exposing completed outcomes to customers.",
      status: "ACTIVE",
    }),
    new AuthorityEntity({
      ...base("pinebridge-council"),
      systemOwnerId: "all-checks-out",
      name: "Pinebridge Borough Council",
      description: "A council managing resident permit renewal cases.",
      status: "ACTIVE",
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
      ...base("cobalt-field-team"),
      authorityId: "cobalt-home-services",
      participantType: "ORGANISATION",
      displayName: "Cobalt Field Engineering Team",
      status: "ACTIVE",
    }),
    new ParticipantEntity({
      ...base("mrs-jones"),
      authorityId: "pinebridge-council",
      participantType: "PERSON",
      displayName: "Mrs Jones",
      status: "ACTIVE",
    }),
  ];

  readonly stakeholders = [
    new StakeholderEntity({
      ...base("supplier-stakeholders"),
      authorityId: "northstar-association",
      stakeholderType: "ORGANISATION",
      displayName: "Supplier stakeholders",
      status: "ACTIVE",
    }),
    new StakeholderEntity({
      ...base("household-stakeholders"),
      authorityId: "cobalt-home-services",
      stakeholderType: "PERSON",
      displayName: "Household stakeholders",
      status: "ACTIVE",
    }),
    new StakeholderEntity({
      ...base("internal-compliance-team"),
      authorityId: "pinebridge-council",
      stakeholderType: "ORGANISATION",
      displayName: "Internal compliance team",
      status: "ACTIVE",
    }),
  ];

  readonly userAccounts = [
    this.user("user-jonathan-price", "Jonathan Price", "jonathan.price@northstar.example", "AUTHORITY"),
    this.user("user-amara-singh", "Amara Singh", "amara.singh@northstar.example", "AUTHORITY"),
    this.user("user-hannah-cole", "Hannah Cole", "hannah.cole@cobalt.example", "AUTHORITY"),
    this.user("user-marcus-hill", "Marcus Hill", "marcus.hill@cobalt.example", "AUTHORITY"),
    this.user("user-eleanor-brooks", "Eleanor Brooks", "eleanor.brooks@pinebridge.example", "AUTHORITY"),
    this.user("user-owen-clarke", "Owen Clarke", "owen.clarke@pinebridge.example", "AUTHORITY"),
    this.user("user-aisha-khan", "Aisha Khan", "aisha.khan@northstar-cloud.example", "PARTICIPANT"),
    this.user("user-michael-reeves", "Michael Reeves", "michael.reeves@northstar-cloud.example", "PARTICIPANT"),
    this.user("user-lewis-green", "Lewis Green", "lewis.green@cobalt-field.example", "PARTICIPANT"),
    this.user("user-amelia-wright", "Amelia Wright", "amelia.wright@cobalt-field.example", "PARTICIPANT"),
    this.user("user-margaret-jones", "Margaret Jones", "margaret.jones@example.net", "PARTICIPANT"),
    this.user("user-david-jones", "David Jones", "david.jones@example.net", "PARTICIPANT"),
    this.user("user-rachel-morgan", "Rachel Morgan", "rachel.morgan@supplier-stakeholder.example", "STAKEHOLDER"),
    this.user("user-peter-walsh", "Peter Walsh", "peter.walsh@supplier-stakeholder.example", "STAKEHOLDER"),
    this.user("user-sophie-turner", "Sophie Turner", "sophie.turner@household.example", "STAKEHOLDER"),
    this.user("user-benjamin-foster", "Benjamin Foster", "benjamin.foster@household.example", "STAKEHOLDER"),
    this.user("user-priya-shah", "Priya Shah", "priya.shah@pinebridge-compliance.example", "STAKEHOLDER"),
    this.user("user-george-evans", "George Evans", "george.evans@pinebridge-compliance.example", "STAKEHOLDER"),
  ];

  readonly authorityUsers = [
    this.membership("authority-user-jonathan-price", "northstar-association", "user-jonathan-price", "ADMIN", AuthorityUserEntity),
    this.membership("authority-user-amara-singh", "northstar-association", "user-amara-singh", "MEMBER", AuthorityUserEntity),
    this.membership("authority-user-hannah-cole", "cobalt-home-services", "user-hannah-cole", "ADMIN", AuthorityUserEntity),
    this.membership("authority-user-marcus-hill", "cobalt-home-services", "user-marcus-hill", "MEMBER", AuthorityUserEntity),
    this.membership("authority-user-eleanor-brooks", "pinebridge-council", "user-eleanor-brooks", "ADMIN", AuthorityUserEntity),
    this.membership("authority-user-owen-clarke", "pinebridge-council", "user-owen-clarke", "MEMBER", AuthorityUserEntity),
  ];

  readonly participantUsers = [
    this.membership("participant-user-aisha-khan", "northstar-cloud", "user-aisha-khan", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-michael-reeves", "northstar-cloud", "user-michael-reeves", "MEMBER", ParticipantUserEntity),
    this.membership("participant-user-lewis-green", "cobalt-field-team", "user-lewis-green", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-amelia-wright", "cobalt-field-team", "user-amelia-wright", "MEMBER", ParticipantUserEntity),
    this.membership("participant-user-margaret-jones", "mrs-jones", "user-margaret-jones", "ADMIN", ParticipantUserEntity),
    this.membership("participant-user-david-jones", "mrs-jones", "user-david-jones", "MEMBER", ParticipantUserEntity),
  ];

  readonly stakeholderUsers = [
    this.membership("stakeholder-user-rachel-morgan", "supplier-stakeholders", "user-rachel-morgan", "ADMIN", StakeholderUserEntity),
    this.membership("stakeholder-user-peter-walsh", "supplier-stakeholders", "user-peter-walsh", "MEMBER", StakeholderUserEntity),
    this.membership("stakeholder-user-sophie-turner", "household-stakeholders", "user-sophie-turner", "ADMIN", StakeholderUserEntity),
    this.membership("stakeholder-user-benjamin-foster", "household-stakeholders", "user-benjamin-foster", "MEMBER", StakeholderUserEntity),
    this.membership("stakeholder-user-priya-shah", "internal-compliance-team", "user-priya-shah", "ADMIN", StakeholderUserEntity),
    this.membership("stakeholder-user-george-evans", "internal-compliance-team", "user-george-evans", "MEMBER", StakeholderUserEntity),
  ];

  readonly stakeholderParticipantAccess = [
    this.access("access-northstar-suppliers", "supplier-stakeholders", "northstar-cloud", "user-jonathan-price"),
    this.access("access-cobalt-household", "household-stakeholders", "cobalt-field-team", "user-hannah-cole"),
    this.access("access-pinebridge-compliance", "internal-compliance-team", "mrs-jones", "user-eleanor-brooks"),
  ];

  readonly taskTypes = [
    this.taskType("task-type-upload-document", "UPLOAD_DOCUMENT", "Upload document", "Upload a supporting document or image."),
    this.taskType("task-type-driving-licence", "UPLOAD_DRIVING_LICENCE", "Driving licence upload", "Upload and review a driving licence image."),
    this.taskType("task-type-questionnaire", "QUESTIONNAIRE", "Questionnaire", "Answer fixed or conditional questions."),
    this.taskType("task-type-upload-policy", "UPLOAD_POLICY", "Upload policy", "Provide a policy document and declaration."),
    this.taskType("task-type-video", "VIDEO_ATTESTATION", "Video attestation", "Upload a short attestation video."),
    this.taskType("task-type-gps", "GPS_EVIDENCE", "GPS evidence", "Record location and timestamp evidence."),
    this.taskType("task-type-signature", "DIGITAL_SIGNATURE", "Digital signature", "Capture an attestation or stakeholder signature."),
    this.taskType("task-type-payment", "PAYMENT_CONFIRMATION", "Payment confirmation", "Confirm a payment or billing event."),
    this.taskType("task-type-address", "ADDRESS_PROOF", "Address proof", "Provide evidence of residential address."),
    this.taskType("task-type-vehicle", "VEHICLE_DOCUMENT", "Vehicle document", "Upload current vehicle documents."),
  ];

  readonly caseTemplates = [
    this.caseTemplate("template-northstar-verification", "northstar-association", "Provider annual verification", "Annual compliance case", "PUBLISHED", "user-jonathan-price"),
    this.caseTemplate("template-cobalt-service-visit", "cobalt-home-services", "Emergency plumbing visit", "Service visit", "PUBLISHED", "user-hannah-cole"),
    this.caseTemplate("template-pinebridge-permit", "pinebridge-council", "Resident permit renewal", "Annual permit renewal", "PUBLISHED", "user-eleanor-brooks"),
  ];

  readonly caseTemplateTasks = [
    this.templateTask("template-task-photo-identity", "template-northstar-verification", "task-type-upload-document", "Photo identity evidence", "Upload identity images and review the generated tags before submission.", 1, { due: "18 Jun 2026" }),
    this.templateTask("template-task-driving-licence", "template-northstar-verification", "task-type-driving-licence", "Driving licence upload", "Provide a current driving licence image for manual inspection.", 2, { due: "20 Jun 2026" }),
    this.templateTask("template-task-video-attestation", "template-northstar-verification", "task-type-video", "Operational attestation", "Upload a short attestation video for authority reviewers.", 3, { due: "24 Jun 2026" }),
    this.templateTask("template-task-security-form", "template-northstar-verification", "task-type-upload-policy", "Controls declaration form", "Complete controls, confirm declarations, and digitally sign the form.", 4, { due: "21 Jun 2026" }),
    this.templateTask("template-task-fixed-questions", "template-northstar-verification", "task-type-questionnaire", "Fixed case questions", "Answer the authority's fixed questions for this case template.", 5, { due: "16 Jun 2026" }),
    this.templateTask("template-task-conditional-questions", "template-northstar-verification", "task-type-questionnaire", "Conditional question path", "Respond to branching questions based on previous case answers.", 6, { due: "16 Jun 2026" }),
    this.templateTask("template-task-stakeholder-preview", "template-northstar-verification", "task-type-signature", "Stakeholder preview", "Preview what stakeholders can see about the case outcome.", 7, { due: "26 Jun 2026" }),
    this.templateTask("template-task-arrival-location", "template-cobalt-service-visit", "task-type-gps", "Arrival location snapshot", "Record visit arrival time and location for the stakeholder service record.", 1, { due: "15 Jun 2026" }),
    this.templateTask("template-task-work-photos", "template-cobalt-service-visit", "task-type-upload-document", "Work completion photos", "Upload before and after photos so the office can approve the service visit.", 2, { due: "15 Jun 2026" }),
    this.templateTask("template-task-stakeholder-signature", "template-cobalt-service-visit", "task-type-signature", "Stakeholder sign-off", "Collect a signature from the stakeholder confirming the visit outcome.", 3, { due: "15 Jun 2026" }),
    this.templateTask("template-task-invoice-review", "template-cobalt-service-visit", "task-type-payment", "Invoice review", "Review labour, parts, and callout charges before issuing the invoice.", 4, { due: "17 Jun 2026" }),
    this.templateTask("template-task-vehicle-documents", "template-pinebridge-permit", "task-type-vehicle", "Vehicle documents", "Upload valid vehicle documents for the annual renewal case.", 1, { due: "30 May 2026" }),
    this.templateTask("template-task-address-proof", "template-pinebridge-permit", "task-type-address", "Proof of residential address", "Provide evidence of residency inside the permit area.", 2, { due: "30 May 2026" }),
    this.templateTask("template-task-fee-payment", "template-pinebridge-permit", "task-type-payment", "Renewal fee payment", "Confirm payment before the council reviewer approves the renewal.", 3, { due: "31 May 2026" }),
  ];

  readonly cases = [
    this.caseRecord("case-2026-northstar", "northstar-association", "template-northstar-verification", "northstar-cloud", "IN_PROGRESS", null, null),
    this.caseRecord("case-2026-cobalt", "cobalt-home-services", "template-cobalt-service-visit", "cobalt-field-team", "SUBMITTED", "2026-06-15T12:30:00.000Z", null),
    this.caseRecord("case-2025-pinebridge", "pinebridge-council", "template-pinebridge-permit", "mrs-jones", "APPROVED", "2026-05-31T14:00:00.000Z", "2026-06-10T09:30:00.000Z"),
  ];

  readonly caseTemplateParticipants = [
    this.templateParticipant("template-participant-northstar", "template-northstar-verification", "northstar-cloud", "case-2026-northstar"),
    this.templateParticipant("template-participant-cobalt", "template-cobalt-service-visit", "cobalt-field-team", "case-2026-cobalt"),
    this.templateParticipant("template-participant-pinebridge", "template-pinebridge-permit", "mrs-jones", "case-2025-pinebridge"),
  ];

  readonly caseTasks = [
    this.caseTask("case-task-photo-identity", "case-2026-northstar", "template-task-photo-identity", "PASSED"),
    this.caseTask("case-task-driving-licence", "case-2026-northstar", "template-task-driving-licence", "IN_PROGRESS"),
    this.caseTask("case-task-video-attestation", "case-2026-northstar", "template-task-video-attestation", "NOT_STARTED"),
    this.caseTask("case-task-security-form", "case-2026-northstar", "template-task-security-form", "FAILED"),
    this.caseTask("case-task-fixed-questions", "case-2026-northstar", "template-task-fixed-questions", "PASSED"),
    this.caseTask("case-task-conditional-questions", "case-2026-northstar", "template-task-conditional-questions", "PASSED"),
    this.caseTask("case-task-stakeholder-preview", "case-2026-northstar", "template-task-stakeholder-preview", "PASSED"),
    this.caseTask("case-task-arrival-location", "case-2026-cobalt", "template-task-arrival-location", "PASSED"),
    this.caseTask("case-task-work-photos", "case-2026-cobalt", "template-task-work-photos", "FAILED"),
    this.caseTask("case-task-stakeholder-signature", "case-2026-cobalt", "template-task-stakeholder-signature", "IN_PROGRESS"),
    this.caseTask("case-task-invoice-review", "case-2026-cobalt", "template-task-invoice-review", "NOT_STARTED"),
    this.caseTask("case-task-vehicle-documents", "case-2025-pinebridge", "template-task-vehicle-documents", "PASSED"),
    this.caseTask("case-task-address-proof", "case-2025-pinebridge", "template-task-address-proof", "PASSED"),
    this.caseTask("case-task-fee-payment", "case-2025-pinebridge", "template-task-fee-payment", "PASSED"),
  ];

  constructor() {
    this.assertUserKindExclusivity();
  }

  listAuthorities() {
    return this.authorities.map((authority) => authority.toDto());
  }

  getAuthority(authorityId: AuthorityId) {
    return this.authorities.find((authority) => authority.id === authorityId)?.toDto() ?? null;
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

  getAccessibleParticipantsForStakeholder(stakeholderId: StakeholderId) {
    const participantIds = new Set(
      this.getStakeholderParticipantAccess(stakeholderId)
        .filter((access) => access.status === "APPROVED")
        .map((access) => access.participantId),
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
    this.assertUserKindExclusivity();
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
    this.assertUserKindExclusivity();
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
    return access.toDto();
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
    status: CaseStatus,
    submittedAt: string | null,
    closedAt: string | null,
  ) {
    return new CaseEntity({ ...base(id), authorityId, caseTemplateId, participantId, status, submittedAt, closedAt });
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

  private assertUserKindExclusivity() {
    const membershipUserIds = [
      ...this.authorityUsers,
      ...this.participantUsers,
      ...this.stakeholderUsers,
    ].map((membership) => membership.toDto().userAccountId);

    const duplicate = membershipUserIds.find((userId, index) => membershipUserIds.indexOf(userId) !== index);
    if (duplicate) {
      throw new Error(`User ${duplicate} belongs to more than one user kind.`);
    }
  }
}

export const db = new InMemoryAllChecksOutDatabase();

export const consoleApps: ConsoleApp[] = [
  {
    id: "administration",
    name: "Administration",
    shortName: "Admin",
    description: "Manage authorities, participants, stakeholders, case templates, task types, and users.",
    path: "/admin/participants",
    accent: "bg-[#1d70b8]",
    Icon: Landmark,
    audience: ["authority-admin"],
  },
  {
    id: "case-management",
    name: "Case Management",
    shortName: "Cases",
    description: "Open cases, complete tasks, upload evidence, and track progress.",
    path: "/cases",
    accent: "bg-[#0078d4]",
    Icon: FolderKanban,
    audience: ["authority-admin", "participant"],
  },
  {
    id: "stakeholder-portal",
    name: "Stakeholder Portal",
    shortName: "Stakeholders",
    description: "View approved participant case status, completed tasks, and outcomes.",
    path: "/stakeholder",
    accent: "bg-[#00703c]",
    Icon: BadgeCheck,
    audience: ["stakeholder"],
  },
];

export const authorities: Authority[] = db.authorities.map((authority) => {
  const dto = authority.toDto();
  return {
    id: dto.id,
    name: dto.name,
    scenario:
      dto.id === "northstar-association"
        ? "Trade association verification"
        : dto.id === "cobalt-home-services"
          ? "Plumbing and electrical service visits"
          : "Resident permit renewals",
    description: dto.description,
    status: dto.status,
  };
});

export const taskTypes: TaskType[] = db.taskTypes.map((taskType) => {
  const dto = taskType.toDto();
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description,
    status: dto.status,
  };
});

export const caseTemplates: CaseTemplate[] = db.caseTemplates.map((template) => {
  const dto = template.toDto();
  const taskCount = db.caseTemplateTasks.filter((task) => task.toDto().caseTemplateId === dto.id).length;
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

function buildCaseRecords(): CaseRecord[] {
  return db.cases.map((caseEntity) => {
    const caseDto = caseEntity.toDto();
    const template = db.caseTemplates.find((item) => item.id === caseDto.caseTemplateId)?.toDto();
    const caseTasks = db.caseTasks
      .filter((caseTask) => caseTask.toDto().caseId === caseDto.id)
      .map((caseTask) => {
        const taskDto = caseTask.toDto();
        const templateTask = db.caseTemplateTasks.find((item) => item.id === taskDto.caseTemplateTaskId)?.toDto();
        const taskType = db.taskTypes.find((item) => item.id === templateTask?.taskTypeId)?.toDto();
        return {
          id: taskDto.id,
          title: templateTask?.title ?? "Task",
          type: taskType?.name ?? "Task",
          status: uiTaskStatus(taskDto.status),
          domainStatus: taskDto.status,
          due: typeof templateTask?.parametersJson.due === "string" ? templateTask.parametersJson.due : "No due date",
          description: templateTask?.description ?? "",
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
      reference:
        caseDto.id === "case-2026-northstar"
          ? "2026"
          : caseDto.id === "case-2026-cobalt"
            ? "JOB-4821"
            : "PERMIT-2026",
      caseType: template?.description ?? "Case",
      status: uiCaseStatus(caseDto.status),
      domainStatus: caseDto.status,
      completedTasks,
      totalTasks: caseTasks.length,
      risk: failedTasks > 0 ? "high" : completedTasks === caseTasks.length ? "low" : "medium",
      outcome:
        caseDto.status === "APPROVED" || caseDto.status === "CLOSED"
          ? caseDto.id === "case-2025-pinebridge" ? "Permit renewed" : "Approved"
          : failedTasks > 0
            ? "More evidence requested before the outcome is visible as approved"
            : "Participant case is in progress",
      lastActivity:
        caseDto.id === "case-2026-northstar"
          ? "Photo identity evidence uploaded"
          : caseDto.id === "case-2026-cobalt"
            ? "Reviewer requested completion photo resubmission"
            : "Permit renewal approved",
      tasks: caseTasks,
    };
  });
}

export const cases: CaseRecord[] = buildCaseRecords();

export const stakeholders: Stakeholder[] = db.stakeholders.map((stakeholder) => {
  const dto = stakeholder.toDto();
  return {
    id: dto.id,
    authorityId: dto.authorityId,
    name: dto.displayName,
    type: dto.stakeholderType === "ORGANISATION" ? "Organisation" : "Person",
    status: dto.status,
    visibleParticipants: db.stakeholderParticipantAccess.filter((access) => access.toDto().stakeholderId === dto.id).length,
  };
});

export const participants: Participant[] = db.participants.map((participant) => {
  const dto = participant.toDto();
  const participantCases = cases.filter((caseRecord) => caseRecord.participantId === dto.id);
  const access = db.stakeholderParticipantAccess.find((item) => item.toDto().participantId === dto.id)?.toDto();
  const completedTasks = participantCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);
  const totalTasks = participantCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  return {
    id: dto.id,
    authorityId: dto.authorityId,
    stakeholderId: access?.stakeholderId ?? "",
    name: dto.displayName,
    type: dto.participantType === "ORGANISATION" ? "Organisation" : "Person",
    participantRole: dto.participantType === "ORGANISATION" ? "0..many users, Admin or Member" : "Normally one user, Admin or Member",
    status: uiParticipantStatus(participantCases),
    domainStatus: dto.status,
    openCases: participantCases.filter((caseRecord) => caseRecord.status !== "closed").length,
    completedTasks,
    totalTasks,
    lastActivity: participantCases[0]?.lastActivity ?? "No case activity",
  };
});

export const authenticatableUsers: AuthenticatableUser[] = [
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

export const adminResources = [
  { name: "Participants", path: "/admin/participants", Icon: Building2, count: `${participants.length} in scope` },
  { name: "Stakeholders", path: "/admin/stakeholders", Icon: UserRoundCheck, count: `${stakeholders.length} in scope` },
  { name: "Case templates", path: "/admin/case-templates", Icon: ShieldCheck, count: `${caseTemplates.length} configured` },
  { name: "Task types", path: "/admin/task-types", Icon: ClipboardCheck, count: `${taskTypes.length} global` },
  { name: "Users", path: "/admin/users", Icon: Users, count: `${authenticatableUsers.length} users` },
];

export const searchItems: SearchItem[] = [
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
  ...stakeholders.map((stakeholder) => ({
    title: stakeholder.name,
    description: `${stakeholder.visibleParticipants} approved participant access record`,
    path: "/admin/stakeholders",
    group: "Stakeholders",
    audience: ["authority-admin"] as UserRole[],
  })),
  ...caseTemplates.map((template) => ({
    title: template.name,
    description: `${template.status.toLowerCase()} template with ${template.taskCount} tasks`,
    path: "/admin/case-templates",
    group: "Case templates",
    audience: ["authority-admin"] as UserRole[],
  })),
  ...cases.map((caseRecord) => {
    const participant = participants.find((item) => item.id === caseRecord.participantId);
    return {
      title: `${caseRecord.title} - ${participant?.name ?? "Unknown participant"}`,
      description: `${caseRecord.completedTasks}/${caseRecord.totalTasks} tasks complete`,
      path: `/cases/${caseRecord.id}`,
      group: "Cases",
      audience: ["authority-admin", "participant"] as UserRole[],
    };
  }),
  ...cases.flatMap((caseRecord) => caseRecord.tasks.map((task) => ({
    title: task.title,
    description: task.type,
    path: `/cases/${caseRecord.id}/tasks/${task.id}`,
    group: "Tasks",
    audience: ["authority-admin", "participant"] as UserRole[],
  }))),
];

export function getConsoleAppsForRole(role: UserRole) {
  return consoleApps.filter((app) => app.audience.includes(role));
}

export function getDefaultConsolePath(role: UserRole) {
  if (role === "stakeholder") return "/stakeholder";
  if (role === "authority-admin") return "/admin/participants";
  return "/cases";
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
    if (item.group === "Tasks") {
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

export function getCaseTemplatesForAuthority(authorityId: string | undefined) {
  return caseTemplates.filter((template) => template.authorityId === authorityId);
}

export function getScopedParticipants(user: AuthenticatedUser) {
  if (!user.authorityId) return [];
  const authorityParticipants = getParticipantsForAuthority(user.authorityId);
  if (user.role === "authority-admin") return authorityParticipants;
  if (user.role === "participant") {
    return authorityParticipants.filter((participant) => participant.id === user.participantId);
  }

  const stakeholderMembership = authenticatableUsers.find((candidate) => candidate.id === user.authenticatableUserId);
  if (stakeholderMembership?.membership.entityType !== "stakeholder") return [];
  const visibleParticipantIds = new Set(
    db.stakeholderParticipantAccess
      .map((access) => access.toDto())
      .filter((access) => access.stakeholderId === stakeholderMembership.membership.entityId && access.status === "APPROVED")
      .map((access) => access.participantId),
  );
  return authorityParticipants.filter((participant) => visibleParticipantIds.has(participant.id));
}

export function getScopedCases(user: AuthenticatedUser) {
  const scopedParticipantIds = new Set(getScopedParticipants(user).map((participant) => participant.id));
  return cases.filter((caseRecord) => scopedParticipantIds.has(caseRecord.participantId));
}

export function getCase(id: string | undefined) {
  return cases.find((caseRecord) => caseRecord.id === id);
}

export function getTask(caseId: string | undefined, taskId: string | undefined) {
  return getCase(caseId)?.tasks.find((task) => task.id === taskId);
}
