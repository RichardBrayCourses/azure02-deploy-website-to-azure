import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileQuestion,
  FileSignature,
  FolderKanban,
  ImageUp,
  KeyRound,
  Landmark,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import type { UserGroup } from "@/context/AuthContext";

export type Status = "complete" | "in-progress" | "attention" | "not-started";

export type ConsoleApp = {
  id: "administration" | "case-management" | "verification-portal";
  name: string;
  shortName: string;
  description: string;
  path: string;
  accent: string;
  Icon: typeof Landmark;
  audience: UserGroup[];
};

export type Company = {
  id: string;
  name: string;
  owner: string;
  status: Status;
  openCases: number;
  completedChecks: number;
  totalChecks: number;
  lastActivity: string;
};

export type Check = {
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
  companyId: string;
  year: string;
  status: "open" | "closed" | "review";
  completedChecks: number;
  totalChecks: number;
  risk: "low" | "medium" | "high";
  lastActivity: string;
  checks: Check[];
};

export type SearchItem = {
  title: string;
  description: string;
  path: string;
  group: string;
  audience: UserGroup[];
};

export const consoleApps: ConsoleApp[] = [
  {
    id: "administration",
    name: "Administration",
    shortName: "Admin",
    description: "Manage companies, annual verification templates, users, and review queues.",
    path: "/admin",
    accent: "bg-[#1d70b8]",
    Icon: Landmark,
    audience: ["association"],
  },
  {
    id: "case-management",
    name: "Case Management",
    shortName: "Cases",
    description: "Open annual cases, complete checks, upload evidence, and track progress.",
    path: "/cases",
    accent: "bg-[#0078d4]",
    Icon: FolderKanban,
    audience: ["association", "provider"],
  },
  {
    id: "verification-portal",
    name: "Verification Portal",
    shortName: "Verify",
    description: "Check supplier verification status, completed checks, and outstanding items.",
    path: "/verification",
    accent: "bg-[#00703c]",
    Icon: BadgeCheck,
    audience: ["interested-party"],
  },
];

export const companies: Company[] = [
  {
    id: "northstar-cloud",
    name: "Northstar Cloud Platforms",
    owner: "Maya Patel",
    status: "in-progress",
    openCases: 1,
    completedChecks: 4,
    totalChecks: 7,
    lastActivity: "Today, 09:42",
  },
  {
    id: "cobalt-data",
    name: "Cobalt Data Exchange",
    owner: "Daniel Mensah",
    status: "attention",
    openCases: 1,
    completedChecks: 2,
    totalChecks: 7,
    lastActivity: "Yesterday, 16:18",
  },
  {
    id: "pinebridge-systems",
    name: "Pinebridge Systems",
    owner: "Sara Hughes",
    status: "complete",
    openCases: 0,
    completedChecks: 7,
    totalChecks: 7,
    lastActivity: "10 Jun 2026",
  },
];

export const cases: CaseRecord[] = [
  {
    id: "case-2026-northstar",
    title: "2026 annual verification",
    companyId: "northstar-cloud",
    year: "2026",
    status: "open",
    completedChecks: 4,
    totalChecks: 7,
    risk: "medium",
    lastActivity: "Photo identity uploaded",
    checks: [
      {
        id: "photo-identity",
        title: "Photo identity evidence",
        type: "Upload and AI tagging",
        status: "complete",
        owner: "Aisha Khan",
        due: "18 Jun 2026",
        description: "Upload identity images and review the generated tags before submission.",
        Icon: ImageUp,
      },
      {
        id: "driving-licence",
        title: "Driving licence upload",
        type: "Secure document upload",
        status: "in-progress",
        owner: "Aisha Khan",
        due: "20 Jun 2026",
        description: "Provide a current driving licence image for manual inspection.",
        Icon: KeyRound,
      },
      {
        id: "video-attestation",
        title: "Video attestation",
        type: "Video upload",
        status: "not-started",
        owner: "Michael Reeves",
        due: "24 Jun 2026",
        description: "Upload a short verification video for association reviewers.",
        Icon: Video,
      },
      {
        id: "security-form",
        title: "Security controls form",
        type: "Form and digital signature",
        status: "attention",
        owner: "Priya Nair",
        due: "21 Jun 2026",
        description: "Complete controls, confirm declarations, and digitally sign the form.",
        Icon: FileSignature,
      },
      {
        id: "fixed-questions",
        title: "Fixed supplier questions",
        type: "Three fixed questions",
        status: "complete",
        owner: "Priya Nair",
        due: "16 Jun 2026",
        description: "Answer the association's fixed questions for all platform companies.",
        Icon: FileQuestion,
      },
      {
        id: "conditional-questions",
        title: "Conditional question path",
        type: "Question path",
        status: "complete",
        owner: "Michael Reeves",
        due: "16 Jun 2026",
        description: "Respond to branching questions based on previous verification answers.",
        Icon: ClipboardCheck,
      },
      {
        id: "customer-preview",
        title: "Customer verification preview",
        type: "Read-only customer view",
        status: "complete",
        owner: "Maya Patel",
        due: "26 Jun 2026",
        description: "Preview what customers will see about this year's verification status.",
        Icon: BadgeCheck,
      },
    ],
  },
  {
    id: "case-2026-cobalt",
    title: "2026 annual verification",
    companyId: "cobalt-data",
    year: "2026",
    status: "review",
    completedChecks: 2,
    totalChecks: 7,
    risk: "high",
    lastActivity: "Reviewer requested licence resubmission",
    checks: [],
  },
  {
    id: "case-2025-pinebridge",
    title: "2025 annual verification",
    companyId: "pinebridge-systems",
    year: "2025",
    status: "closed",
    completedChecks: 7,
    totalChecks: 7,
    risk: "low",
    lastActivity: "Case closed",
    checks: [],
  },
];

export const adminResources = [
  { name: "Platform companies", path: "/admin/companies", Icon: Building2, count: "3 active" },
  { name: "Verification years", path: "/admin/verification-years", Icon: ShieldCheck, count: "2026 draft" },
  { name: "Check templates", path: "/admin/check-templates", Icon: ClipboardCheck, count: "7 tasks" },
  { name: "Users and access", path: "/admin/users", Icon: Users, count: "18 users" },
];

export const searchItems: SearchItem[] = [
  ...consoleApps.map((app) => ({
    title: app.name,
    description: app.description,
    path: app.path,
    group: "Apps",
    audience: app.audience,
  })),
  ...companies.map((company) => ({
    title: company.name,
    description: `${company.owner} - ${company.openCases} open case`,
    path: `/admin/companies/${company.id}`,
    group: "Companies",
    audience: ["association", "interested-party"] as UserGroup[],
  })),
  ...cases.map((caseRecord) => {
    const company = companies.find((item) => item.id === caseRecord.companyId);
    return {
      title: `${caseRecord.title} - ${company?.name ?? "Unknown company"}`,
      description: `${caseRecord.completedChecks}/${caseRecord.totalChecks} checks complete`,
      path: `/cases/${caseRecord.id}`,
      group: "Cases",
      audience: ["association", "provider"] as UserGroup[],
    };
  }),
  ...cases[0].checks.map((check) => ({
    title: check.title,
    description: check.type,
    path: `/cases/${cases[0].id}/checks/${check.id}`,
    group: "Checks",
    audience: ["association", "provider"] as UserGroup[],
  })),
];

export function getConsoleAppsForGroup(group: UserGroup) {
  return consoleApps.filter((app) => app.audience.includes(group));
}

export function getSearchItemsForGroup(group: UserGroup) {
  return searchItems.filter((item) => item.audience.includes(group));
}

export function getCompany(id: string | undefined) {
  return companies.find((company) => company.id === id);
}

export function getCase(id: string | undefined) {
  return cases.find((caseRecord) => caseRecord.id === id);
}

export function getCheck(caseId: string | undefined, checkId: string | undefined) {
  return getCase(caseId)?.checks.find((check) => check.id === checkId);
}
