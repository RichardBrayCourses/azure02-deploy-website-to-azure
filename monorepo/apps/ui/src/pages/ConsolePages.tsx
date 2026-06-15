import { Button } from "@/components/ui/button";
import { ConsoleLayout, MetricStrip, PageTitle, SidebarItem, Tabs } from "@/components/ConsoleLayout";
import { getUserRoleLabel, useAuth } from "@/context/AuthContext";
import {
  adminResources,
  getCase,
  getTask,
  getOperationalParticipant,
  getConsoleAppsForRole,
  getOwningOrganisation,
  getScopedCases,
  getScopedOperationalParticipants,
  Status,
} from "@/data/console";
import { cn } from "@/lib/utils";
import {
  Activity,
  Archive,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  FileText,
  FolderKanban,
  History,
  ListChecks,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const adminSidebar: SidebarItem[] = [
  { label: "Administration home", path: "/admin", Icon: ShieldCheck },
  { label: "Operational participants", path: "/admin/operational-participants", Icon: Building2, detail: "Scoped participants" },
  { label: "Case types", path: "/admin/case-types", Icon: CalendarDays, detail: "Reusable process models" },
  { label: "Task templates", path: "/admin/task-templates", Icon: ClipboardCheck, detail: "Forms, tasks, evidence" },
  { label: "Users and roles", path: "/admin/users", Icon: Users, detail: "Participants and access" },
];

const caseSidebar: SidebarItem[] = [
  { label: "Case Management home", path: "/cases", Icon: FolderKanban },
  { label: "Cases", path: "/cases/list", Icon: Archive, detail: "Configured case instances" },
  { label: "Tasks", path: "/cases/tasks", Icon: ListChecks, detail: "Task-level work" },
  { label: "Evidence", path: "/cases/evidence", Icon: Upload, detail: "Uploads and documents" },
  { label: "Interested party view", path: "/cases/customer-preview", Icon: BadgeCheck, detail: "External status view" },
];

function StatusBadge({ status }: { status: Status | "open" | "closed" | "review" }) {
  const classes = {
    complete: "bg-[#00703c] text-white",
    "in-progress": "bg-[#1d70b8] text-white",
    attention: "bg-[#d4351c] text-white",
    "not-started": "bg-[#f3f2f1] text-[#0b0c0c] ring-1 ring-[#b1b4b6]",
    open: "bg-[#1d70b8] text-white",
    closed: "bg-[#00703c] text-white",
    review: "bg-[#ffdd00] text-[#0b0c0c]",
  };

  const label = status.replace("-", " ");
  return (
    <span className={cn("inline-flex rounded-sm px-2 py-1 text-xs font-bold uppercase", classes[status])}>
      {label}
    </span>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
        <span>{value} of {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-[#b1b4b6]">
        <div className="h-2 bg-[#00703c]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function ResourceTable({
  children,
  headings,
}: {
  headings: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden border border-[#b1b4b6] bg-white dark:bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[#f3f2f1] text-[#0b0c0c] dark:bg-accent dark:text-foreground">
            <tr>
              {headings.map((heading) => (
                <th key={heading} className="border-b border-[#b1b4b6] px-4 py-3 font-bold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function ConsoleHome() {
  const { user } = useAuth();
  const availableApps = getConsoleAppsForRole(user.role);
  const isInterestedParty = user.role === "interested-party";
  const isProvider = user.role === "operational-participant";
  const owningOrganisation = getOwningOrganisation(user.owningOrganisationId ?? undefined);
  const scopedOperationalParticipants = getScopedOperationalParticipants(user);
  const scopedCases = getScopedCases(user);
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);
  const attentionCount = scopedCases.filter((caseRecord) => caseRecord.risk === "high").length;
  const primaryParticipant = scopedOperationalParticipants[0];
  const primaryCase = scopedCases[0];

  return (
    <ConsoleLayout breadcrumbs={[]}>
      <PageTitle
        eyebrow="Console home"
        title="CaseFlow Console"
        description={`${getUserRoleLabel(user.role)} view for ${
          isInterestedParty
            ? "checking case assurance status."
            : isProvider
              ? "completing assigned case tasks."
              : "configuring case types, participants, and workflow."
        }`}
        actions={!isInterestedParty &&
          <Button asChild>
            <Link to={isProvider ? "/cases/list" : "/admin/operational-participants"}>
              <Plus />
              {isProvider ? "Create case" : "Add operational participant"}
            </Link>
          </Button>
        }
      />

      <MetricStrip
        items={
          isInterestedParty
            ? [
                { label: "Cases watched", value: "3", tone: "blue" },
                { label: "Outcomes verified", value: "1", tone: "green" },
                { label: "In progress", value: "2", tone: "yellow" },
                { label: "Failed tasks", value: "0", tone: "green" },
              ]
              : isProvider
              ? [
                  { label: "Current participant", value: primaryParticipant?.name ?? "None", tone: "blue" },
                  { label: "Active case", value: primaryCase?.title ?? "None", tone: "yellow" },
                  { label: "Completed tasks", value: `${completedTasks} / ${totalTasks}`, tone: "green" },
                  { label: "Needs attention", value: String(attentionCount), tone: "red" },
                ]
              : [
                  { label: "Open cases", value: String(scopedCases.filter((caseRecord) => caseRecord.status !== "closed").length), tone: "blue" },
                  { label: "Tasks complete", value: `${completedTasks} / ${totalTasks}`, tone: "green" },
                  { label: "Needs attention", value: String(attentionCount), tone: "red" },
                  { label: "Owning organisation", value: owningOrganisation?.name ?? "None", tone: "yellow" },
                ]
        }
      />

      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Apps</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {availableApps.map((app) => {
            const Icon = app.Icon;
            return (
              <Link
                key={app.id}
                to={app.path}
                className="group border border-[#b1b4b6] bg-white p-5 shadow-sm hover:border-[#1d70b8] hover:shadow-md dark:bg-card"
              >
                <span className={cn("mb-4 flex size-12 items-center justify-center rounded-sm text-white", app.accent)}>
                  <Icon className="size-6" />
                </span>
                <span className="flex items-center gap-2 text-2xl font-bold text-[#1d70b8] group-hover:underline">
                  {app.name}
                  <ExternalLink className="size-4" />
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                  {app.description}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div>
          <h3 className="mb-3 text-xl font-bold">
            {isInterestedParty ? "Watched cases" : "Recently visited"}
          </h3>
          <div className="grid gap-3">
            {scopedCases.slice(0, 2).map((caseRecord) => {
              const operationalParticipant = getOperationalParticipant(caseRecord.operationalParticipantId);
              return (
                <Link
                  key={caseRecord.id}
                  to={isInterestedParty ? "/verification" : `/cases/${caseRecord.id}`}
                  className="border border-[#b1b4b6] bg-white p-4 hover:border-[#1d70b8] dark:bg-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#1d70b8]">{caseRecord.title}</p>
                      <p className="text-sm text-[#505a5f] dark:text-muted-foreground">{operationalParticipant?.name}</p>
                    </div>
                    <StatusBadge status={caseRecord.status} />
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-xl font-bold">
            {isInterestedParty ? "Latest assurance update" : "Attention queue"}
          </h3>
          <div className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <div className="flex gap-3">
              {isInterestedParty ? (
                <BadgeCheck className="mt-1 size-5 text-[#00703c]" />
              ) : (
                <ShieldAlert className="mt-1 size-5 text-[#d4351c]" />
              )}
              <div>
                <p className="font-bold">
                  {isInterestedParty
                    ? "Pinebridge Borough Council permit renewal is approved"
                    : "Controls declaration form needs review"}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                  {isInterestedParty
                    ? "Interested parties can see completed tasks, visible evidence, and the current outcome."
                    : "Northstar Trade Association has an unsigned controls declaration due on 21 Jun 2026."}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to={isInterestedParty ? "/verification" : primaryCase ? `/cases/${primaryCase.id}` : "/cases/list"}>
                    {isInterestedParty ? "Open portal" : "Open task"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ConsoleLayout>
  );
}

export function VerificationPortalPage() {
  const { user } = useAuth();
  const scopedOperationalParticipants = getScopedOperationalParticipants(user);
  const scopedCases = getScopedCases(user);
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);

  return (
    <ConsoleLayout
      breadcrumbs={[{ label: "Assurance Portal" }]}
    >
      <PageTitle
        eyebrow="Interested party"
        title="Case assurance"
        description="Read-only status and outcome visibility for cases you are allowed to inspect."
      />
      <MetricStrip
        items={[
          { label: "Watched cases", value: String(scopedCases.length), tone: "blue" },
          { label: "Approved outcomes", value: String(scopedCases.filter((caseRecord) => caseRecord.status === "closed").length), tone: "green" },
          { label: "In progress", value: String(scopedCases.filter((caseRecord) => caseRecord.status !== "closed").length), tone: "yellow" },
          { label: "Failed tasks", value: "0", tone: "green" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Visible case status</h3>
        <ResourceTable headings={["Organisation", "Visible case", "Status", "Tasks", "Visible outcome"]}>
          {scopedOperationalParticipants.map((operationalParticipant) => (
            <tr key={operationalParticipant.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <span className="font-bold text-[#1d70b8]">{operationalParticipant.name}</span>
                <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                  {operationalParticipant.interestedParty}
                </span>
              </td>
              <td className="px-4 py-3">{scopedCases.find((caseRecord) => caseRecord.operationalParticipantId === operationalParticipant.id)?.caseType}</td>
              <td className="px-4 py-3"><StatusBadge status={operationalParticipant.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={operationalParticipant.completedTasks} total={operationalParticipant.totalTasks} /></td>
              <td className="px-4 py-3">
                {operationalParticipant.status === "complete"
                  ? "Approved"
                  : operationalParticipant.status === "attention"
                    ? "More evidence requested"
                    : "Case in progress"}
              </td>
            </tr>
          ))}
        </ResourceTable>
      </section>
      <p className="mt-4 text-sm text-[#505a5f] dark:text-muted-foreground">
        Visible task completion: {completedTasks} of {totalTasks}.
      </p>
    </ConsoleLayout>
  );
}

export function AdminHome() {
  const { user } = useAuth();
  if (user.role !== "owning-organisation-admin") return <Navigate to="/" replace />;

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[{ label: "Administration" }]}
      sidebarItems={adminSidebar}
    >
      <PageTitle
        eyebrow="Administration"
        title="Platform configuration"
        description="Configure case types, operational participant roles, task templates, and access to the management console."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminResources.map((resource) => {
          const Icon = resource.Icon;
          return (
            <Link
              key={resource.path}
              to={resource.path}
              className="border border-[#b1b4b6] bg-white p-4 hover:border-[#1d70b8] dark:bg-card"
            >
              <Icon className="mb-4 size-7 text-[#1d70b8]" />
              <span className="block text-lg font-bold text-[#1d70b8]">{resource.name}</span>
              <span className="mt-1 block text-sm text-[#505a5f] dark:text-muted-foreground">{resource.count}</span>
            </Link>
          );
        })}
      </div>
    </ConsoleLayout>
  );
}

export function OperationalParticipantsPage() {
  const { user } = useAuth();
  if (user.role !== "owning-organisation-admin") return <Navigate to="/" replace />;
  const scopedOperationalParticipants = getScopedOperationalParticipants(user);

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[{ label: "Administration", path: "/admin" }, { label: "Operational participants" }]}
      sidebarItems={adminSidebar}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Operational participants"
        description="Select an operational participant to review ownership, cases, participant roles, status, and audit activity."
        actions={
          <Button>
            <Plus />
            Add operational participant
          </Button>
        }
      />
      <ResourceTable headings={["Operational participant", "Owner", "Type", "Status", "Open cases", "Progress", "Last activity"]}>
        {scopedOperationalParticipants.map((operationalParticipant) => (
          <tr key={operationalParticipant.id} className="border-b border-[#b1b4b6] last:border-b-0">
            <td className="px-4 py-3">
              <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/operational-participants/${operationalParticipant.id}`}>
                {operationalParticipant.name}
              </Link>
              <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                Role: {operationalParticipant.operationalRole}
              </span>
            </td>
            <td className="px-4 py-3">{operationalParticipant.owner}</td>
            <td className="px-4 py-3">{operationalParticipant.type}</td>
            <td className="px-4 py-3"><StatusBadge status={operationalParticipant.status} /></td>
            <td className="px-4 py-3">{operationalParticipant.openCases}</td>
            <td className="px-4 py-3"><ProgressBar value={operationalParticipant.completedTasks} total={operationalParticipant.totalTasks} /></td>
            <td className="px-4 py-3">{operationalParticipant.lastActivity}</td>
          </tr>
        ))}
      </ResourceTable>
    </ConsoleLayout>
  );
}

export function OperationalParticipantDetailPage() {
  const { user } = useAuth();
  if (user.role !== "owning-organisation-admin") return <Navigate to="/" replace />;
  const { operationalParticipantId } = useParams();
  const operationalParticipant = getOperationalParticipant(operationalParticipantId);
  if (!operationalParticipant) return <Navigate to="/admin/operational-participants" replace />;
  const scopedOperationalParticipantIds = new Set(getScopedOperationalParticipants(user).map((item) => item.id));
  if (!scopedOperationalParticipantIds.has(operationalParticipant.id)) return <Navigate to="/admin/operational-participants" replace />;

  const participantCases = getScopedCases(user).filter((caseRecord) => caseRecord.operationalParticipantId === operationalParticipant.id);

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[
        { label: "Administration", path: "/admin" },
        { label: "Operational participants", path: "/admin/operational-participants" },
        { label: operationalParticipant.name },
      ]}
      sidebarItems={adminSidebar}
    >
      <PageTitle
        eyebrow="Operational participant"
        title={operationalParticipant.name}
        description="Review ownership, participant roles, case progress, users, and audit activity for this operational participant."
      />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/admin/operational-participants/${operationalParticipant.id}` },
          { label: "Participants", path: `/admin/operational-participants/${operationalParticipant.id}` },
          { label: "Cases", path: `/admin/operational-participants/${operationalParticipant.id}` },
          { label: "Audit", path: `/admin/operational-participants/${operationalParticipant.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Current status", value: operationalParticipant.status.replace("-", " "), tone: operationalParticipant.status === "attention" ? "red" : "blue" },
          { label: "Open cases", value: String(operationalParticipant.openCases), tone: "blue" },
          { label: "Tasks complete", value: `${operationalParticipant.completedTasks}/${operationalParticipant.totalTasks}`, tone: "green" },
          { label: "Owner", value: operationalParticipant.owner, tone: "yellow" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Cases</h3>
        <ResourceTable headings={["Case", "Type", "Status", "Progress", "Risk", "Outcome"]}>
          {participantCases.map((caseRecord) => (
            <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${caseRecord.id}`}>
                  {caseRecord.title}
                </Link>
              </td>
              <td className="px-4 py-3">{caseRecord.caseType}</td>
              <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} /></td>
              <td className="px-4 py-3 capitalize">{caseRecord.risk}</td>
              <td className="px-4 py-3">{caseRecord.outcome}</td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function CaseManagementHome() {
  const { user } = useAuth();
  if (user.role === "interested-party") return <Navigate to="/verification" replace />;
  const owningOrganisation = getOwningOrganisation(user.owningOrganisationId ?? undefined);
  const scopedOperationalParticipants = getScopedOperationalParticipants(user);
  const scopedCases = getScopedCases(user);
  const primaryParticipant = scopedOperationalParticipants[0];
  const primaryCase = scopedCases[0];
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);
  const blockedTasks = scopedCases.flatMap((caseRecord) => caseRecord.tasks).filter((task) => task.status === "attention").length;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[{ label: "Case Management" }]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Case Management"
        title="Case workspace"
        description="Open cases, complete tasks, upload evidence, and inspect the interested-party assurance view."
        actions={
          <Button asChild>
            <Link to="/cases/list">
              <Plus />
              New case
            </Link>
          </Button>
        }
      />
      <MetricStrip
        items={[
          { label: "Owning organisation", value: owningOrganisation?.name ?? "None", tone: "blue" },
          { label: "Active participant", value: primaryParticipant?.name ?? "None", tone: "blue" },
          { label: "Active case", value: primaryCase?.title ?? "None", tone: "yellow" },
          { label: "Completed tasks", value: `${completedTasks} / ${totalTasks}`, tone: "green" },
          { label: "Blocked tasks", value: String(blockedTasks), tone: "red" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Active case</h3>
        {primaryCase && (
          <Link
            to={`/cases/${primaryCase.id}`}
            className="block border border-[#b1b4b6] bg-white p-5 hover:border-[#1d70b8] dark:bg-card"
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-2xl font-bold text-[#1d70b8]">{primaryCase.title}</p>
                <p className="mt-1 text-sm text-[#505a5f] dark:text-muted-foreground">{primaryParticipant?.name}</p>
              </div>
              <StatusBadge status={primaryCase.status} />
            </div>
            <div className="mt-5 max-w-xl">
              <ProgressBar value={primaryCase.completedTasks} total={primaryCase.totalTasks} />
            </div>
          </Link>
        )}
      </section>
    </ConsoleLayout>
  );
}

export function CasesListPage() {
  const { user } = useAuth();
  if (user.role === "interested-party") return <Navigate to="/verification" replace />;
  const scopedCases = getScopedCases(user);

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[{ label: "Case Management", path: "/cases" }, { label: "Cases" }]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Cases"
        description="Configured case instances across service, compliance, renewal, and assurance workflows."
      />
      <ResourceTable headings={["Case", "Organisation", "Type", "Status", "Progress", "Risk", "Last activity"]}>
        {scopedCases.map((caseRecord) => {
          const operationalParticipant = getOperationalParticipant(caseRecord.operationalParticipantId);
          return (
            <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${caseRecord.id}`}>
                  {caseRecord.title}
                </Link>
              </td>
              <td className="px-4 py-3">{operationalParticipant?.name}</td>
              <td className="px-4 py-3">{caseRecord.caseType}</td>
              <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} /></td>
              <td className="px-4 py-3 capitalize">{caseRecord.risk}</td>
              <td className="px-4 py-3">{caseRecord.lastActivity}</td>
            </tr>
          );
        })}
      </ResourceTable>
    </ConsoleLayout>
  );
}

export function CaseDetailPage() {
  const { user } = useAuth();
  if (user.role === "interested-party") return <Navigate to="/verification" replace />;
  const { caseId } = useParams();
  const caseRecord = getCase(caseId);
  if (!caseRecord) return <Navigate to="/cases/list" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/cases/list" replace />;

  const operationalParticipant = getOperationalParticipant(caseRecord.operationalParticipantId);
  const tasks = caseRecord.tasks;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[
        { label: "Case Management", path: "/cases" },
        { label: "Cases", path: "/cases/list" },
        { label: `${operationalParticipant?.name ?? "Organisation"} ${caseRecord.reference}` },
      ]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Case"
        title={caseRecord.title}
        description={`${operationalParticipant?.name ?? "Unknown organisation"} ${caseRecord.caseType.toLowerCase()} for task completion, evidence collection, review, and outcome visibility.`}
      />
      <Tabs
        current="Summary"
        tabs={[
          { label: "Summary", path: `/cases/${caseRecord.id}` },
          { label: "Tasks", path: `/cases/${caseRecord.id}` },
          { label: "Evidence", path: `/cases/${caseRecord.id}` },
          { label: "Activity", path: `/cases/${caseRecord.id}` },
          { label: "Review", path: `/cases/${caseRecord.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Case status", value: caseRecord.status, tone: caseRecord.status === "review" ? "yellow" : "blue" },
          { label: "Tasks complete", value: `${caseRecord.completedTasks}/${caseRecord.totalTasks}`, tone: "green" },
          { label: "Risk", value: caseRecord.risk, tone: caseRecord.risk === "high" ? "red" : "yellow" },
          { label: "Reference", value: caseRecord.reference, tone: "blue" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Tasks</h3>
        <div className="grid gap-3">
          {tasks.map((task) => {
            const Icon = task.Icon;
            return (
              <Link
                key={task.id}
                to={`/cases/${caseRecord.id}/tasks/${task.id}`}
                className="grid gap-4 border border-[#b1b4b6] bg-white p-4 hover:border-[#1d70b8] dark:bg-card md:grid-cols-[auto_1fr_auto]"
              >
                <span className="flex size-11 items-center justify-center rounded-sm bg-[#eaf4fb] text-[#1d70b8]">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold text-[#1d70b8]">{task.title}</span>
                  <span className="mt-1 block text-sm text-[#505a5f] dark:text-muted-foreground">{task.description}</span>
                  <span className="mt-2 block text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
                    Owner: {task.owner} | Due: {task.due}
                  </span>
                </span>
                <span className="self-start"><StatusBadge status={task.status} /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </ConsoleLayout>
  );
}

export function TaskDetailPage() {
  const { user } = useAuth();
  if (user.role === "interested-party") return <Navigate to="/verification" replace />;
  const { caseId, taskId } = useParams();
  const caseRecord = getCase(caseId);
  const task = getTask(caseId, taskId);
  if (!caseRecord || !task) return <Navigate to="/cases/list" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/cases/list" replace />;

  const operationalParticipant = getOperationalParticipant(caseRecord.operationalParticipantId);
  const Icon = task.Icon;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[
        { label: "Case Management", path: "/cases" },
        { label: "Cases", path: "/cases/list" },
        { label: `${operationalParticipant?.name ?? "Organisation"} ${caseRecord.reference}`, path: `/cases/${caseRecord.id}` },
        { label: task.title },
      ]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Task"
        title={task.title}
        description={task.description}
        actions={
          <Button>
            <Upload />
            Upload evidence
          </Button>
        }
      />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/cases/${caseRecord.id}/tasks/${task.id}` },
          { label: "Uploads", path: `/cases/${caseRecord.id}/tasks/${task.id}` },
          { label: "History", path: `/cases/${caseRecord.id}/tasks/${task.id}` },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-[#b1b4b6] bg-white p-5 dark:bg-card">
          <div className="flex items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-sm bg-[#eaf4fb] text-[#1d70b8]">
              <Icon className="size-6" />
            </span>
            <div>
              <StatusBadge status={task.status} />
              <h3 className="mt-4 text-xl font-bold">Work area</h3>
              <p className="mt-2 text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                Manage evidence, generated review signals, submission state, and audit history for this case task.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Upload new evidence", Icon: Upload },
              { label: "View current file", Icon: FileText },
              { label: "Review AI tags", Icon: CheckCircle2 },
              { label: "Submit for review", Icon: Activity },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex items-center gap-3 border border-[#b1b4b6] bg-[#f8f8f8] p-4 text-left font-bold hover:border-[#1d70b8] dark:bg-background"
              >
                <action.Icon className="size-5 text-[#1d70b8]" />
                {action.label}
              </button>
            ))}
          </div>
        </section>
        <aside className="border border-[#b1b4b6] bg-white p-5 dark:bg-card">
          <h3 className="text-xl font-bold">Details</h3>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Owner</dt>
              <dd>{task.owner}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Due date</dt>
              <dd>{task.due}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Type</dt>
              <dd>{task.type}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Timeline</dt>
              <dd className="mt-2 flex items-center gap-2">
                <Clock3 className="size-4 text-[#1d70b8]" />
                Last updated today
              </dd>
              <dd className="mt-2 flex items-center gap-2">
                <History className="size-4 text-[#1d70b8]" />
                4 audit events
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </ConsoleLayout>
  );
}

export function PlaceholderResourcePage({ app }: { app: "admin" | "cases" }) {
  const isAdmin = app === "admin";
  return (
    <ConsoleLayout
      appName={isAdmin ? "Administration" : "Case Management"}
      appDescription={isAdmin ? "Configuration for case types, participants, workflow, and review." : "Operational workspace for case tasks, forms, evidence, and workflow."}
      breadcrumbs={[
        { label: isAdmin ? "Administration" : "Case Management", path: isAdmin ? "/admin" : "/cases" },
        { label: "Resource area" },
      ]}
      sidebarItems={isAdmin ? adminSidebar : caseSidebar}
    >
      <PageTitle
        eyebrow="Resource console"
        title="Coming next"
        description="This resource area is ready for the next implementation lesson."
      />
    </ConsoleLayout>
  );
}
