import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsoleLayout, MetricStrip, PageTitle, Tabs } from "@/components/ConsoleLayout";
import ResourceActionPanel from "@/components/ResourceActionPanel";
import { useAuth } from "@/context/AuthContext";
import { useDomainData } from "@/context/DomainDataContext";
import {
  adminResources,
  authenticatableUsers,
  getCase,
  getTask,
  getStakeholder,
  getParticipant,
  getAuthority,
  getCaseTemplate,
  getCaseTemplateParticipants,
  getCaseTemplateTasks,
  getCaseTemplatesForAuthority,
  getAccessGrantsForParticipant,
  getGrantableStakeholdersForParticipant,
  getSubscriberReviewForCase,
  getScopedCases,
  getScopedParticipants,
  getStakeholdersForAuthority,
  AccessGrantPermissionLevel,
  AccessGrantStatus,
  AccessGrantGranteeType,
  MembershipRole,
  PartyType,
  SubscriberReviewStatus,
  Status,
  taskTypes,
} from "@/data/console";
import type { Task } from "@/data/console";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock3,
  History,
  Plus,
  Rocket,
  Save,
  SendHorizontal,
  Upload,
  UserPlus,
  XCircle,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

function StatusBadge({ status }: { status: Status | "open" | "closed" | "review" }) {
  const classes = {
    complete: "bg-[#00703c] text-white",
    "in-progress": "bg-[#1d70b8] text-white",
    attention: "bg-[#d4351c] text-white",
    "not-started": "bg-[#f3f2f1] text-[#0b0c0c] ring-1 ring-[#b1b4b6]",
    withdrawn: "bg-[#505a5f] text-white",
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

function GrantStatusBadge({ status }: { status: AccessGrantStatus }) {
  const classes: Record<AccessGrantStatus, string> = {
    INVITED: "bg-[#ffdd00] text-[#0b0c0c]",
    ACTIVE: "bg-[#00703c] text-white",
    SUSPENDED: "bg-[#505a5f] text-white",
    REVOKED: "bg-[#d4351c] text-white",
    EXPIRED: "bg-[#f3f2f1] text-[#0b0c0c] ring-1 ring-[#b1b4b6]",
  };

  return (
    <span className={cn("inline-flex rounded-sm px-2 py-1 text-xs font-bold uppercase", classes[status])}>
      {status.replace("_", " ").toLowerCase()}
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

function FormField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-bold text-[#0b0c0c] dark:text-white">{label}</span>
      {children}
    </label>
  );
}

function SelectField({
  children,
  value,
  onChange,
}: {
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className="h-9 w-full border border-input bg-white px-3 text-sm shadow-xs outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 dark:bg-input/30"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-sm font-bold text-[#d4351c]">{message}</p>;
}

function stakeholderCanSeeEvidence(task: Task) {
  return task.domainStatus === "SUBMITTED" || task.domainStatus === "PASSED" || task.domainStatus === "FAILED";
}

function EvidenceMetadataList({ task }: { task: Task }) {
  if (!stakeholderCanSeeEvidence(task)) {
    return <span className="text-sm text-[#505a5f] dark:text-muted-foreground">Visible after submission</span>;
  }

  if (task.evidenceFiles.length === 0) {
    return <span className="text-sm text-[#505a5f] dark:text-muted-foreground">No evidence metadata</span>;
  }

  return (
    <ul className="grid gap-1 text-sm">
      {task.evidenceFiles.map((file) => (
        <li key={`${task.id}-${file.name}-${file.uploadedAt}`}>
          <span className="font-bold text-[#1d70b8]">{file.name}</span>
          <span className="block text-xs text-[#505a5f] dark:text-muted-foreground">
            {file.size} · {new Date(file.uploadedAt).toLocaleString("en-GB")}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AdministrationResourceNav() {
  const location = useLocation();

  return (
    <nav aria-label="Administration resources" className="mb-6 border-b border-[#b1b4b6]">
      <div className="flex gap-1 overflow-x-auto">
        {adminResources.map((resource) => {
          const isCurrent =
            location.pathname === resource.path ||
            (resource.path !== "/admin" && location.pathname.startsWith(`${resource.path}/`));
          return (
            <Button
              key={resource.path}
              asChild
              variant="ghost"
              className={cn(
                "h-11 rounded-none border-b-4 border-transparent px-4 font-bold",
                isCurrent && "border-[#1d70b8] bg-white dark:bg-card",
              )}
            >
              <Link to={resource.path}>{resource.name}</Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

export function StakeholderPortalPage() {
  const { user } = useAuth();
  if (user.role !== "stakeholder") return <Navigate to="/" replace />;
  const scopedParticipants = getScopedParticipants(user);
  const scopedCases = getScopedCases(user);
  const reviewSummaries = scopedCases.map((caseRecord) => getSubscriberReviewForCase(user, caseRecord.id));
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);

  return (
    <ConsoleLayout
      breadcrumbs={[{ label: "Subscriber Portal" }]}
      readOnly
    >
      <PageTitle
        eyebrow="Subscriber"
        title="Granted vendor DDQ packs"
        description="Read submitted vendor due diligence, evidence metadata, and your subscriber-owned review status."
      />
      <MetricStrip
        items={[
          { label: "Granted vendors", value: String(scopedParticipants.length), tone: "blue" },
          { label: "Visible DDQ packs", value: String(scopedCases.length), tone: "blue" },
          { label: "Approved by subscriber", value: String(reviewSummaries.filter((review) => review?.status === "APPROVED").length), tone: "green" },
          { label: "More info requested", value: String(reviewSummaries.filter((review) => review?.status === "MORE_INFO_REQUESTED").length), tone: "red" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Visible DDQ pack status</h3>
        <ResourceTable headings={["Vendor", "Visible DDQ pack", "Vendor status", "Progress", "Subscriber review"]}>
          {scopedParticipants.map((participant) => {
            const visibleCase = scopedCases.find((caseRecord) => caseRecord.participantId === participant.id);
            const review = getSubscriberReviewForCase(user, visibleCase?.id);
            return (
              <tr key={participant.id} className="border-b border-[#b1b4b6] last:border-b-0">
                <td className="px-4 py-3">
                  <Link className="font-bold text-[#1d70b8] hover:underline" to={`/stakeholder/participants/${participant.id}`}>
                    {participant.name}
                  </Link>
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                    Vendor workspace granted to this subscriber
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
                <td className="px-4 py-3">{review?.statusLabel ?? "Not reviewed"}</td>
              </tr>
            );
          })}
        </ResourceTable>
      </section>
      <p className="mt-4 text-sm text-[#505a5f] dark:text-muted-foreground">
        Visible due diligence item progress across granted vendors: {completedTasks} of {totalTasks}.
      </p>
    </ConsoleLayout>
  );
}

export function StakeholderParticipantDetailPage() {
  const { user } = useAuth();
  if (user.role !== "stakeholder") return <Navigate to="/" replace />;
  const { participantId } = useParams();
  const participant = getScopedParticipants(user).find((item) => item.id === participantId);
  if (!participant) return <Navigate to="/stakeholder" replace />;

  const participantCases = getScopedCases(user).filter((caseRecord) => caseRecord.participantId === participant.id);
  const openCases = participantCases.filter((caseRecord) => caseRecord.status !== "closed").length;
  const attentionTasks = participantCases.flatMap((caseRecord) => caseRecord.tasks).filter((task) => task.status === "attention").length;

  return (
    <ConsoleLayout
      breadcrumbs={[
        { label: "Subscriber Portal", path: "/stakeholder" },
        { label: participant.name },
      ]}
      readOnly
    >
      <PageTitle
        eyebrow="Read-only vendor"
        title={participant.name}
        description="Granted DDQ packs, due diligence item outcomes, and submitted evidence metadata for subscriber review."
      />
      <MetricStrip
        items={[
          { label: "Visible DDQ packs", value: String(participantCases.length), tone: "blue" },
          { label: "Open DDQ packs", value: String(openCases), tone: "yellow" },
          { label: "Items complete", value: `${participant.completedTasks}/${participant.totalTasks}`, tone: "green" },
          { label: "Needs attention", value: String(attentionTasks), tone: attentionTasks > 0 ? "red" : "green" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Visible DDQ packs</h3>
        <ResourceTable headings={["DDQ pack", "Vendor status", "Progress", "Subscriber review", "Last activity"]}>
          {participantCases.map((caseRecord) => {
            const review = getSubscriberReviewForCase(user, caseRecord.id);
            return (
              <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
                <td className="px-4 py-3">
                  <Link className="font-bold text-[#1d70b8] hover:underline" to={`/stakeholder/${caseRecord.id}`}>
                    {caseRecord.title}
                  </Link>
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                    {caseRecord.caseType}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
                <td className="px-4 py-3"><ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} /></td>
                <td className="px-4 py-3">{review?.statusLabel ?? "Not reviewed"}</td>
                <td className="px-4 py-3">{caseRecord.lastActivity}</td>
              </tr>
            );
          })}
        </ResourceTable>
      </section>
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Due diligence item outcomes and evidence</h3>
        <ResourceTable headings={["DDQ pack", "Due diligence item", "Outcome", "Evidence metadata"]}>
          {participantCases.flatMap((caseRecord) =>
            caseRecord.tasks.map((task) => (
              <tr key={`${caseRecord.id}-${task.id}`} className="border-b border-[#b1b4b6] last:border-b-0">
                <td className="px-4 py-3">
                  <Link className="font-bold text-[#1d70b8] hover:underline" to={`/stakeholder/${caseRecord.id}`}>
                    {caseRecord.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="block font-bold">{task.title}</span>
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{task.type}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                  <span className="mt-2 block text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
                    {task.domainStatus.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3"><EvidenceMetadataList task={task} /></td>
              </tr>
            )),
          )}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function StakeholderCaseDetailPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const { caseId } = useParams();
  const [reviewStatus, setReviewStatus] = useState<SubscriberReviewStatus>("IN_REVIEW");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const caseRecord = getCase(caseId);
  const subscriberReview = getSubscriberReviewForCase(user, caseRecord?.id);

  useEffect(() => {
    setReviewStatus(subscriberReview?.status ?? "IN_REVIEW");
    setReviewNote(subscriberReview?.note ?? "");
    setReviewError(null);
  }, [subscriberReview?.id, subscriberReview?.note, subscriberReview?.status]);

  if (user.role !== "stakeholder") return <Navigate to="/" replace />;
  if (!caseRecord) return <Navigate to="/stakeholder" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/stakeholder" replace />;

  const participant = getParticipant(caseRecord.participantId);

  function saveSubscriberReview() {
    setReviewError(null);
    if (!user.stakeholderId || !user.authenticatableUserId) {
      setReviewError("No subscriber context is selected for this session.");
      return;
    }
    try {
      db.upsertSubscriberReview({
        stakeholderId: user.stakeholderId,
        caseId: caseRecord?.id ?? "",
        status: reviewStatus,
        note: reviewNote.trim(),
        reviewedByUserId: user.authenticatableUserId,
      });
      refresh();
    } catch (caught) {
      setReviewError(caught instanceof Error ? caught.message : "Subscriber review could not be saved.");
    }
  }

  return (
    <ConsoleLayout
      breadcrumbs={[
        { label: "Subscriber Portal", path: "/stakeholder" },
        { label: `${participant?.name ?? "Organization"} ${caseRecord.reference}` },
      ]}
    >
      <PageTitle
        eyebrow="Subscriber review"
        title={caseRecord.title}
        description={`${participant?.name ?? "Unknown vendor"} ${caseRecord.caseType.toLowerCase()} status, due diligence item completion, and subscriber-owned review outcome.`}
      />
      <MetricStrip
        items={[
          { label: "Vendor pack status", value: caseRecord.status, tone: caseRecord.status === "closed" ? "green" : "blue" },
          { label: "Items complete", value: `${caseRecord.completedTasks}/${caseRecord.totalTasks}`, tone: "green" },
          { label: "Risk", value: caseRecord.risk, tone: caseRecord.risk === "high" ? "red" : "yellow" },
          { label: "Subscriber review", value: subscriberReview?.statusLabel ?? "Not reviewed", tone: subscriberReview?.status === "APPROVED" ? "green" : "yellow" },
        ]}
      />
      <section className="mt-8 border border-[#b1b4b6] bg-white p-5 dark:bg-card">
        <h3 className="text-xl font-bold">Vendor pack outcome</h3>
        <p className="mt-2 text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">{caseRecord.outcome}</p>
      </section>
      <section className="mt-8 border border-[#b1b4b6] bg-white p-5 dark:bg-card">
        <h3 className="text-xl font-bold">Subscriber review</h3>
        <FormError message={reviewError} />
        <div className="mt-4 grid gap-4 lg:grid-cols-[16rem_1fr_auto] lg:items-end">
          <FormField label="Review status">
            <SelectField value={reviewStatus} onChange={(value) => setReviewStatus(value as SubscriberReviewStatus)}>
              <option value="NOT_REVIEWED">Not reviewed</option>
              <option value="IN_REVIEW">In review</option>
              <option value="APPROVED">Approved</option>
              <option value="MORE_INFO_REQUESTED">More information requested</option>
            </SelectField>
          </FormField>
          <FormField label="Subscriber note">
            <Input value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} />
          </FormField>
          <Button type="button" onClick={saveSubscriberReview}>
            <Save />
            Save review
          </Button>
        </div>
        {subscriberReview && (
          <p className="mt-3 text-sm text-[#505a5f] dark:text-muted-foreground">
            Last saved by {subscriberReview.reviewedByName} on {new Date(subscriberReview.reviewedAt).toLocaleString("en-GB")}.
          </p>
        )}
      </section>
      <section className="mt-8 border border-[#b1b4b6] bg-white p-5 dark:bg-card">
        <h3 className="text-xl font-bold">Vendor performance</h3>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Progress</dt>
            <dd className="mt-2"><ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} /></dd>
          </div>
          <div>
            <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Recent activity</dt>
            <dd className="mt-2">{caseRecord.lastActivity}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Visible status</dt>
            <dd className="mt-2">
              {caseRecord.status === "closed"
                ? "Completed vendor pack"
                : caseRecord.risk === "high"
                  ? "Vendor pack needs attention"
                  : "Work in progress"}
            </dd>
          </div>
        </dl>
      </section>
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Due diligence item outcomes and evidence</h3>
        <ResourceTable headings={["Due diligence item", "Status", "Response", "Evidence metadata"]}>
          {caseRecord.tasks.map((task) => (
            <tr key={task.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <span className="block font-bold">{task.title}</span>
                <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{task.type}</span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
                <span className="mt-2 block text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
                  {task.domainStatus.replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3">{task.responseText || "No response visible"}</td>
              <td className="px-4 py-3"><EvidenceMetadataList task={task} /></td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function StakeholdersPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const [showCreate, setShowCreate] = useState(false);
  const [stakeholderType, setStakeholderType] = useState<PartyType>("ORGANISATION");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const scopedStakeholders = getStakeholdersForAuthority(user.authorityId ?? undefined);

  function createStakeholder() {
    setError(null);
    if (!user.authorityId) {
      setError("No authority is selected for this session.");
      return;
    }
    if (!displayName.trim()) {
      setError("Enter a stakeholder name.");
      return;
    }
    try {
      db.createStakeholder({
        authorityId: user.authorityId,
        stakeholderType,
        displayName: displayName.trim(),
        status: "ACTIVE",
      });
      refresh();
      setDisplayName("");
      setStakeholderType("ORGANISATION");
      setShowCreate(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Stakeholder could not be created.");
    }
  }

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
      breadcrumbs={[{ label: "Administration", path: "/admin" }, { label: "Stakeholders" }]}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Stakeholders"
        description="Create stakeholders, manage their users, and grant participant monitoring access."
        actions={
          <Button onClick={() => setShowCreate((current) => !current)}>
            <Plus />
            Create stakeholder
          </Button>
        }
      />
      <AdministrationResourceNav />
      <ResourceActionPanel
        open={showCreate}
        title="Create stakeholder"
        description="Create a stakeholder inside the current authority."
        onClose={() => setShowCreate(false)}
        footer={
          <Button type="button" onClick={createStakeholder}>
            <CheckCircle2 />
            Save
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
          <FormField label="Type">
            <SelectField value={stakeholderType} onChange={(value) => setStakeholderType(value as PartyType)}>
              <option value="ORGANISATION">Organisation</option>
              <option value="PERSON">Person</option>
            </SelectField>
          </FormField>
          <FormField label="Display name">
            <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </FormField>
        </div>
        <div className="mt-3"><FormError message={error} /></div>
      </ResourceActionPanel>
      <ResourceTable headings={["Stakeholder", "Type", "Status", "Participant access"]}>
        {scopedStakeholders.map((stakeholder) => (
          <tr key={stakeholder.id} className="border-b border-[#b1b4b6] last:border-b-0">
            <td className="px-4 py-3">
              <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/stakeholders/${stakeholder.id}`}>
                {stakeholder.name}
              </Link>
            </td>
            <td className="px-4 py-3">{stakeholder.type}</td>
            <td className="px-4 py-3">{stakeholder.status}</td>
            <td className="px-4 py-3">{stakeholder.visibleParticipants} approved</td>
          </tr>
        ))}
      </ResourceTable>
    </ConsoleLayout>
  );
}

export function StakeholderDetailPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const { stakeholderId } = useParams();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<MembershipRole>("MEMBER");
  const [userError, setUserError] = useState<string | null>(null);
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const stakeholder = getStakeholder(stakeholderId);
  if (!stakeholder) return <Navigate to="/admin/stakeholders" replace />;
  const scopedStakeholders = getStakeholdersForAuthority(user.authorityId ?? undefined);
  if (!scopedStakeholders.some((item) => item.id === stakeholder.id)) return <Navigate to="/admin/stakeholders" replace />;
  const stakeholderRecord = stakeholder;

  const stakeholderUsers = authenticatableUsers.filter(
    (account) =>
      account.membership.entityType === "stakeholder" &&
      account.membership.entityId === stakeholderRecord.id,
  );
  const accessibleParticipantIds = new Set(
    db.getAccessibleParticipantsForStakeholder(stakeholderRecord.id).map((participant) => participant.id),
  );
  const accessibleParticipants = getScopedParticipants(user).filter((participant) => accessibleParticipantIds.has(participant.id));

  function createStakeholderUser() {
    setUserError(null);
    if (!newUserName.trim()) {
      setUserError("Enter a user name.");
      return;
    }
    if (!newUserEmail.trim()) {
      setUserError("Enter an email address.");
      return;
    }
    try {
      db.createStakeholderUser(stakeholderRecord.id, {
        displayName: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
      });
      refresh();
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("MEMBER");
      setShowCreateUser(false);
    } catch (caught) {
      setUserError(caught instanceof Error ? caught.message : "Stakeholder user could not be created.");
    }
  }

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
      breadcrumbs={[
        { label: "Administration", path: "/admin" },
        { label: "Stakeholders", path: "/admin/stakeholders" },
        { label: stakeholder.name },
      ]}
    >
      <PageTitle
        eyebrow="Stakeholder"
        title={stakeholder.name}
        description="Manage stakeholder users and approved participant monitoring access."
      />
      <AdministrationResourceNav />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/admin/stakeholders/${stakeholder.id}` },
          { label: "Users", path: `/admin/stakeholders/${stakeholder.id}` },
          { label: "Access", path: `/admin/stakeholders/${stakeholder.id}` },
          { label: "Audit", path: `/admin/stakeholders/${stakeholder.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Current status", value: stakeholder.status.toLowerCase(), tone: "blue" },
          { label: "Type", value: stakeholder.type, tone: "blue" },
          { label: "Users", value: String(stakeholderUsers.length), tone: "green" },
          { label: "Participant access", value: String(accessibleParticipants.length), tone: "yellow" },
        ]}
      />
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Users</h3>
          <Button type="button" onClick={() => setShowCreateUser((current) => !current)}>
            <UserPlus />
            Create user
          </Button>
        </div>
        <ResourceActionPanel
          open={showCreateUser}
          title="Create stakeholder user"
          description="Create a login user that belongs only to this stakeholder."
          onClose={() => setShowCreateUser(false)}
          footer={
            <Button type="button" onClick={createStakeholderUser}>
              <CheckCircle2 />
              Save
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_10rem]">
            <FormField label="Display name">
              <Input value={newUserName} onChange={(event) => setNewUserName(event.target.value)} />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={newUserEmail} onChange={(event) => setNewUserEmail(event.target.value)} />
            </FormField>
            <FormField label="Role">
              <SelectField value={newUserRole} onChange={(value) => setNewUserRole(value as MembershipRole)}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </SelectField>
            </FormField>
          </div>
          <div className="mt-3"><FormError message={userError} /></div>
        </ResourceActionPanel>
        <ResourceTable headings={["User", "Email", "Kind", "Role"]}>
          {stakeholderUsers.map((account) => (
            <tr key={account.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3 font-bold text-[#1d70b8]">{account.name}</td>
              <td className="px-4 py-3">{account.email}</td>
              <td className="px-4 py-3">{account.userKind}</td>
              <td className="px-4 py-3">{account.membershipRole}</td>
            </tr>
          ))}
        </ResourceTable>
      </section>
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Participant access</h3>
        </div>
        <p className="mb-3 max-w-3xl text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
          Vendor due diligence access is granted by the vendor account, not by the authority. This view only shows existing access relationships.
        </p>
        <ResourceTable headings={["Participant", "Type", "Status", "Progress"]}>
          {accessibleParticipants.map((participant) => (
            <tr key={participant.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/participants/${participant.id}`}>
                  {participant.name}
                </Link>
              </td>
              <td className="px-4 py-3">{participant.type}</td>
              <td className="px-4 py-3"><StatusBadge status={participant.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={participant.completedTasks} total={participant.totalTasks} /></td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function CaseTemplatesPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const scopedTemplates = getCaseTemplatesForAuthority(user.authorityId ?? undefined);

  function createTemplate() {
    setError(null);
    if (!user.authorityId) {
      setError("No authority is selected for this session.");
      return;
    }
    if (!name.trim()) {
      setError("Enter a template name.");
      return;
    }
    try {
      db.createCaseTemplate({
        authorityId: user.authorityId,
        name: name.trim(),
        description: description.trim() || "Reusable case template",
      });
      refresh();
      setName("");
      setDescription("");
      setShowCreate(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Template could not be created.");
    }
  }

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
      breadcrumbs={[{ label: "Administration", path: "/admin" }, { label: "Case templates" }]}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Case templates"
        description="Create reusable authority-owned case definitions, add tasks, assign participants, and publish cases."
        actions={
          <Button onClick={() => setShowCreate((current) => !current)}>
            <Plus />
            Create template
          </Button>
        }
      />
      <AdministrationResourceNav />
      <ResourceActionPanel
        open={showCreate}
        title="Create case template"
        description="Create a draft template inside the current authority."
        onClose={() => setShowCreate(false)}
        footer={
          <Button type="button" onClick={createTemplate}>
            <CheckCircle2 />
            Save
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1.5fr]">
          <FormField label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <FormField label="Description">
            <Input value={description} onChange={(event) => setDescription(event.target.value)} />
          </FormField>
        </div>
        <div className="mt-3"><FormError message={error} /></div>
      </ResourceActionPanel>
      <ResourceTable headings={["Template", "Status", "Tasks", "Participants", "Published"]}>
        {scopedTemplates.map((template) => (
          <tr key={template.id} className="border-b border-[#b1b4b6] last:border-b-0">
            <td className="px-4 py-3">
              <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/case-templates/${template.id}`}>
                {template.name}
              </Link>
              <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{template.description}</span>
            </td>
            <td className="px-4 py-3">{template.status}</td>
            <td className="px-4 py-3">{template.taskCount}</td>
            <td className="px-4 py-3">{template.participantCount}</td>
            <td className="px-4 py-3">{template.publishedAt ? "Published" : "Not published"}</td>
          </tr>
        ))}
      </ResourceTable>
    </ConsoleLayout>
  );
}

export function CaseTemplateDetailPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const { templateId } = useParams();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAssignParticipant, setShowAssignParticipant] = useState(false);
  const [withdrawingTaskId, setWithdrawingTaskId] = useState<string | null>(null);
  const [taskTypeId, setTaskTypeId] = useState(taskTypes[0]?.id ?? "");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState<"REQUIRED" | "EXEMPT">("REQUIRED");
  const [exemptionReason, setExemptionReason] = useState("");
  const [taskError, setTaskError] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const template = getCaseTemplate(templateId);
  if (!template) return <Navigate to="/admin/case-templates" replace />;
  const scopedTemplates = getCaseTemplatesForAuthority(user.authorityId ?? undefined);
  const templateRecord = template;
  if (!scopedTemplates.some((item) => item.id === templateRecord.id)) return <Navigate to="/admin/case-templates" replace />;
  const templateTasks = getCaseTemplateTasks(templateRecord.id);
  const templateParticipants = getCaseTemplateParticipants(templateRecord.id);
  const generatedCases = getScopedCases(user).filter((caseRecord) => caseRecord.caseTemplateId === templateRecord.id);
  const assignedParticipantIds = new Set(templateParticipants.map((assignment) => assignment.participantId));
  const assignableParticipants = getScopedParticipants(user).filter((participant) => !assignedParticipantIds.has(participant.id));
  const withdrawingTask = templateTasks.find((task) => task.id === withdrawingTaskId) ?? null;

  function addTask() {
    setTaskError(null);
    if (!taskTypeId) {
      setTaskError("Select a task type.");
      return;
    }
    if (!taskTitle.trim()) {
      setTaskError("Enter a task title.");
      return;
    }
    try {
      db.addTaskToTemplate({
        caseTemplateId: templateRecord.id,
        taskTypeId,
        title: taskTitle.trim(),
        description: taskDescription.trim() || "Configured template task",
        parametersJson: { due: taskDue.trim() || "No due date" },
      });
      refresh();
      setTaskTitle("");
      setTaskDescription("");
      setTaskDue("");
      setShowAddTask(false);
    } catch (caught) {
      setTaskError(caught instanceof Error ? caught.message : "Task could not be added.");
    }
  }

  function assignParticipant() {
    setAssignmentError(null);
    if (!participantId) {
      setAssignmentError("Select a participant.");
      return;
    }
    try {
      db.assignParticipantToTemplate({
        caseTemplateId: templateRecord.id,
        participantId,
        status: assignmentStatus,
        exemptionReason: assignmentStatus === "EXEMPT" ? exemptionReason.trim() || "Exempted by authority" : null,
        decidedByUserId: user.authenticatableUserId,
      });
      refresh();
      setParticipantId("");
      setAssignmentStatus("REQUIRED");
      setExemptionReason("");
      setShowAssignParticipant(false);
    } catch (caught) {
      setAssignmentError(caught instanceof Error ? caught.message : "Participant could not be assigned.");
    }
  }

  function publishTemplate() {
    setPublishError(null);
    if (!user.authenticatableUserId) {
      setPublishError("No authority user is selected for this session.");
      return;
    }
    try {
      db.publishTemplate(templateRecord.id, user.authenticatableUserId);
      refresh();
    } catch (caught) {
      setPublishError(caught instanceof Error ? caught.message : "Template could not be published.");
    }
  }

  function openWithdrawTask(taskId: string) {
    setWithdrawingTaskId(taskId);
    setWithdrawReason("");
    setWithdrawError(null);
  }

  function closeWithdrawTask() {
    setWithdrawingTaskId(null);
    setWithdrawReason("");
    setWithdrawError(null);
  }

  function withdrawTask() {
    setWithdrawError(null);
    if (!withdrawingTaskId) {
      setWithdrawError("Select a task to withdraw.");
      return;
    }
    if (!withdrawReason.trim()) {
      setWithdrawError("Enter a withdrawal reason.");
      return;
    }
    if (!user.authenticatableUserId) {
      setWithdrawError("No authority user is selected for this session.");
      return;
    }
    try {
      db.withdrawTemplateTask(withdrawingTaskId, user.authenticatableUserId, withdrawReason.trim());
      refresh();
      closeWithdrawTask();
    } catch (caught) {
      setWithdrawError(caught instanceof Error ? caught.message : "Task could not be withdrawn.");
    }
  }

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
      breadcrumbs={[
        { label: "Administration", path: "/admin" },
        { label: "Case templates", path: "/admin/case-templates" },
        { label: templateRecord.name },
      ]}
    >
      <PageTitle
        eyebrow="Case template"
        title={templateRecord.name}
        description={templateRecord.description}
        actions={
          templateRecord.status === "DRAFT" ? (
            <Button type="button" onClick={publishTemplate}>
              <Rocket />
              Publish
            </Button>
          ) : undefined
        }
      />
      <AdministrationResourceNav />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/admin/case-templates/${templateRecord.id}` },
          { label: "Tasks", path: `/admin/case-templates/${templateRecord.id}` },
          { label: "Participants", path: `/admin/case-templates/${templateRecord.id}` },
          { label: "Generated cases", path: `/admin/case-templates/${templateRecord.id}` },
          { label: "Activity", path: `/admin/case-templates/${templateRecord.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Status", value: templateRecord.status.toLowerCase(), tone: templateRecord.status === "PUBLISHED" ? "green" : "yellow" },
          { label: "Tasks", value: String(templateRecord.taskCount), tone: "blue" },
          { label: "Participants", value: String(templateRecord.participantCount), tone: "blue" },
          { label: "Generated cases", value: String(generatedCases.length), tone: "green" },
        ]}
      />
      <div className="mt-3"><FormError message={publishError} /></div>
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Tasks</h3>
          <Button type="button" onClick={() => setShowAddTask((current) => !current)}>
            <Plus />
            Add task
          </Button>
        </div>
        <ResourceActionPanel
          open={showAddTask}
          title="Add task"
          description={templateRecord.status === "PUBLISHED" ? "Adding a task to a published template creates a case task for every generated case." : "Add a configured task type to this template."}
          onClose={() => setShowAddTask(false)}
          footer={
            <Button type="button" onClick={addTask}>
              <CheckCircle2 />
              Save
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_12rem]">
            <FormField label="Task type">
              <SelectField value={taskTypeId} onChange={setTaskTypeId}>
                {taskTypes.map((taskType) => (
                  <option key={taskType.id} value={taskType.id}>{taskType.name}</option>
                ))}
              </SelectField>
            </FormField>
            <FormField label="Title">
              <Input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
            </FormField>
            <FormField label="Due">
              <Input value={taskDue} onChange={(event) => setTaskDue(event.target.value)} placeholder="20 Jun 2026" />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Description">
              <Input value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} />
            </FormField>
          </div>
          <div className="mt-3"><FormError message={taskError} /></div>
        </ResourceActionPanel>
        <ResourceActionPanel
          open={Boolean(withdrawingTask)}
          title="Withdraw task"
          description={withdrawingTask ? `Withdraw ${withdrawingTask.title} from this template and incomplete generated case tasks.` : "Withdraw a task from this template."}
          onClose={closeWithdrawTask}
          footer={
            <Button type="button" variant="destructive" onClick={withdrawTask}>
              <XCircle />
              Withdraw
            </Button>
          }
        >
          <FormField label="Reason">
            <Input value={withdrawReason} onChange={(event) => setWithdrawReason(event.target.value)} />
          </FormField>
          <div className="mt-3"><FormError message={withdrawError} /></div>
        </ResourceActionPanel>
        <ResourceTable headings={["Order", "Task", "Type", "Due", "Status", "Actions"]}>
          {templateTasks.map((task) => (
            <tr key={task.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">{task.sortOrder}</td>
              <td className="px-4 py-3">
                <span className="block font-bold text-[#0b0c0c] dark:text-white">{task.title}</span>
                <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{task.description}</span>
                {task.withdrawnReason && (
                  <span className="mt-2 block text-xs font-bold text-[#d4351c]">
                    Withdrawn: {task.withdrawnReason}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{task.taskTypeName}</td>
              <td className="px-4 py-3">{task.due}</td>
              <td className="px-4 py-3">
                <span className="block font-bold">{task.status}</span>
                {task.createdAfterPublish && (
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                    Added after publish
                  </span>
                )}
                {task.withdrawnAt && (
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                    Withdrawn {new Date(task.withdrawnAt).toLocaleString("en-GB")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openWithdrawTask(task.id)}
                  disabled={templateRecord.status !== "PUBLISHED" || task.status === "WITHDRAWN"}
                >
                  <XCircle />
                  Withdraw
                </Button>
              </td>
            </tr>
          ))}
        </ResourceTable>
      </section>
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Participants</h3>
          <Button type="button" onClick={() => setShowAssignParticipant((current) => !current)} disabled={assignableParticipants.length === 0}>
            <Plus />
            Assign participant
          </Button>
        </div>
        <ResourceActionPanel
          open={showAssignParticipant}
          title="Assign participant"
          description={templateRecord.status === "PUBLISHED" ? "Required participants assigned after publication get a case immediately." : "Choose whether the participant is required or exempt for this template."}
          onClose={() => setShowAssignParticipant(false)}
          footer={
            <Button type="button" onClick={assignParticipant}>
              <CheckCircle2 />
              Save
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-[1fr_12rem_1fr]">
            <FormField label="Participant">
              <SelectField value={participantId} onChange={setParticipantId}>
                <option value="">Select participant</option>
                {assignableParticipants.map((participant) => (
                  <option key={participant.id} value={participant.id}>{participant.name}</option>
                ))}
              </SelectField>
            </FormField>
            <FormField label="Status">
              <SelectField value={assignmentStatus} onChange={(value) => setAssignmentStatus(value as "REQUIRED" | "EXEMPT")}>
                <option value="REQUIRED">Required</option>
                <option value="EXEMPT">Exempt</option>
              </SelectField>
            </FormField>
            <FormField label="Exemption reason">
              <Input value={exemptionReason} onChange={(event) => setExemptionReason(event.target.value)} disabled={assignmentStatus !== "EXEMPT"} />
            </FormField>
          </div>
          <div className="mt-3"><FormError message={assignmentError} /></div>
        </ResourceActionPanel>
        <ResourceTable headings={["Participant", "Type", "Status", "Generated case"]}>
          {templateParticipants.map((assignment) => (
            <tr key={assignment.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3 font-bold text-[#1d70b8]">{assignment.participantName}</td>
              <td className="px-4 py-3">{assignment.participantType}</td>
              <td className="px-4 py-3">{assignment.status}{assignment.exemptionReason ? ` - ${assignment.exemptionReason}` : ""}</td>
              <td className="px-4 py-3">
                {assignment.caseId ? (
                  <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${assignment.caseId}`}>
                    Open case
                  </Link>
                ) : (
                  "Not generated"
                )}
              </td>
            </tr>
          ))}
        </ResourceTable>
      </section>
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Generated cases</h3>
        <ResourceTable headings={["Case", "Participant", "Status", "Progress", "Outcome"]}>
          {generatedCases.map((caseRecord) => {
            const participant = getParticipant(caseRecord.participantId);
            return (
              <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
                <td className="px-4 py-3">
                  <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${caseRecord.id}`}>
                    {caseRecord.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{participant?.name ?? "Unknown participant"}</td>
                <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
                <td className="px-4 py-3"><ProgressBar value={caseRecord.completedTasks} total={caseRecord.totalTasks} /></td>
                <td className="px-4 py-3">{caseRecord.outcome}</td>
              </tr>
            );
          })}
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
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
      breadcrumbs={[{ label: "Administration" }]}
    >
      <PageTitle
        eyebrow="Administration"
        title="Platform configuration"
        description="Choose an administration resource to manage participants, stakeholders, templates, users, and review configuration."
      />
      <AdministrationResourceNav />
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
  const { db, refresh } = useDomainData();
  const [showCreate, setShowCreate] = useState(false);
  const [participantType, setParticipantType] = useState<PartyType>("ORGANISATION");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const scopedParticipants = getScopedParticipants(user);

  function createParticipant() {
    setError(null);
    if (!user.authorityId) {
      setError("No authority is selected for this session.");
      return;
    }
    if (!displayName.trim()) {
      setError("Enter a participant name.");
      return;
    }
    try {
      db.createParticipant({
        authorityId: user.authorityId,
        participantType,
        displayName: displayName.trim(),
        status: "ACTIVE",
      });
      refresh();
      setDisplayName("");
      setParticipantType("ORGANISATION");
      setShowCreate(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Participant could not be created.");
    }
  }

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for case types, participants, workflow, and review."
      breadcrumbs={[{ label: "Administration", path: "/admin" }, { label: "Participants" }]}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Participants"
        description="Select a participant to review membership, stakeholder access, generated cases, task status, and activity."
        actions={
          <Button onClick={() => setShowCreate((current) => !current)}>
            <Plus />
            Create participant
          </Button>
        }
      />
      <AdministrationResourceNav />
      <ResourceActionPanel
        open={showCreate}
        title="Create participant"
        description="Create a participant inside the current authority."
        onClose={() => setShowCreate(false)}
        footer={
          <Button type="button" onClick={createParticipant}>
            <CheckCircle2 />
            Save
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
          <FormField label="Type">
            <SelectField value={participantType} onChange={(value) => setParticipantType(value as PartyType)}>
              <option value="ORGANISATION">Organisation</option>
              <option value="PERSON">Person</option>
            </SelectField>
          </FormField>
          <FormField label="Display name">
            <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </FormField>
        </div>
        <div className="mt-3"><FormError message={error} /></div>
      </ResourceActionPanel>
      <ResourceTable headings={["Participant", "Type", "Status", "Open cases", "Progress", "Last activity"]}>
        {scopedParticipants.map((participant) => (
          <tr key={participant.id} className="border-b border-[#b1b4b6] last:border-b-0">
            <td className="px-4 py-3">
              <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/participants/${participant.id}`}>
                {participant.name}
              </Link>
              <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                {participant.participantRole}
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
  const { db, refresh } = useDomainData();
  const { participantId } = useParams();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<MembershipRole>("MEMBER");
  const [userError, setUserError] = useState<string | null>(null);
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;
  const participant = getParticipant(participantId);
  if (!participant) return <Navigate to="/admin/participants" replace />;
  const scopedParticipantIds = new Set(getScopedParticipants(user).map((item) => item.id));
  if (!scopedParticipantIds.has(participant.id)) return <Navigate to="/admin/participants" replace />;
  const participantRecord = participant;

  const participantAccessGrants = getAccessGrantsForParticipant(participantRecord.id);
  const activeSubscriberGrants = participantAccessGrants.filter(
    (grant) => grant.status === "ACTIVE" && grant.granteeType === "STAKEHOLDER",
  ).length;
  const participantUsers = authenticatableUsers.filter(
    (account) =>
      account.membership.entityType === "participant" &&
      account.membership.entityId === participantRecord.id,
  );

  function createParticipantUser() {
    setUserError(null);
    if (!newUserName.trim()) {
      setUserError("Enter a user name.");
      return;
    }
    if (!newUserEmail.trim()) {
      setUserError("Enter an email address.");
      return;
    }
    try {
      db.createParticipantUser(participantRecord.id, {
        displayName: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
      });
      refresh();
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("MEMBER");
      setShowCreateUser(false);
    } catch (caught) {
      setUserError(caught instanceof Error ? caught.message : "Participant user could not be created.");
    }
  }

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
      breadcrumbs={[
        { label: "Administration", path: "/admin" },
        { label: "Participants", path: "/admin/participants" },
        { label: participant.name },
      ]}
    >
      <PageTitle
        eyebrow="Participant"
        title={participant.name}
        description="Review participant membership, stakeholder access, generated cases, users, and audit activity."
      />
      <AdministrationResourceNav />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/admin/participants/${participant.id}` },
          { label: "Users", path: `/admin/participants/${participant.id}` },
          { label: "Cases", path: `/admin/participants/${participant.id}` },
          { label: "Audit", path: `/admin/participants/${participant.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Current status", value: participant.status.replace("-", " "), tone: participant.status === "attention" ? "red" : "blue" },
          { label: "Open cases", value: String(participant.openCases), tone: "blue" },
          { label: "Tasks complete", value: `${participant.completedTasks}/${participant.totalTasks}`, tone: "green" },
          { label: "Active subscriber grants", value: String(activeSubscriberGrants), tone: "yellow" },
        ]}
      />
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Users</h3>
          <Button type="button" onClick={() => setShowCreateUser((current) => !current)}>
            <UserPlus />
            Create user
          </Button>
        </div>
        <ResourceActionPanel
          open={showCreateUser}
          title="Create participant user"
          description="Create a login user that belongs only to this participant."
          onClose={() => setShowCreateUser(false)}
          footer={
            <Button type="button" onClick={createParticipantUser}>
              <CheckCircle2 />
              Save
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_10rem]">
            <FormField label="Display name">
              <Input value={newUserName} onChange={(event) => setNewUserName(event.target.value)} />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={newUserEmail} onChange={(event) => setNewUserEmail(event.target.value)} />
            </FormField>
            <FormField label="Role">
              <SelectField value={newUserRole} onChange={(value) => setNewUserRole(value as MembershipRole)}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </SelectField>
            </FormField>
          </div>
          <div className="mt-3"><FormError message={userError} /></div>
        </ResourceActionPanel>
        <ResourceTable headings={["User", "Email", "Kind", "Role"]}>
          {participantUsers.map((account) => (
            <tr key={account.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3 font-bold text-[#1d70b8]">{account.name}</td>
              <td className="px-4 py-3">{account.email}</td>
              <td className="px-4 py-3">{account.userKind}</td>
              <td className="px-4 py-3">{account.membershipRole}</td>
            </tr>
          ))}
        </ResourceTable>
      </section>
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Due diligence boundary</h3>
        <div className="border border-[#b1b4b6] bg-white p-5 dark:bg-card">
          <p className="max-w-3xl text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
            This authority account can see vendor membership and aggregate progress, but it cannot open this vendor's due diligence packs, answers, evidence metadata, or evidence files by default.
          </p>
        </div>
      </section>
    </ConsoleLayout>
  );
}

export function CaseManagementHome() {
  const { user } = useAuth();
  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  if (user.role === "authority-admin") return <Navigate to="/admin" replace />;
  const authority = getAuthority(user.authorityId ?? undefined);
  const scopedCases = getScopedCases(user);
  const totalTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.totalTasks, 0);
  const completedTasks = scopedCases.reduce((sum, caseRecord) => sum + caseRecord.completedTasks, 0);
  const blockedTasks = scopedCases.flatMap((caseRecord) => caseRecord.tasks).filter((task) => task.status === "attention").length;

  return (
    <ConsoleLayout
      appName="Due Diligence Packs"
      appDescription="Operational workspace for DDQ packs, evidence metadata, and controlled subscriber review."
      breadcrumbs={[{ label: "Due diligence packs" }]}
      readOnly
    >
      <PageTitle
        eyebrow="Vendor workspace"
        title="Due diligence packs"
        description="Complete vendor-owned DDQs, upload evidence metadata, and control who can review this workspace."
        actions={
          <Button asChild>
            <Link to="/cases/access-grants">
              <UserPlus />
              Access grants
            </Link>
          </Button>
        }
      />
      <MetricStrip
        items={[
          { label: "Association", value: authority?.name ?? "None", tone: "blue" },
          { label: "DDQ packs", value: String(scopedCases.length), tone: "blue" },
          { label: "Completed items", value: `${completedTasks} / ${totalTasks}`, tone: "green" },
          { label: "Blocked items", value: String(blockedTasks), tone: "red" },
        ]}
      />
      <section className="mt-8">
        <ResourceTable
          headings={["Due diligence pack", "Type", "Status", "Progress", "Risk", "Last activity"]}
        >
          {scopedCases.map((caseRecord) => {
            return (
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
                <td className="px-4 py-3">{caseRecord.lastActivity}</td>
              </tr>
            );
          })}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function AccessGrantsPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const [showCreate, setShowCreate] = useState(false);
  const [granteeType, setGranteeType] = useState<AccessGrantGranteeType>("STAKEHOLDER");
  const [granteeStakeholderId, setGranteeStakeholderId] = useState("");
  const [permissionLevel, setPermissionLevel] = useState<AccessGrantPermissionLevel>("REQUEST_INFORMATION");
  const [status, setStatus] = useState<AccessGrantStatus>("ACTIVE");
  const [error, setError] = useState<string | null>(null);

  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  if (user.role === "authority-admin") return <Navigate to="/admin" replace />;

  const participant = getParticipant(user.participantId ?? undefined);
  if (!participant || !user.authorityId || !user.authenticatableUserId) return <Navigate to="/cases" replace />;

  const grants = getAccessGrantsForParticipant(participant.id);
  const grantableStakeholders = getGrantableStakeholdersForParticipant(participant.id);
  const activeGrants = grants.filter((grant) => grant.status === "ACTIVE");
  const helperGrants = grants.filter((grant) => grant.granteeType === "HELPER");

  function createGrant() {
    setError(null);
    if (!granteeStakeholderId) {
      setError("Select a subscriber or service provider.");
      return;
    }
    try {
      db.createAccessGrant({
        authorityId: user.authorityId ?? "",
        participantId: participant?.id ?? "",
        granteeType,
        granteeStakeholderId,
        permissionLevel,
        status,
        createdByUserId: user.authenticatableUserId ?? "",
      });
      refresh();
      setGranteeStakeholderId("");
      setPermissionLevel("REQUEST_INFORMATION");
      setStatus("ACTIVE");
      setShowCreate(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Access grant could not be created.");
    }
  }

  function updateGrantStatus(accessGrantId: string, nextStatus: AccessGrantStatus) {
    setError(null);
    try {
      db.updateAccessGrantStatus(accessGrantId, nextStatus);
      refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Access grant status could not be updated.");
    }
  }

  return (
    <ConsoleLayout
      appName="Due Diligence Packs"
      appDescription="Operational workspace for due diligence packs, evidence, and controlled review access."
      breadcrumbs={[
        { label: "Due diligence packs", path: "/cases" },
        { label: "Access grants" },
      ]}
    >
      <PageTitle
        eyebrow="Vendor-controlled access"
        title="Access grants"
        description="Invite subscribers and service providers into this vendor workspace without giving the association default access to private DDQ answers or evidence."
        actions={
          <Button type="button" onClick={() => setShowCreate((current) => !current)}>
            <UserPlus />
            Create grant
          </Button>
        }
      />
      <MetricStrip
        items={[
          { label: "Vendor", value: participant.name, tone: "blue" },
          { label: "Active grants", value: String(activeGrants.length), tone: "green" },
          { label: "Service providers", value: String(helperGrants.length), tone: "yellow" },
          { label: "Total grants", value: String(grants.length), tone: "blue" },
        ]}
      />
      <ResourceActionPanel
        open={showCreate}
        title="Create access grant"
        description="Grant a subscriber or service provider scoped access to this vendor workspace."
        onClose={() => setShowCreate(false)}
        footer={
          <Button type="button" onClick={createGrant}>
            <CheckCircle2 />
            Save grant
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-[12rem_1fr_14rem_10rem]">
          <FormField label="Grantee type">
            <SelectField value={granteeType} onChange={(value) => setGranteeType(value as AccessGrantGranteeType)}>
              <option value="STAKEHOLDER">Subscriber</option>
              <option value="HELPER">Service provider</option>
            </SelectField>
          </FormField>
          <FormField label="Grantee">
            <SelectField value={granteeStakeholderId} onChange={setGranteeStakeholderId}>
              <option value="">Select organisation</option>
              {grantableStakeholders.map((stakeholder) => (
                <option key={stakeholder.id} value={stakeholder.id}>
                  {stakeholder.name}
                </option>
              ))}
            </SelectField>
          </FormField>
          <FormField label="Permission">
            <SelectField value={permissionLevel} onChange={(value) => setPermissionLevel(value as AccessGrantPermissionLevel)}>
              <option value="READ_ONLY">Read only</option>
              <option value="REQUEST_INFORMATION">Request information</option>
              <option value="REVIEW_AND_COMMENT">Review and comment</option>
              <option value="CREATE_AND_EDIT">Create and edit</option>
              <option value="ADMINISTER_GRANTS">Administer grants</option>
            </SelectField>
          </FormField>
          <FormField label="Status">
            <SelectField value={status} onChange={(value) => setStatus(value as AccessGrantStatus)}>
              <option value="INVITED">Invited</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </SelectField>
          </FormField>
        </div>
        <div className="mt-3"><FormError message={error} /></div>
      </ResourceActionPanel>
      <section className="mt-8">
        <ResourceTable headings={["Grantee", "Type", "Permission", "Scope", "Status", "Created", "Actions"]}>
          {grants.map((grant) => (
            <tr key={grant.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <span className="block font-bold text-[#1d70b8]">{grant.granteeName}</span>
                <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                  Created by {grant.createdByName}
                </span>
              </td>
              <td className="px-4 py-3">{grant.granteeType === "HELPER" ? "Service provider" : "Subscriber"}</td>
              <td className="px-4 py-3">{grant.permissionLabel}</td>
              <td className="px-4 py-3">{grant.scopeLabel}</td>
              <td className="px-4 py-3"><GrantStatusBadge status={grant.status} /></td>
              <td className="px-4 py-3">{new Date(grant.createdAt).toLocaleDateString("en-GB")}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {grant.status !== "ACTIVE" && (
                    <Button type="button" variant="outline" onClick={() => updateGrantStatus(grant.id, "ACTIVE")}>
                      <CheckCircle2 />
                      Activate
                    </Button>
                  )}
                  {grant.status === "ACTIVE" && (
                    <Button type="button" variant="outline" onClick={() => updateGrantStatus(grant.id, "SUSPENDED")}>
                      <Clock3 />
                      Suspend
                    </Button>
                  )}
                  {grant.status !== "REVOKED" && (
                    <Button type="button" variant="outline" onClick={() => updateGrantStatus(grant.id, "REVOKED")}>
                      <XCircle />
                      Revoke
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function CaseDetailPage() {
  const { user } = useAuth();
  const { db, refresh } = useDomainData();
  const { caseId } = useParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  if (user.role === "authority-admin") return <Navigate to="/admin" replace />;
  const caseRecord = getCase(caseId);
  if (!caseRecord) return <Navigate to="/cases" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/cases" replace />;

  const currentCase = caseRecord;
  const participant = getParticipant(caseRecord.participantId);
  const tasks = caseRecord.tasks;
  const canSubmitCase =
    user.role === "participant" &&
    caseRecord.domainStatus !== "SUBMITTED" &&
    caseRecord.domainStatus !== "APPROVED" &&
    caseRecord.domainStatus !== "CLOSED" &&
    tasks.length > 0 &&
    tasks.every((task) => task.domainStatus === "SUBMITTED" || task.domainStatus === "PASSED" || task.domainStatus === "WITHDRAWN");

  function submitCase() {
    setSubmitError(null);
    try {
      db.submitCase(currentCase.id);
      refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The case could not be submitted.");
    }
  }

  return (
    <ConsoleLayout
      appName="Due Diligence Packs"
      appDescription="Operational workspace for DDQ packs, evidence metadata, and controlled subscriber review."
      breadcrumbs={[
        { label: "Due diligence packs", path: "/cases" },
        { label: `${participant?.name ?? "Organization"} ${caseRecord.reference}` },
      ]}
      readOnly
    >
      <PageTitle
        eyebrow="Due diligence pack"
        title={caseRecord.title}
        description={`${participant?.name ?? "Unknown vendor"} ${caseRecord.caseType.toLowerCase()} for item completion, evidence metadata, subscriber review, and outcome visibility.`}
        actions={
          user.role === "participant" ? (
            <Button type="button" onClick={submitCase} disabled={!canSubmitCase}>
              <SendHorizontal />
              Submit pack
            </Button>
          ) : undefined
        }
      />
      <FormError message={submitError} />
      <Tabs
        current="Summary"
        tabs={[
          { label: "Summary", path: `/cases/${caseRecord.id}` },
          { label: "Tasks", path: `/cases/${caseRecord.id}` },
          { label: "Evidence", path: `/cases/${caseRecord.id}` },
          { label: "Activity", path: `/cases/${caseRecord.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Pack status", value: caseRecord.status, tone: caseRecord.status === "review" ? "yellow" : "blue" },
          { label: "Items complete", value: `${caseRecord.completedTasks}/${caseRecord.totalTasks}`, tone: "green" },
          { label: "Risk", value: caseRecord.risk, tone: caseRecord.risk === "high" ? "red" : "yellow" },
          { label: "Reference", value: caseRecord.reference, tone: "blue" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Due diligence items</h3>
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
                    Due: {task.due} · Status: {task.domainStatus.replace("_", " ")}
                  </span>
                  {task.domainStatus === "FAILED" && (
                    <span className="mt-2 block text-sm font-bold text-[#d4351c]">
                      Review outcome: more evidence requested.
                    </span>
                  )}
                  {task.domainStatus === "PASSED" && (
                    <span className="mt-2 block text-sm font-bold text-[#00703c]">
                      Review outcome: passed.
                    </span>
                  )}
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
  const { db, refresh } = useDomainData();
  const { caseId, taskId } = useParams();
  const [isEdited, setIsEdited] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const caseRecord = getCase(caseId);
  const task = getTask(caseId, taskId);

  useEffect(() => {
    if (!task) return;
    setResponseText(task.responseText);
    setIsEdited(false);
    setError(null);
  }, [task?.id, task?.responseText]);

  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  if (user.role === "authority-admin") return <Navigate to="/admin" replace />;

  if (!caseRecord || !task) return <Navigate to="/cases" replace />;
  const scopedCaseIds = new Set(getScopedCases(user).map((item) => item.id));
  if (!scopedCaseIds.has(caseRecord.id)) return <Navigate to="/cases" replace />;

  const currentTask = task;
  const participant = getParticipant(caseRecord.participantId);
  const Icon = task.Icon;
  const canEditTask = task.domainStatus !== "SUBMITTED" && task.domainStatus !== "PASSED" && task.domainStatus !== "WITHDRAWN";
  const canSubmitTask =
    task.domainStatus !== "SUBMITTED" &&
    task.domainStatus !== "PASSED" &&
    task.domainStatus !== "WITHDRAWN" &&
    (responseText.trim().length > 0 || task.evidenceFiles.length > 0);
  const statusText = task.domainStatus.replace("_", " ");

  function saveResponse() {
    setError(null);
    try {
      db.completeTask({
        caseTaskId: currentTask.id,
        responseJson: {
          summary: responseText.trim(),
          savedAt: new Date().toISOString(),
        },
      });
      refresh();
      setIsEdited(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "The task response could not be saved.");
    }
  }

  function uploadEvidence(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const uploadedAt = new Date().toISOString();
    const nextFiles = [
      ...currentTask.evidenceFiles,
      ...Array.from(files).map((file) => ({
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        uploadedAt,
      })),
    ];
    try {
      db.uploadEvidence({
        caseTaskId: currentTask.id,
        evidenceJson: {
          files: nextFiles,
        },
      });
      refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Evidence metadata could not be uploaded.");
    }
  }

  function submitTaskUpdate() {
    setError(null);
    try {
      if (isEdited) {
        db.completeTask({
          caseTaskId: currentTask.id,
          responseJson: {
            summary: responseText.trim(),
            savedAt: new Date().toISOString(),
          },
        });
      }
      db.submitTask(currentTask.id);
      refresh();
      setIsEdited(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The task could not be submitted.");
    }
  }

  return (
    <ConsoleLayout
      appName="Due Diligence Packs"
      appDescription="Operational workspace for DDQ packs, evidence metadata, and controlled subscriber review."
      breadcrumbs={[
        { label: "Due diligence packs", path: "/cases" },
        { label: `${participant?.name ?? "Organization"} ${caseRecord.reference}`, path: `/cases/${caseRecord.id}` },
        { label: task.title },
      ]}
      isEdited={isEdited}
    >
      <PageTitle
        eyebrow="Due diligence item"
        title={task.title}
        description={task.description}
        actions={
          <label
            className={cn(
              "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90",
              !canEditTask && "pointer-events-none opacity-50",
            )}
          >
              <Upload className="size-4" />
            Upload evidence
            <input
              className="sr-only"
              disabled={!canEditTask}
              multiple
              type="file"
              onChange={(event) => {
                uploadEvidence(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        }
      />
      <FormError message={error} />
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
                Record the response and evidence metadata for this due diligence item, then submit it when it is ready for subscriber review.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <FormField label="Response">
              <textarea
                className="min-h-36 w-full border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-input/30"
                disabled={!canEditTask}
                value={responseText}
                onChange={(event) => {
                  setResponseText(event.target.value);
                  setIsEdited(event.target.value !== task.responseText);
                }}
              />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={saveResponse} disabled={!isEdited || !canEditTask}>
                <Save />
                Save response
              </Button>
              <Button type="button" onClick={submitTaskUpdate} disabled={!canSubmitTask}>
                <SendHorizontal />
                Submit item
              </Button>
            </div>
            <div>
              <h4 className="mb-2 text-base font-bold">Evidence</h4>
              {task.evidenceFiles.length === 0 ? (
                <p className="text-sm text-[#505a5f] dark:text-muted-foreground">No evidence metadata has been uploaded.</p>
              ) : (
                <ResourceTable headings={["File", "Size", "Uploaded"]}>
                  {task.evidenceFiles.map((file) => (
                    <tr key={`${file.name}-${file.uploadedAt}`} className="border-b border-[#b1b4b6] last:border-b-0">
                      <td className="px-4 py-3 font-bold text-[#1d70b8]">{file.name}</td>
                      <td className="px-4 py-3">{file.size}</td>
                      <td className="px-4 py-3">{new Date(file.uploadedAt).toLocaleString("en-GB")}</td>
                    </tr>
                  ))}
                </ResourceTable>
              )}
            </div>
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
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Review outcome</dt>
              <dd className="capitalize">{statusText.toLowerCase()}</dd>
              {task.domainStatus === "FAILED" && (
                <dd className="mt-2 text-sm font-bold text-[#d4351c]">More evidence requested.</dd>
              )}
              {task.domainStatus === "PASSED" && (
                <dd className="mt-2 text-sm font-bold text-[#00703c]">Accepted for this DDQ pack.</dd>
              )}
            </div>
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Timeline</dt>
              <dd className="mt-2 flex items-center gap-2">
                <Clock3 className="size-4 text-[#1d70b8]" />
                Last updated {new Date(task.updatedAt).toLocaleString("en-GB")}
              </dd>
              <dd className="mt-2 flex items-center gap-2">
                <History className="size-4 text-[#1d70b8]" />
                {task.evidenceFiles.length} evidence upload{task.evidenceFiles.length === 1 ? "" : "s"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </ConsoleLayout>
  );
}

export function PlaceholderResourcePage({ app }: { app: "admin" | "cases" }) {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = app === "admin";
  if (!isAdmin && user.role === "authority-admin") return <Navigate to="/admin" replace />;
  if (!isAdmin && user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  const authorityId = user.authorityId ?? undefined;
  const scopedParticipants = getScopedParticipants(user);
  const scopedStakeholders = getStakeholdersForAuthority(authorityId);
  const scopedTemplates = getCaseTemplatesForAuthority(authorityId);
  const scopedUsers = authenticatableUsers.filter((account) => {
    if (account.membership.entityType === "authority") return account.membership.entityId === authorityId;
    if (account.membership.entityType === "participant") {
      return scopedParticipants.some((participant) => participant.id === account.membership.entityId);
    }
    if (account.membership.entityType === "stakeholder") {
      return scopedStakeholders.some((stakeholder) => stakeholder.id === account.membership.entityId);
    }
    return false;
  });
  const resource =
    location.pathname.includes("stakeholders")
      ? "stakeholders"
      : location.pathname.includes("case-templates")
        ? "case-templates"
        : location.pathname.includes("task-types")
          ? "task-types"
          : location.pathname.includes("users")
            ? "users"
            : "placeholder";
  const titleMap = {
    stakeholders: "Stakeholders",
    "case-templates": "Case templates",
    "task-types": "Task types",
    users: "Users",
    placeholder: "Coming next",
  };

  return (
    <ConsoleLayout
      appName={isAdmin ? "Administration" : "Case Management"}
      appDescription={isAdmin ? "Configuration for participants, stakeholders, case templates, task types, and review." : "Operational workspace for case tasks, forms, evidence, and workflow."}
      breadcrumbs={[
        { label: isAdmin ? "Administration" : "Case Management", path: isAdmin ? "/admin" : "/cases" },
        { label: titleMap[resource] },
      ]}
    >
      <PageTitle
        eyebrow="Resource console"
        title={titleMap[resource]}
        description={
          resource === "stakeholders"
            ? "Stakeholders belong to the selected authority and receive explicit participant access records."
            : resource === "case-templates"
              ? "Case templates are reusable authority definitions. Publishing them creates participant cases immediately."
              : resource === "task-types"
                ? "Task types are global software capabilities configured into authority-owned case templates."
                : resource === "users"
                  ? "Users authenticate through Entra and have exactly one application user kind plus Admin or Member membership."
                  : "This resource area is ready for the next implementation lesson."
        }
      />
      {isAdmin && <AdministrationResourceNav />}
      {resource === "stakeholders" && (
        <ResourceTable headings={["Stakeholder", "Type", "Status", "Participant access"]}>
          {scopedStakeholders.map((stakeholder) => (
            <tr key={stakeholder.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3 font-bold text-[#1d70b8]">{stakeholder.name}</td>
              <td className="px-4 py-3">{stakeholder.type}</td>
              <td className="px-4 py-3">{stakeholder.status}</td>
              <td className="px-4 py-3">{stakeholder.visibleParticipants} approved</td>
            </tr>
          ))}
        </ResourceTable>
      )}
      {resource === "case-templates" && (
        <ResourceTable headings={["Template", "Status", "Tasks", "Participants", "Published"]}>
          {scopedTemplates.map((template) => (
            <tr key={template.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <span className="block font-bold text-[#1d70b8]">{template.name}</span>
                <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{template.description}</span>
              </td>
              <td className="px-4 py-3">{template.status}</td>
              <td className="px-4 py-3">{template.taskCount}</td>
              <td className="px-4 py-3">{template.participantCount}</td>
              <td className="px-4 py-3">{template.publishedAt ? "Published" : "Not published"}</td>
            </tr>
          ))}
        </ResourceTable>
      )}
      {resource === "task-types" && (
        <ResourceTable headings={["Code", "Name", "Status", "Description"]}>
          {taskTypes.map((taskType) => (
            <tr key={taskType.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3 font-mono text-xs">{taskType.code}</td>
              <td className="px-4 py-3 font-bold text-[#1d70b8]">{taskType.name}</td>
              <td className="px-4 py-3">{taskType.status}</td>
              <td className="px-4 py-3">{taskType.description}</td>
            </tr>
          ))}
        </ResourceTable>
      )}
      {resource === "users" && (
        <ResourceTable headings={["User", "Kind", "Membership", "Role"]}>
          {scopedUsers.map((account) => (
            <tr key={account.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <span className="block font-bold text-[#1d70b8]">{account.name}</span>
                <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{account.email}</span>
              </td>
              <td className="px-4 py-3">{account.userKind}</td>
              <td className="px-4 py-3">{account.membership.entityType}</td>
              <td className="px-4 py-3">{account.membershipRole}</td>
            </tr>
          ))}
        </ResourceTable>
      )}
      {resource === "placeholder" && (
        <section className="border border-dashed border-[#b1b4b6] bg-white p-5 text-sm text-[#505a5f] dark:bg-card dark:text-muted-foreground">
          This resource area is ready for the next implementation lesson.
        </section>
      )}
    </ConsoleLayout>
  );
}
