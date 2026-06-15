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
  Users,
  Video,
} from "lucide-react";
import type { AuthenticatedUser, UserRole } from "@/context/AuthContext";

export type Status = "complete" | "in-progress" | "attention" | "not-started";
export type AuthorityId = string;
export type ParticipantId = string;
export type StakeholderId = string;
export type AuthenticatableUserId = string;
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

export type Participant = {
  id: ParticipantId;
  name: string;
  authorityId: AuthorityId;
  stakeholderId: StakeholderId;
  type: string;
  participantRole: string;
  status: Status;
  openCases: number;
  completedTasks: number;
  totalTasks: number;
  lastActivity: string;
};

export type Authority = {
  id: AuthorityId;
  name: string;
  scenario: string;
  description: string;
};

export type Stakeholder = {
  id: StakeholderId;
  name: string;
};

export type AuthenticatableUser = {
  id: AuthenticatableUserId;
  name: string;
  email: string;
  membership: AuthenticatableUserMembership;
};

export type Task = {
  id: string;
  title: string;
  type: string;
  status: Status;
  due: string;
  description: string;
  Icon: typeof ImageUp;
};

export type CaseRecord = {
  id: string;
  title: string;
  participantId: ParticipantId;
  reference: string;
  caseType: string;
  status: "open" | "closed" | "review";
  completedTasks: number;
  totalTasks: number;
  risk: "low" | "medium" | "high";
  outcome: string;
  lastActivity: string;
  tasks: Task[];
};

export type SearchItem = {
  title: string;
  description: string;
  path: string;
  group: string;
  audience: UserRole[];
};

export const consoleApps: ConsoleApp[] = [
  {
    id: "administration",
    name: "Administration",
    shortName: "Admin",
    description: "Manage organizations, case types, roles, workflows, and review queues.",
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
    description: "View case status, completed tasks, evidence summaries, and outcomes.",
    path: "/stakeholder",
    accent: "bg-[#00703c]",
    Icon: BadgeCheck,
    audience: ["stakeholder"],
  },
];

export const authorities: Authority[] = [
  {
    id: "northstar-association",
    name: "Northstar Trade Association",
    scenario: "Trade association verification",
    description: "An authority manages annual verification cases for member IT platform providers.",
  },
  {
    id: "cobalt-home-services",
    name: "Cobalt Home Services",
    scenario: "Plumbing and electrical service visits",
    description: "A firm assigns field engineers to service visits and exposes completed work to stakeholders.",
  },
  {
    id: "pinebridge-council",
    name: "Pinebridge Borough Council",
    scenario: "Resident permit renewals",
    description: "A council manages annual permit renewal duties submitted by residents and reviewed by staff.",
  },
];

export const stakeholders: Stakeholder[] = [
  {
    id: "supplier-stakeholders",
    name: "Supplier stakeholders",
  },
  {
    id: "household-stakeholders",
    name: "Household stakeholders",
  },
  {
    id: "internal-compliance-team",
    name: "Internal compliance team",
  },
];

export const authenticatableUsers: AuthenticatableUser[] = [
  {
    id: "user-jonathan-price",
    name: "Jonathan Price",
    email: "jonathan.price@northstar.example",
    membership: { entityType: "authority", entityId: "northstar-association" },
  },
  {
    id: "user-amara-singh",
    name: "Amara Singh",
    email: "amara.singh@northstar.example",
    membership: { entityType: "authority", entityId: "northstar-association" },
  },
  {
    id: "user-hannah-cole",
    name: "Hannah Cole",
    email: "hannah.cole@cobalt.example",
    membership: { entityType: "authority", entityId: "cobalt-home-services" },
  },
  {
    id: "user-marcus-hill",
    name: "Marcus Hill",
    email: "marcus.hill@cobalt.example",
    membership: { entityType: "authority", entityId: "cobalt-home-services" },
  },
  {
    id: "user-eleanor-brooks",
    name: "Eleanor Brooks",
    email: "eleanor.brooks@pinebridge.example",
    membership: { entityType: "authority", entityId: "pinebridge-council" },
  },
  {
    id: "user-owen-clarke",
    name: "Owen Clarke",
    email: "owen.clarke@pinebridge.example",
    membership: { entityType: "authority", entityId: "pinebridge-council" },
  },
  {
    id: "user-aisha-khan",
    name: "Aisha Khan",
    email: "aisha.khan@northstar-cloud.example",
    membership: { entityType: "participant", entityId: "northstar-cloud" },
  },
  {
    id: "user-michael-reeves",
    name: "Michael Reeves",
    email: "michael.reeves@northstar-cloud.example",
    membership: { entityType: "participant", entityId: "northstar-cloud" },
  },
  {
    id: "user-lewis-green",
    name: "Lewis Green",
    email: "lewis.green@cobalt-field.example",
    membership: { entityType: "participant", entityId: "cobalt-data" },
  },
  {
    id: "user-amelia-wright",
    name: "Amelia Wright",
    email: "amelia.wright@cobalt-field.example",
    membership: { entityType: "participant", entityId: "cobalt-data" },
  },
  {
    id: "user-margaret-jones",
    name: "Margaret Jones",
    email: "margaret.jones@example.net",
    membership: { entityType: "participant", entityId: "pinebridge-systems" },
  },
  {
    id: "user-david-jones",
    name: "David Jones",
    email: "david.jones@example.net",
    membership: { entityType: "participant", entityId: "pinebridge-systems" },
  },
  {
    id: "user-rachel-morgan",
    name: "Rachel Morgan",
    email: "rachel.morgan@supplier-stakeholder.example",
    membership: { entityType: "stakeholder", entityId: "supplier-stakeholders" },
  },
  {
    id: "user-peter-walsh",
    name: "Peter Walsh",
    email: "peter.walsh@supplier-stakeholder.example",
    membership: { entityType: "stakeholder", entityId: "supplier-stakeholders" },
  },
  {
    id: "user-sophie-turner",
    name: "Sophie Turner",
    email: "sophie.turner@household.example",
    membership: { entityType: "stakeholder", entityId: "household-stakeholders" },
  },
  {
    id: "user-benjamin-foster",
    name: "Benjamin Foster",
    email: "benjamin.foster@household.example",
    membership: { entityType: "stakeholder", entityId: "household-stakeholders" },
  },
  {
    id: "user-priya-shah",
    name: "Priya Shah",
    email: "priya.shah@pinebridge-compliance.example",
    membership: { entityType: "stakeholder", entityId: "internal-compliance-team" },
  },
  {
    id: "user-george-evans",
    name: "George Evans",
    email: "george.evans@pinebridge-compliance.example",
    membership: { entityType: "stakeholder", entityId: "internal-compliance-team" },
  },
];

export const participants: Participant[] = [
  {
    id: "northstar-cloud",
    authorityId: "northstar-association",
    stakeholderId: "supplier-stakeholders",
    name: "Northstar Cloud Platforms",
    type: "IT platform provider",
    participantRole: "Member provider administrators",
    status: "in-progress",
    openCases: 1,
    completedTasks: 4,
    totalTasks: 7,
    lastActivity: "Today, 09:42",
  },
  {
    id: "cobalt-data",
    authorityId: "cobalt-home-services",
    stakeholderId: "household-stakeholders",
    name: "Cobalt Field Engineering Team",
    type: "Operational team",
    participantRole: "Field engineers",
    status: "attention",
    openCases: 1,
    completedTasks: 2,
    totalTasks: 4,
    lastActivity: "Yesterday, 16:18",
  },
  {
    id: "pinebridge-systems",
    authorityId: "pinebridge-council",
    stakeholderId: "internal-compliance-team",
    name: "Mrs Jones",
    type: "Permit applicants",
    participantRole: "Residents and council reviewers",
    status: "complete",
    openCases: 0,
    completedTasks: 3,
    totalTasks: 3,
    lastActivity: "10 Jun 2026",
  },
];

export const cases: CaseRecord[] = [
  {
    id: "case-2026-northstar",
    title: "Provider annual verification",
    participantId: "northstar-cloud",
    reference: "2026",
    caseType: "Annual compliance case",
    status: "open",
    completedTasks: 4,
    totalTasks: 7,
    risk: "medium",
    outcome: "Provider can be shown as in progress to stakeholders",
    lastActivity: "Photo identity evidence uploaded",
    tasks: [
      {
        id: "photo-identity",
        title: "Photo identity evidence",
        type: "Evidence upload and AI tagging",
        status: "complete",
        due: "18 Jun 2026",
        description: "Upload identity images and review the generated tags before submission.",
        Icon: ImageUp,
      },
      {
        id: "driving-licence",
        title: "Driving licence upload",
        type: "Secure evidence upload",
        status: "in-progress",
        due: "20 Jun 2026",
        description: "Provide a current driving licence image for manual inspection.",
        Icon: KeyRound,
      },
      {
        id: "video-attestation",
        title: "Operational attestation",
        type: "Video upload",
        status: "not-started",
        due: "24 Jun 2026",
        description: "Upload a short attestation video for organization reviewers.",
        Icon: Video,
      },
      {
        id: "security-form",
        title: "Controls declaration form",
        type: "Form and digital signature",
        status: "attention",
        due: "21 Jun 2026",
        description: "Complete controls, confirm declarations, and digitally sign the form.",
        Icon: FileSignature,
      },
      {
        id: "fixed-questions",
        title: "Fixed case questions",
        type: "Three fixed questions",
        status: "complete",
        due: "16 Jun 2026",
        description: "Answer the authority's fixed questions for this case type.",
        Icon: FileQuestion,
      },
      {
        id: "conditional-questions",
        title: "Conditional question path",
        type: "Question path",
        status: "complete",
        due: "16 Jun 2026",
        description: "Respond to branching questions based on previous case answers.",
        Icon: ClipboardCheck,
      },
      {
        id: "stakeholder-preview",
        title: "Stakeholder preview",
        type: "Read-only stakeholder view",
        status: "complete",
        due: "26 Jun 2026",
        description: "Preview what stakeholders can see about the case outcome.",
        Icon: BadgeCheck,
      },
    ],
  },
  {
    id: "case-2026-cobalt",
    title: "Emergency plumbing visit",
    participantId: "cobalt-data",
    reference: "JOB-4821",
    caseType: "Service visit",
    status: "review",
    completedTasks: 2,
    totalTasks: 4,
    risk: "high",
    outcome: "Stakeholder confirmation is blocked until job evidence is complete",
    lastActivity: "Reviewer requested completion photo resubmission",
    tasks: [
      {
        id: "arrival-location",
        title: "Arrival location snapshot",
        type: "GPS evidence",
        status: "complete",
        due: "15 Jun 2026",
        description: "Record visit arrival time and location for the stakeholder service record.",
        Icon: Landmark,
      },
      {
        id: "work-photos",
        title: "Work completion photos",
        type: "Photo evidence",
        status: "attention",
        due: "15 Jun 2026",
        description: "Upload before and after photos so the office can approve the service visit.",
        Icon: ImageUp,
      },
      {
        id: "stakeholder-signature",
        title: "Stakeholder sign-off",
        type: "Digital signature",
        status: "in-progress",
        due: "15 Jun 2026",
        description: "Collect a signature from the stakeholder confirming the visit outcome.",
        Icon: FileSignature,
      },
      {
        id: "invoice-review",
        title: "Invoice review",
        type: "Billing task",
        status: "not-started",
        due: "17 Jun 2026",
        description: "Review labour, parts, and callout charges before issuing the invoice.",
        Icon: ReceiptText,
      },
    ],
  },
  {
    id: "case-2025-pinebridge",
    title: "Resident permit renewal",
    participantId: "pinebridge-systems",
    reference: "PERMIT-2026",
    caseType: "Annual permit renewal",
    status: "closed",
    completedTasks: 3,
    totalTasks: 3,
    risk: "low",
    outcome: "Permit renewed",
    lastActivity: "Permit renewal approved",
    tasks: [
      {
        id: "vehicle-documents",
        title: "Vehicle documents",
        type: "Document upload",
        status: "complete",
        due: "30 May 2026",
        description: "Upload valid vehicle documents for the annual renewal case.",
        Icon: Car,
      },
      {
        id: "address-proof",
        title: "Proof of residential address",
        type: "Document upload",
        status: "complete",
        due: "30 May 2026",
        description: "Provide evidence of residency inside the permit area.",
        Icon: Building2,
      },
      {
        id: "fee-payment",
        title: "Renewal fee payment",
        type: "Payment confirmation",
        status: "complete",
        due: "31 May 2026",
        description: "Confirm payment before the council reviewer approves the renewal.",
        Icon: ReceiptText,
      },
    ],
  },
];

export const adminResources = [
  { name: "Participants", path: "/admin/participants", Icon: Building2, count: "3 examples" },
  { name: "Case types", path: "/admin/case-types", Icon: ShieldCheck, count: "3 configured" },
  { name: "Task templates", path: "/admin/task-templates", Icon: ClipboardCheck, count: "14 tasks" },
  { name: "Users and roles", path: "/admin/users", Icon: Users, count: "18 users" },
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
  const scopedParticipantIds = new Set(scopedParticipants.map((participant) => participant.id));
  const scopedCaseIds = new Set(scopedCases.map((caseRecord) => caseRecord.id));

  return searchItems.filter((item) => {
    if (!item.audience.includes(user.role)) return false;
    if (item.group === "Participants") {
      return scopedParticipants.some((participant) => item.path.endsWith(participant.id));
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
  return authorities.find((organization) => organization.id === id);
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

export function getScopedParticipants(user: AuthenticatedUser) {
  if (!user.authorityId) return [];
  const organizationParticipants = getParticipantsForAuthority(user.authorityId);
  if (user.role === "authority-admin") return organizationParticipants;
  return organizationParticipants.filter((participant) => participant.id === user.participantId);
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
