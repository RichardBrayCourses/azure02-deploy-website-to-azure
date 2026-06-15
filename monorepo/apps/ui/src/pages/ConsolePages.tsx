import { Button } from "@/components/ui/button";
import { ConsoleLayout, MetricStrip, PageTitle, Tabs } from "@/components/ConsoleLayout";
import { useAuth } from "@/context/AuthContext";
import {
  adminResources,
  getCase,
  getTask,
  getStakeholder,
  getParticipant,
  getAuthority,
  getScopedCases,
  getScopedParticipants,
  Status,
} from "@/data/console";
import { cn } from "@/lib/utils";
import {
  Activity,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Plus,
  Upload,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

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

export function StakeholderPortalPage() {
  const { user } = useAuth();
  if (user.role !== "stakeholder") return <Navigate to="/" replace />;
  const scopedParticipants = getScopedParticipants(user);
  const scopedCases = getScopedCases(user);
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);

  return (
    <ConsoleLayout
      breadcrumbs={[{ label: "Stakeholder Portal" }]}
      readOnly
    >
      <PageTitle
        eyebrow="Stakeholder"
        title="Case visibility"
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
        <ResourceTable headings={["Organization", "Visible case", "Status", "Tasks", "Visible outcome"]}>
          {scopedParticipants.map((participant) => {
            const stakeholder = getStakeholder(participant.stakeholderId);
            const visibleCase = scopedCases.find((caseRecord) => caseRecord.participantId === participant.id);
            return (
              <tr key={participant.id} className="border-b border-[#b1b4b6] last:border-b-0">
                <td className="px-4 py-3">
                  <span className="font-bold text-[#1d70b8]">{participant.name}</span>
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                    {stakeholder?.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {visibleCase ? (
                    <>
                      <Link className="font-bold text-[#1d70b8] hover:underline" to={`/stakeholder/${visibleCase.id}`}>
                        {visibleCase.title}
                      </Link>
                      <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                        {visibleCase.caseType}
                      </span>
                    </>
                  ) : (
                    "No visible case"
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={participant.status} /></td>
                <td className="px-4 py-3"><ProgressBar value={participant.completedTasks} total={participant.totalTasks} /></td>
                <td className="px-4 py-3">
                  {participant.status === "complete"
                    ? "Approved"
                    : participant.status === "attention"
                      ? "More evidence requested"
                      : "Case in progress"}
                </td>
              </tr>
            );
          })}
        </ResourceTable>
      </section>
      <p className="mt-4 text-sm text-[#505a5f] dark:text-muted-foreground">
        Visible task completion: {completedTasks} of {totalTasks}.
      </p>
    </ConsoleLayout>
  );
}

export function StakeholderCaseDetailPage() {
  const { user } = useAuth();
  if (user.role !== "stakeholder") return <Navigate to="/" replace />;
  const { caseId } = useParams();
  const caseRecord = getCase(caseId);
  if (!caseRecord) return <Navigate to="/stakeholder" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/stakeholder" replace />;

  const participant = getParticipant(caseRecord.participantId);

  return (
    <ConsoleLayout
      breadcrumbs={[
        { label: "Stakeholder Portal", path: "/stakeholder" },
        { label: `${participant?.name ?? "Organization"} ${caseRecord.reference}` },
      ]}
      readOnly
    >
      <PageTitle
        eyebrow="Read-only case"
        title={caseRecord.title}
        description={`${participant?.name ?? "Unknown organization"} ${caseRecord.caseType.toLowerCase()} status, task completion, and visible outcome.`}
      />
      <MetricStrip
        items={[
          { label: "Case status", value: caseRecord.status, tone: caseRecord.status === "closed" ? "green" : "blue" },
          { label: "Tasks complete", value: `${caseRecord.completedTasks}/${caseRecord.totalTasks}`, tone: "green" },
          { label: "Risk", value: caseRecord.risk, tone: caseRecord.risk === "high" ? "red" : "yellow" },
          { label: "Reference", value: caseRecord.reference, tone: "blue" },
        ]}
      />
      <section className="mt-8 border border-[#b1b4b6] bg-white p-5 dark:bg-card">
        <h3 className="text-xl font-bold">Visible outcome</h3>
        <p className="mt-2 text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">{caseRecord.outcome}</p>
      </section>
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Task status</h3>
        <ResourceTable headings={["Task", "Type", "Status", "Due", "Visible summary"]}>
          {caseRecord.tasks.map((task) => (
            <tr key={task.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3 font-bold text-[#0b0c0c] dark:text-white">{task.title}</td>
              <td className="px-4 py-3">{task.type}</td>
              <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
              <td className="px-4 py-3">{task.due}</td>
              <td className="px-4 py-3">{task.description}</td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function AdminHome() {
  const { user } = useAuth();
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;

  return (
    <ConsoleLayout
      affirmativeActionCompleteLabel="Applied"
      affirmativeActionLabel="Apply"
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[{ label: "Administration" }]}
    >
      <PageTitle
        eyebrow="Administration"
        title="Platform configuration"
        description="Configure case types, participant roles, task templates, and access to the management console."
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

export function ParticipantsPage() {
  const { user } = useAuth();
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const scopedParticipants = getScopedParticipants(user);

  return (
    <ConsoleLayout
      affirmativeActionCompleteLabel="Updated"
      affirmativeActionLabel="Update"
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[{ label: "Administration", path: "/admin" }, { label: "Participants" }]}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Participants"
        description="Select a participant to review organization links, cases, participant roles, status, and audit activity."
        actions={
          <Button>
            <Plus />
            Add
          </Button>
        }
      />
      <ResourceTable headings={["Participant", "Type", "Status", "Open cases", "Progress", "Last activity"]}>
        {scopedParticipants.map((participant) => (
          <tr key={participant.id} className="border-b border-[#b1b4b6] last:border-b-0">
            <td className="px-4 py-3">
              <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/participants/${participant.id}`}>
                {participant.name}
              </Link>
              <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                Role: {participant.participantRole}
              </span>
            </td>
            <td className="px-4 py-3">{participant.type}</td>
            <td className="px-4 py-3"><StatusBadge status={participant.status} /></td>
            <td className="px-4 py-3">{participant.openCases}</td>
            <td className="px-4 py-3"><ProgressBar value={participant.completedTasks} total={participant.totalTasks} /></td>
            <td className="px-4 py-3">{participant.lastActivity}</td>
          </tr>
        ))}
      </ResourceTable>
    </ConsoleLayout>
  );
}

export function ParticipantDetailPage() {
  const { user } = useAuth();
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const { participantId } = useParams();
  const participant = getParticipant(participantId);
  if (!participant) return <Navigate to="/admin/participants" replace />;
  const scopedParticipantIds = new Set(getScopedParticipants(user).map((item) => item.id));
  if (!scopedParticipantIds.has(participant.id)) return <Navigate to="/admin/participants" replace />;

  const participantCases = getScopedCases(user).filter((caseRecord) => caseRecord.participantId === participant.id);
  const stakeholder = getStakeholder(participant.stakeholderId);

  return (
    <ConsoleLayout
      affirmativeActionCompleteLabel="Saved"
      affirmativeActionLabel="Save"
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[
        { label: "Administration", path: "/admin" },
        { label: "Participants", path: "/admin/participants" },
        { label: participant.name },
      ]}
    >
      <PageTitle
        eyebrow="Participant"
        title={participant.name}
        description="Review organization links, participant roles, case progress, users, and audit activity for this participant."
      />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/admin/participants/${participant.id}` },
          { label: "Participants", path: `/admin/participants/${participant.id}` },
          { label: "Cases", path: `/admin/participants/${participant.id}` },
          { label: "Audit", path: `/admin/participants/${participant.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Current status", value: participant.status.replace("-", " "), tone: participant.status === "attention" ? "red" : "blue" },
          { label: "Open cases", value: String(participant.openCases), tone: "blue" },
          { label: "Tasks complete", value: `${participant.completedTasks}/${participant.totalTasks}`, tone: "green" },
          { label: "Stakeholder", value: stakeholder?.name ?? "None", tone: "yellow" },
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
  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  const authority = getAuthority(user.authorityId ?? undefined);
  const isAuthorityAdmin = user.role === "authority-admin";
  const scopedCases = getScopedCases(user);
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);
  const blockedTasks = scopedCases.flatMap((caseRecord) => caseRecord.tasks).filter((task) => task.status === "attention").length;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[{ label: "Case Management" }]}
      readOnly
    >
      <PageTitle
        eyebrow="Case Management"
        title="Cases"
        description="Configured case instances across service, compliance, renewal, and stakeholder visibility workflows."
        actions={
          <Button asChild>
            <Link to="/cases">
              <Plus />
              Create
            </Link>
          </Button>
        }
      />
      <MetricStrip
        items={[
          { label: "Authority", value: authority?.name ?? "None", tone: "blue" },
          { label: "Cases", value: String(scopedCases.length), tone: "blue" },
          { label: "Completed tasks", value: `${completedTasks} / ${totalTasks}`, tone: "green" },
          { label: "Blocked tasks", value: String(blockedTasks), tone: "red" },
        ]}
      />
      <section className="mt-8">
        <ResourceTable
          headings={
            isAuthorityAdmin
              ? ["Case", "Participant", "Type", "Status", "Progress", "Risk", "Last activity"]
              : ["Case", "Type", "Status", "Progress", "Risk", "Last activity"]
          }
        >
          {scopedCases.map((caseRecord) => {
            const participant = getParticipant(caseRecord.participantId);
            return (
              <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
                <td className="px-4 py-3">
                  <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${caseRecord.id}`}>
                    {caseRecord.title}
                  </Link>
                </td>
                {isAuthorityAdmin && <td className="px-4 py-3">{participant?.name}</td>}
                <td className="px-4 py-3">{caseRecord.caseType}</td>
                <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
                <td className="px-4 py-3"><ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} /></td>
                <td className="px-4 py-3 capitalize">{caseRecord.risk}</td>
                <td className="px-4 py-3">{caseRecord.lastActivity}</td>
              </tr>
            );
          })}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function CaseDetailPage() {
  const { user } = useAuth();
  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  const { caseId } = useParams();
  const caseRecord = getCase(caseId);
  if (!caseRecord) return <Navigate to="/cases" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/cases" replace />;

  const participant = getParticipant(caseRecord.participantId);
  const tasks = caseRecord.tasks;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[
        { label: "Case Management", path: "/cases" },
        { label: `${participant?.name ?? "Organization"} ${caseRecord.reference}` },
      ]}
      readOnly
    >
      <PageTitle
        eyebrow="Case"
        title={caseRecord.title}
        description={`${participant?.name ?? "Unknown organization"} ${caseRecord.caseType.toLowerCase()} for task completion, evidence collection, review, and outcome visibility.`}
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
                    Due: {task.due}
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
  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  const { caseId, taskId } = useParams();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setIsEdited(false);
  }, [caseId, taskId]);

  const caseRecord = getCase(caseId);
  const task = getTask(caseId, taskId);
  if (!caseRecord || !task) return <Navigate to="/cases" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/cases" replace />;

  const participant = getParticipant(caseRecord.participantId);
  const Icon = task.Icon;

  function uploadEvidence() {
    setIsEdited(true);
  }

  function submitTaskUpdate() {
    setIsEdited(false);
  }

  return (
    <ConsoleLayout
      affirmativeActionCompleteLabel="Submitted"
      affirmativeActionLabel="Submit"
      appName="Case Management"
      appDescription="Operational workspace for case tasks, forms, evidence, and workflow."
      breadcrumbs={[
        { label: "Case Management", path: "/cases" },
        { label: `${participant?.name ?? "Organization"} ${caseRecord.reference}`, path: `/cases/${caseRecord.id}` },
        { label: task.title },
      ]}
      isEdited={isEdited}
      onAffirmativeAction={submitTaskUpdate}
    >
      <PageTitle
        eyebrow="Task"
        title={task.title}
        description={task.description}
        actions={
          <Button onClick={uploadEvidence}>
            <Upload />
            Upload
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
              { label: "Upload", Icon: Upload },
              { label: "View", Icon: FileText },
              { label: "Review", Icon: CheckCircle2 },
              { label: "Submit", Icon: Activity },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex items-center gap-3 border border-[#b1b4b6] bg-[#f8f8f8] p-4 text-left font-bold hover:border-[#1d70b8] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background"
                onClick={action.label === "Upload" ? uploadEvidence : action.label === "Submit" ? submitTaskUpdate : undefined}
                disabled={action.label === "Submit" && !isEdited}
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
      affirmativeActionCompleteLabel="Updated"
      affirmativeActionLabel="Update"
      appName={isAdmin ? "Administration" : "Case Management"}
      appDescription={isAdmin ? "Configuration for case types, participants, workflow, and review." : "Operational workspace for case tasks, forms, evidence, and workflow."}
      breadcrumbs={[
        { label: isAdmin ? "Administration" : "Case Management", path: isAdmin ? "/admin" : "/cases" },
        { label: "Resource area" },
      ]}
    >
      <PageTitle
        eyebrow="Resource console"
        title="Coming next"
        description="This resource area is ready for the next implementation lesson."
      />
    </ConsoleLayout>
  );
}
