import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsoleLayout, MetricStrip, PageTitle, Tabs } from "@/components/ConsoleLayout";
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
  getCaseTemplatesForAuthority,
  getScopedCases,
  getScopedParticipants,
  getStakeholdersForAuthority,
  MembershipRole,
  PartyType,
  Status,
  taskTypes,
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
  UserPlus,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

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

function taskActivity(taskId: string, status: Status) {
  const activityByTask: Record<string, { performed: string; lastUpdated: string; reviewerNote: string }> = {
    "case-task-photo-identity": {
      performed: "15 Jun 2026, 09:42",
      lastUpdated: "15 Jun 2026, 10:05",
      reviewerNote: "Evidence passed review.",
    },
    "case-task-driving-licence": {
      performed: "15 Jun 2026, 11:18",
      lastUpdated: "15 Jun 2026, 11:18",
      reviewerNote: "Participant is still working on this task.",
    },
    "case-task-security-form": {
      performed: "14 Jun 2026, 16:20",
      lastUpdated: "15 Jun 2026, 08:55",
      reviewerNote: "More evidence requested.",
    },
    "case-task-work-photos": {
      performed: "14 Jun 2026, 15:10",
      lastUpdated: "15 Jun 2026, 09:30",
      reviewerNote: "Completion photos need resubmission.",
    },
    "case-task-stakeholder-signature": {
      performed: "15 Jun 2026, 12:00",
      lastUpdated: "15 Jun 2026, 12:00",
      reviewerNote: "Awaiting final signature.",
    },
    "case-task-vehicle-documents": {
      performed: "29 May 2026, 13:35",
      lastUpdated: "30 May 2026, 09:00",
      reviewerNote: "Evidence passed review.",
    },
    "case-task-address-proof": {
      performed: "29 May 2026, 13:42",
      lastUpdated: "30 May 2026, 09:05",
      reviewerNote: "Evidence passed review.",
    },
    "case-task-fee-payment": {
      performed: "31 May 2026, 10:15",
      lastUpdated: "31 May 2026, 10:20",
      reviewerNote: "Payment confirmed.",
    },
  };

  return activityByTask[taskId] ?? {
    performed: status === "not-started" ? "Not started" : "Recently updated",
    lastUpdated: status === "not-started" ? "No activity yet" : "15 Jun 2026",
    reviewerNote:
      status === "complete"
        ? "Evidence passed review."
        : status === "attention"
          ? "Needs authority attention."
          : status === "in-progress"
            ? "Participant is still working on this task."
            : "No participant activity yet.",
  };
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
          { label: "Needs attention", value: String(scopedCases.filter((caseRecord) => caseRecord.risk === "high").length), tone: "red" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Visible case status</h3>
        <ResourceTable headings={["Participant", "Visible case", "Status", "Progress", "Visible outcome"]}>
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
        Visible progress across approved participants: {completedTasks} of {totalTasks}.
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
        description={`${participant?.name ?? "Unknown participant"} ${caseRecord.caseType.toLowerCase()} status, task completion, and visible outcome.`}
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
      <section className="mt-8 border border-[#b1b4b6] bg-white p-5 dark:bg-card">
        <h3 className="text-xl font-bold">Participant performance</h3>
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
                ? "Approved outcome"
                : caseRecord.risk === "high"
                  ? "Attention requested"
                  : "Work in progress"}
            </dd>
          </div>
        </dl>
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
      affirmativeActionCompleteLabel="Updated"
      affirmativeActionLabel="Update"
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
      {showCreate && (
        <section className="mb-6 border border-[#b1b4b6] bg-white p-4 dark:bg-card">
          <h3 className="text-lg font-bold">Create stakeholder</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-[14rem_1fr_auto] md:items-end">
            <FormField label="Type">
              <SelectField value={stakeholderType} onChange={(value) => setStakeholderType(value as PartyType)}>
                <option value="ORGANISATION">Organisation</option>
                <option value="PERSON">Person</option>
              </SelectField>
            </FormField>
            <FormField label="Display name">
              <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </FormField>
            <Button type="button" onClick={createStakeholder}>
              <CheckCircle2 />
              Save
            </Button>
          </div>
          <div className="mt-3"><FormError message={error} /></div>
        </section>
      )}
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
  const [showGrantAccess, setShowGrantAccess] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<MembershipRole>("MEMBER");
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [userError, setUserError] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);
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
  const grantableParticipants = getScopedParticipants(user).filter((participant) => !accessibleParticipantIds.has(participant.id));

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

  function grantAccess() {
    setAccessError(null);
    if (!user.authenticatableUserId) {
      setAccessError("No authority user is selected for this session.");
      return;
    }
    if (!selectedParticipantId) {
      setAccessError("Select a participant.");
      return;
    }
    try {
      db.grantStakeholderAccess({
        stakeholderId: stakeholderRecord.id,
        participantId: selectedParticipantId,
        approvedByUserId: user.authenticatableUserId,
      });
      refresh();
      setSelectedParticipantId("");
      setShowGrantAccess(false);
    } catch (caught) {
      setAccessError(caught instanceof Error ? caught.message : "Access could not be granted.");
    }
  }

  return (
    <ConsoleLayout
      affirmativeActionCompleteLabel="Saved"
      affirmativeActionLabel="Save"
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
        {showCreateUser && (
          <div className="mb-4 border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <h4 className="text-base font-bold">Create stakeholder user</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_10rem_auto] md:items-end">
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
              <Button type="button" onClick={createStakeholderUser}>
                <CheckCircle2 />
                Save
              </Button>
            </div>
            <div className="mt-3"><FormError message={userError} /></div>
          </div>
        )}
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
          <Button type="button" onClick={() => setShowGrantAccess((current) => !current)} disabled={grantableParticipants.length === 0}>
            <Plus />
            Grant access
          </Button>
        </div>
        {showGrantAccess && (
          <div className="mb-4 border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <h4 className="text-base font-bold">Grant participant access</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <FormField label="Participant">
                <SelectField value={selectedParticipantId} onChange={setSelectedParticipantId}>
                  <option value="">Select participant</option>
                  {grantableParticipants.map((participant) => (
                    <option key={participant.id} value={participant.id}>{participant.name}</option>
                  ))}
                </SelectField>
              </FormField>
              <Button type="button" onClick={grantAccess}>
                <CheckCircle2 />
                Grant
              </Button>
            </div>
            <div className="mt-3"><FormError message={accessError} /></div>
          </div>
        )}
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

export function AdminHome() {
  const { user } = useAuth();
  if (user.role !== "authority-admin") return <Navigate to="/" replace />;

  return (
    <ConsoleLayout
      affirmativeActionCompleteLabel="Applied"
      affirmativeActionLabel="Apply"
      appName="Administration"
      appDescription="Configuration for participants, stakeholders, case templates, task types, and review."
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
      affirmativeActionCompleteLabel="Updated"
      affirmativeActionLabel="Update"
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
      {showCreate && (
        <section className="mb-6 border border-[#b1b4b6] bg-white p-4 dark:bg-card">
          <h3 className="text-lg font-bold">Create participant</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-[14rem_1fr_auto] md:items-end">
            <FormField label="Type">
              <SelectField value={participantType} onChange={(value) => setParticipantType(value as PartyType)}>
                <option value="ORGANISATION">Organisation</option>
                <option value="PERSON">Person</option>
              </SelectField>
            </FormField>
            <FormField label="Display name">
              <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </FormField>
            <Button type="button" onClick={createParticipant}>
              <CheckCircle2 />
              Save
            </Button>
          </div>
          <div className="mt-3"><FormError message={error} /></div>
        </section>
      )}
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

  const participantCases = getScopedCases(user).filter((caseRecord) => caseRecord.participantId === participantRecord.id);
  const stakeholder = getStakeholder(participantRecord.stakeholderId);
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
      affirmativeActionCompleteLabel="Saved"
      affirmativeActionLabel="Save"
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
          { label: "Stakeholder", value: stakeholder?.name ?? "None", tone: "yellow" },
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
        {showCreateUser && (
          <div className="mb-4 border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <h4 className="text-base font-bold">Create participant user</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_10rem_auto] md:items-end">
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
              <Button type="button" onClick={createParticipantUser}>
                <CheckCircle2 />
                Save
              </Button>
            </div>
            <div className="mt-3"><FormError message={userError} /></div>
          </div>
        )}
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
        description={`${participant?.name ?? "Unknown participant"} ${caseRecord.caseType.toLowerCase()} for task completion, evidence collection, review, and outcome visibility.`}
      />
      <Tabs
        current="Summary"
        tabs={
          user.role === "authority-admin"
            ? [
                { label: "Summary", path: `/cases/${caseRecord.id}` },
                { label: "Activity", path: `/cases/${caseRecord.id}` },
                { label: "Evidence", path: `/cases/${caseRecord.id}` },
                { label: "Review", path: `/cases/${caseRecord.id}` },
              ]
            : [
                { label: "Summary", path: `/cases/${caseRecord.id}` },
                { label: "Tasks", path: `/cases/${caseRecord.id}` },
                { label: "Evidence", path: `/cases/${caseRecord.id}` },
                { label: "Activity", path: `/cases/${caseRecord.id}` },
              ]
        }
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
        {user.role === "authority-admin" ? (
          <>
            <h3 className="mb-3 text-xl font-bold">Task activity summary</h3>
            <ResourceTable headings={["Task", "Status", "Performed", "Last activity", "Review note"]}>
              {tasks.map((task) => {
                const activity = taskActivity(task.id, task.status);
                return (
                  <tr key={task.id} className="border-b border-[#b1b4b6] last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="block font-bold text-[#0b0c0c] dark:text-white">{task.title}</span>
                      <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">{task.type}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3">{activity.performed}</td>
                    <td className="px-4 py-3">{activity.lastUpdated}</td>
                    <td className="px-4 py-3">{activity.reviewerNote}</td>
                  </tr>
                );
              })}
            </ResourceTable>
          </>
        ) : (
          <>
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
          </>
        )}
      </section>
    </ConsoleLayout>
  );
}

export function TaskDetailPage() {
  const { user } = useAuth();
  const { caseId, taskId } = useParams();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setIsEdited(false);
  }, [caseId, taskId]);

  if (user.role === "stakeholder") return <Navigate to="/stakeholder" replace />;
  if (user.role === "authority-admin") return <Navigate to={`/cases/${caseId ?? ""}`} replace />;

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
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = app === "admin";
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
      affirmativeActionCompleteLabel="Updated"
      affirmativeActionLabel="Update"
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
