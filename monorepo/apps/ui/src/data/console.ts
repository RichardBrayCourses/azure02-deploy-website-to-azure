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

export type ConsoleApp = {
  id: "administration" | "case-management" | "verification-portal";
  name: string;
  shortName: string;
  description: string;
  path: string;
  accent: string;
  Icon: typeof Landmark;
  audience: UserRole[];
};

export type OperationalParticipant = {
  id: string;
  owningOrganisationId: string;
  name: string;
  owner: string;
  type: string;
  operationalRole: string;
  interestedParty: string;
  status: Status;
  openCases: number;
  completedTasks: number;
  totalTasks: number;
  lastActivity: string;
};

export type OwningOrganisation = {
  id: string;
  name: string;
  scenario: string;
  description: string;
};

export type Task = {
  id: string;
  title: string;
  type: string;
  status: Status;
  owner: string;
  due: string;
  description: string;
  Icon: typeof ImageUp;
};

export type CaseRecord = {
  id: string;
  title: string;
  operationalParticipantId: string;
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
    description: "Manage organisations, case types, roles, workflows, and review queues.",
    path: "/admin/operational-participants",
    accent: "bg-[#1d70b8]",
    Icon: Landmark,
    audience: ["owning-organisation-admin"],
  },
  {
    id: "case-management",
    name: "Case Management",
    shortName: "Cases",
    description: "Open cases, complete tasks, upload evidence, and track progress.",
    path: "/cases",
    accent: "bg-[#0078d4]",
    Icon: FolderKanban,
    audience: ["owning-organisation-admin", "operational-participant"],
  },
  {
    id: "verification-portal",
    name: "Assurance Portal",
    shortName: "Assure",
    description: "View case status, completed tasks, evidence summaries, and outcomes.",
    path: "/verification",
    accent: "bg-[#00703c]",
    Icon: BadgeCheck,
    audience: ["interested-party"],
  },
];

export const owningOrganisations: OwningOrganisation[] = [
  {
    id: "northstar-association",
    name: "Northstar Trade Association",
    scenario: "Trade association assurance",
    description: "A master organisation manages annual assurance cases for member IT platform providers.",
  },
  {
    id: "cobalt-home-services",
    name: "Cobalt Home Services",
    scenario: "Plumbing and electrical service visits",
    description: "A firm assigns field engineers to service visits and exposes completed work to customers.",
  },
  {
    id: "pinebridge-council",
    name: "Pinebridge Borough Council",
    scenario: "Resident permit renewals",
    description: "A council manages annual permit renewal duties submitted by residents and reviewed by staff.",
  },
];

export const operationalParticipants: OperationalParticipant[] = [
  {
    id: "northstar-cloud",
    owningOrganisationId: "northstar-association",
    name: "Northstar Cloud Platforms",
    owner: "Maya Patel",
    type: "IT platform provider",
    operationalRole: "Member provider administrators",
    interestedParty: "Supplier customers",
    status: "in-progress",
    openCases: 1,
    completedTasks: 4,
    totalTasks: 7,
    lastActivity: "Today, 09:42",
  },
  {
    id: "cobalt-data",
    owningOrganisationId: "cobalt-home-services",
    name: "Cobalt Field Engineering Team",
    owner: "Daniel Mensah",
    type: "Operational team",
    operationalRole: "Field engineers",
    interestedParty: "Household customers",
    status: "attention",
    openCases: 1,
    completedTasks: 2,
    totalTasks: 4,
    lastActivity: "Yesterday, 16:18",
  },
  {
    id: "pinebridge-systems",
    owningOrganisationId: "pinebridge-council",
    name: "Resident applicant group",
    owner: "Sara Hughes",
    type: "Permit applicants",
    operationalRole: "Residents and council reviewers",
    interestedParty: "Internal compliance team",
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
    title: "Provider annual assurance",
    operationalParticipantId: "northstar-cloud",
    reference: "2026",
    caseType: "Annual compliance case",
    status: "open",
    completedTasks: 4,
    totalTasks: 7,
    risk: "medium",
    outcome: "Provider can be shown as in progress to interested customers",
    lastActivity: "Photo identity evidence uploaded",
    tasks: [
      {
        id: "photo-identity",
        title: "Photo identity evidence",
        type: "Evidence upload and AI tagging",
        status: "complete",
        owner: "Aisha Khan",
        due: "18 Jun 2026",
        description: "Upload identity images and review the generated tags before submission.",
        Icon: ImageUp,
      },
      {
        id: "driving-licence",
        title: "Driving licence upload",
        type: "Secure evidence upload",
        status: "in-progress",
        owner: "Aisha Khan",
        due: "20 Jun 2026",
        description: "Provide a current driving licence image for manual inspection.",
        Icon: KeyRound,
      },
      {
        id: "video-attestation",
        title: "Operational attestation",
        type: "Video upload",
        status: "not-started",
        owner: "Michael Reeves",
        due: "24 Jun 2026",
        description: "Upload a short attestation video for organisation reviewers.",
        Icon: Video,
      },
      {
        id: "security-form",
        title: "Controls declaration form",
        type: "Form and digital signature",
        status: "attention",
        owner: "Priya Nair",
        due: "21 Jun 2026",
        description: "Complete controls, confirm declarations, and digitally sign the form.",
        Icon: FileSignature,
      },
      {
        id: "fixed-questions",
        title: "Fixed case questions",
        type: "Three fixed questions",
        status: "complete",
        owner: "Priya Nair",
        due: "16 Jun 2026",
        description: "Answer the owning organisation's fixed questions for this case type.",
        Icon: FileQuestion,
      },
      {
        id: "conditional-questions",
        title: "Conditional question path",
        type: "Question path",
        status: "complete",
        owner: "Michael Reeves",
        due: "16 Jun 2026",
        description: "Respond to branching questions based on previous case answers.",
        Icon: ClipboardCheck,
      },
      {
        id: "customer-preview",
        title: "Interested party preview",
        type: "Read-only assurance view",
        status: "complete",
        owner: "Maya Patel",
        due: "26 Jun 2026",
        description: "Preview what interested parties can see about the case outcome.",
        Icon: BadgeCheck,
      },
    ],
  },
  {
    id: "case-2026-cobalt",
    title: "Emergency plumbing visit",
    operationalParticipantId: "cobalt-data",
    reference: "JOB-4821",
    caseType: "Service visit",
    status: "review",
    completedTasks: 2,
    totalTasks: 4,
    risk: "high",
    outcome: "Customer confirmation is blocked until job evidence is complete",
    lastActivity: "Reviewer requested completion photo resubmission",
    tasks: [
      {
        id: "arrival-location",
        title: "Arrival location snapshot",
        type: "GPS evidence",
        status: "complete",
        owner: "Lewis Green",
        due: "15 Jun 2026",
        description: "Record visit arrival time and location for the customer service record.",
        Icon: Landmark,
      },
      {
        id: "work-photos",
        title: "Work completion photos",
        type: "Photo evidence",
        status: "attention",
        owner: "Lewis Green",
        due: "15 Jun 2026",
        description: "Upload before and after photos so the office can approve the service visit.",
        Icon: ImageUp,
      },
      {
        id: "customer-signature",
        title: "Customer sign-off",
        type: "Digital signature",
        status: "in-progress",
        owner: "Amelia Wright",
        due: "15 Jun 2026",
        description: "Collect a signature from the customer confirming the visit outcome.",
        Icon: FileSignature,
      },
      {
        id: "invoice-review",
        title: "Invoice review",
        type: "Billing task",
        status: "not-started",
        owner: "Daniel Mensah",
        due: "17 Jun 2026",
        description: "Review labour, parts, and callout charges before issuing the invoice.",
        Icon: ReceiptText,
      },
    ],
  },
  {
    id: "case-2025-pinebridge",
    title: "Resident permit renewal",
    operationalParticipantId: "pinebridge-systems",
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
        owner: "Resident applicant",
        due: "30 May 2026",
        description: "Upload valid vehicle documents for the annual renewal case.",
        Icon: Car,
      },
      {
        id: "address-proof",
        title: "Proof of residential address",
        type: "Document upload",
        status: "complete",
        owner: "Resident applicant",
        due: "30 May 2026",
        description: "Provide evidence of residency inside the permit area.",
        Icon: Building2,
      },
      {
        id: "fee-payment",
        title: "Renewal fee payment",
        type: "Payment confirmation",
        status: "complete",
        owner: "Resident applicant",
        due: "31 May 2026",
        description: "Confirm payment before the council reviewer approves the renewal.",
        Icon: ReceiptText,
      },
    ],
  },
];

export const adminResources = [
  { name: "Operational participants", path: "/admin/operational-participants", Icon: Building2, count: "3 examples" },
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
  ...operationalParticipants.map((operationalParticipant) => ({
    title: operationalParticipant.name,
    description: `${operationalParticipant.owner} - ${operationalParticipant.openCases} open case`,
    path: `/admin/operational-participants/${operationalParticipant.id}`,
    group: "Operational participants",
    audience: ["owning-organisation-admin", "interested-party"] as UserRole[],
  })),
  ...cases.map((caseRecord) => {
    const operationalParticipant = operationalParticipants.find((item) => item.id === caseRecord.operationalParticipantId);
    return {
      title: `${caseRecord.title} - ${operationalParticipant?.name ?? "Unknown operational participant"}`,
      description: `${caseRecord.completedTasks}/${caseRecord.totalTasks} tasks complete`,
      path: `/cases/${caseRecord.id}`,
      group: "Cases",
      audience: ["owning-organisation-admin", "operational-participant"] as UserRole[],
    };
  }),
  ...cases.flatMap((caseRecord) => caseRecord.tasks.map((task) => ({
    title: task.title,
    description: task.type,
    path: `/cases/${caseRecord.id}/tasks/${task.id}`,
    group: "Tasks",
    audience: ["owning-organisation-admin", "operational-participant"] as UserRole[],
  }))),
];

export function getConsoleAppsForRole(role: UserRole) {
  return consoleApps.filter((app) => app.audience.includes(role));
}

export function getDefaultConsolePath(role: UserRole) {
  if (role === "interested-party") return "/verification";
  if (role === "owning-organisation-admin") return "/admin/operational-participants";
  return "/cases";
}

export function getSearchItemsForUser(user: AuthenticatedUser) {
  const scopedOperationalParticipants = getScopedOperationalParticipants(user);
  const scopedCases = getScopedCases(user);
  const scopedOperationalParticipantIds = new Set(scopedOperationalParticipants.map((operationalParticipant) => operationalParticipant.id));
  const scopedCaseIds = new Set(scopedCases.map((caseRecord) => caseRecord.id));

  return searchItems.filter((item) => {
    if (!item.audience.includes(user.role)) return false;
    if (item.group === "Operational participants") {
      return scopedOperationalParticipants.some((operationalParticipant) => item.path.endsWith(operationalParticipant.id));
    }
    if (item.group === "Cases") {
      return scopedCases.some((caseRecord) => item.path.endsWith(caseRecord.id));
    }
    if (item.group === "Tasks") {
      return scopedCaseIds.has(item.path.split("/")[2] ?? "");
    }
    return true;
  }).filter((item) => item.group !== "Operational participants" || scopedOperationalParticipantIds.size > 0);
}

export function getOperationalParticipant(id: string | undefined) {
  return operationalParticipants.find((operationalParticipant) => operationalParticipant.id === id);
}

export function getOwningOrganisation(id: string | undefined) {
  return owningOrganisations.find((organisation) => organisation.id === id);
}

export function getOperationalParticipantsForOwningOrganisation(owningOrganisationId: string | undefined) {
  return operationalParticipants.filter((operationalParticipant) => operationalParticipant.owningOrganisationId === owningOrganisationId);
}

export function getScopedOperationalParticipants(user: AuthenticatedUser) {
  if (!user.owningOrganisationId) return [];
  const organisationOperationalParticipants = getOperationalParticipantsForOwningOrganisation(user.owningOrganisationId);
  if (user.role === "owning-organisation-admin") return organisationOperationalParticipants;
  return organisationOperationalParticipants.filter((operationalParticipant) => operationalParticipant.id === user.operationalParticipantId);
}

export function getScopedCases(user: AuthenticatedUser) {
  const scopedOperationalParticipantIds = new Set(getScopedOperationalParticipants(user).map((operationalParticipant) => operationalParticipant.id));
  return cases.filter((caseRecord) => scopedOperationalParticipantIds.has(caseRecord.operationalParticipantId));
}

export function getCase(id: string | undefined) {
  return cases.find((caseRecord) => caseRecord.id === id);
}

export function getTask(caseId: string | undefined, taskId: string | undefined) {
  return getCase(caseId)?.tasks.find((task) => task.id === taskId);
}
