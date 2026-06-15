import { Button } from "@/components/ui/button";
import { ConsoleLayout, MetricStrip, PageTitle, SidebarItem, Tabs } from "@/components/ConsoleLayout";
import { getUserGroupLabel, useAuth } from "@/context/AuthContext";
import {
  adminResources,
  cases,
  companies,
  getCase,
  getCheck,
  getCompany,
  getConsoleAppsForGroup,
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
  { label: "Platform companies", path: "/admin/companies", Icon: Building2, detail: "Companies and ownership" },
  { label: "Verification years", path: "/admin/verification-years", Icon: CalendarDays, detail: "Annual task sets" },
  { label: "Check templates", path: "/admin/check-templates", Icon: ClipboardCheck, detail: "Reusable checks" },
  { label: "Users and access", path: "/admin/users", Icon: Users, detail: "Roles and membership" },
];

const caseSidebar: SidebarItem[] = [
  { label: "Case Management home", path: "/cases", Icon: FolderKanban },
  { label: "Cases", path: "/cases/list", Icon: Archive, detail: "Annual verification cases" },
  { label: "Checks", path: "/cases/checks", Icon: ListChecks, detail: "Task-level work" },
  { label: "Evidence", path: "/cases/evidence", Icon: Upload, detail: "Uploads and documents" },
  { label: "Customer preview", path: "/cases/customer-preview", Icon: BadgeCheck, detail: "External status view" },
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
  const percentage = Math.round((value / total) * 100);
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
  const availableApps = getConsoleAppsForGroup(user.group);
  const isInterestedParty = user.group === "interested-party";
  const isProvider = user.group === "provider";

  return (
    <ConsoleLayout breadcrumbs={[]}>
      <PageTitle
        eyebrow="Console home"
        title="All Checks Out"
        description={`${getUserGroupLabel(user.group)} view for ${
          isInterestedParty
            ? "checking supplier verification status."
            : isProvider
              ? "completing annual verification work."
              : "managing association verification operations."
        }`}
        actions={!isInterestedParty &&
          <Button asChild>
            <Link to={isProvider ? "/cases/list" : "/admin/companies"}>
              <Plus />
              {isProvider ? "Create case" : "Add company"}
            </Link>
          </Button>
        }
      />

      <MetricStrip
        items={
          isInterestedParty
            ? [
                { label: "Suppliers watched", value: "3", tone: "blue" },
                { label: "Verified", value: "1", tone: "green" },
                { label: "In progress", value: "2", tone: "yellow" },
                { label: "Failed checks", value: "0", tone: "green" },
              ]
            : isProvider
              ? [
                  { label: "Current company", value: "Northstar Cloud", tone: "blue" },
                  { label: "Active case", value: "2026", tone: "yellow" },
                  { label: "Completed checks", value: "4 / 7", tone: "green" },
                  { label: "Needs attention", value: "1", tone: "red" },
                ]
              : [
                  { label: "Open cases", value: "2", tone: "blue" },
                  { label: "Checks complete", value: "13 / 21", tone: "green" },
                  { label: "Needs attention", value: "2", tone: "red" },
                  { label: "2026 template", value: "Draft", tone: "yellow" },
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
            {isInterestedParty ? "Watched suppliers" : "Recently visited"}
          </h3>
          <div className="grid gap-3">
            {cases.slice(0, 2).map((caseRecord) => {
              const company = getCompany(caseRecord.companyId);
              return (
                <Link
                  key={caseRecord.id}
                  to={isInterestedParty ? "/verification" : `/cases/${caseRecord.id}`}
                  className="border border-[#b1b4b6] bg-white p-4 hover:border-[#1d70b8] dark:bg-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#1d70b8]">{caseRecord.title}</p>
                      <p className="text-sm text-[#505a5f] dark:text-muted-foreground">{company?.name}</p>
                    </div>
                    <StatusBadge status={caseRecord.status} />
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={caseRecord.completedChecks} total={caseRecord.totalChecks} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-xl font-bold">
            {isInterestedParty ? "Latest supplier update" : "Attention queue"}
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
                    ? "Pinebridge Systems is verified for 2025"
                    : "Security controls form needs review"}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                  {isInterestedParty
                    ? "Customers can see completed checks, verification year, and current supplier status."
                    : "Northstar Cloud Platforms has an unsigned controls form due on 21 Jun 2026."}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to={isInterestedParty ? "/verification" : "/cases/case-2026-northstar/checks/security-form"}>
                    {isInterestedParty ? "Open portal" : "Open check"}
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
  return (
    <ConsoleLayout
      breadcrumbs={[{ label: "Verification Portal" }]}
    >
      <PageTitle
        eyebrow="Interested party"
        title="Supplier verification"
        description="Read-only verification status for platform providers you rely on."
      />
      <MetricStrip
        items={[
          { label: "Watched suppliers", value: "3", tone: "blue" },
          { label: "Currently verified", value: "1", tone: "green" },
          { label: "In progress", value: "2", tone: "yellow" },
          { label: "Failed checks", value: "0", tone: "green" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Supplier status</h3>
        <ResourceTable headings={["Supplier", "Verification year", "Status", "Checks", "Visible result"]}>
          {companies.map((company) => (
            <tr key={company.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <span className="font-bold text-[#1d70b8]">{company.name}</span>
              </td>
              <td className="px-4 py-3">2026</td>
              <td className="px-4 py-3"><StatusBadge status={company.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={company.completedChecks} total={company.totalChecks} /></td>
              <td className="px-4 py-3">
                {company.status === "complete"
                  ? "Verified"
                  : company.status === "attention"
                    ? "More evidence requested"
                    : "Verification in progress"}
              </td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function AdminHome() {
  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Association controls for annual verification."
      breadcrumbs={[{ label: "Administration" }]}
      sidebarItems={adminSidebar}
    >
      <PageTitle
        eyebrow="Administration"
        title="Association management"
        description="Configure platform companies, verification years, check templates, and access to the association console."
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

export function CompaniesPage() {
  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Association controls for annual verification."
      breadcrumbs={[{ label: "Administration", path: "/admin" }, { label: "Platform companies" }]}
      sidebarItems={adminSidebar}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Platform companies"
        description="Select a company to review ownership, cases, verification status, and audit activity."
        actions={
          <Button>
            <Plus />
            Add company
          </Button>
        }
      />
      <ResourceTable headings={["Company", "Owner", "Status", "Open cases", "Progress", "Last activity"]}>
        {companies.map((company) => (
          <tr key={company.id} className="border-b border-[#b1b4b6] last:border-b-0">
            <td className="px-4 py-3">
              <Link className="font-bold text-[#1d70b8] hover:underline" to={`/admin/companies/${company.id}`}>
                {company.name}
              </Link>
            </td>
            <td className="px-4 py-3">{company.owner}</td>
            <td className="px-4 py-3"><StatusBadge status={company.status} /></td>
            <td className="px-4 py-3">{company.openCases}</td>
            <td className="px-4 py-3"><ProgressBar value={company.completedChecks} total={company.totalChecks} /></td>
            <td className="px-4 py-3">{company.lastActivity}</td>
          </tr>
        ))}
      </ResourceTable>
    </ConsoleLayout>
  );
}

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const company = getCompany(companyId);
  if (!company) return <Navigate to="/admin/companies" replace />;

  const companyCases = cases.filter((caseRecord) => caseRecord.companyId === company.id);

  return (
    <ConsoleLayout
      appName="Administration"
      appDescription="Association controls for annual verification."
      breadcrumbs={[
        { label: "Administration", path: "/admin" },
        { label: "Platform companies", path: "/admin/companies" },
        { label: company.name },
      ]}
      sidebarItems={adminSidebar}
    >
      <PageTitle
        eyebrow="Company"
        title={company.name}
        description="Review ownership, verification progress, cases, users, and audit activity for this platform company."
      />
      <Tabs
        current="Overview"
        tabs={[
          { label: "Overview", path: `/admin/companies/${company.id}` },
          { label: "Users", path: `/admin/companies/${company.id}` },
          { label: "Cases", path: `/admin/companies/${company.id}` },
          { label: "Audit", path: `/admin/companies/${company.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Current status", value: company.status.replace("-", " "), tone: company.status === "attention" ? "red" : "blue" },
          { label: "Open cases", value: String(company.openCases), tone: "blue" },
          { label: "Checks complete", value: `${company.completedChecks}/${company.totalChecks}`, tone: "green" },
          { label: "Owner", value: company.owner, tone: "yellow" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Cases</h3>
        <ResourceTable headings={["Case", "Status", "Progress", "Risk", "Last activity"]}>
          {companyCases.map((caseRecord) => (
            <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${caseRecord.id}`}>
                  {caseRecord.title}
                </Link>
              </td>
              <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={caseRecord.completedChecks} total={caseRecord.totalChecks} /></td>
              <td className="px-4 py-3 capitalize">{caseRecord.risk}</td>
              <td className="px-4 py-3">{caseRecord.lastActivity}</td>
            </tr>
          ))}
        </ResourceTable>
      </section>
    </ConsoleLayout>
  );
}

export function CaseManagementHome() {
  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Annual verification work for IT platform companies."
      breadcrumbs={[{ label: "Case Management" }]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Case Management"
        title="Verification workspace"
        description="Open cases, complete checks, upload evidence, and inspect the customer-facing verification preview."
        actions={
          <Button asChild>
            <Link to="/cases/list">
              <Plus />
              New annual case
            </Link>
          </Button>
        }
      />
      <MetricStrip
        items={[
          { label: "Current company", value: "Northstar Cloud", tone: "blue" },
          { label: "Active case", value: "2026", tone: "yellow" },
          { label: "Completed checks", value: "4 / 7", tone: "green" },
          { label: "Blocked checks", value: "1", tone: "red" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Active case</h3>
        <Link
          to="/cases/case-2026-northstar"
          className="block border border-[#b1b4b6] bg-white p-5 hover:border-[#1d70b8] dark:bg-card"
        >
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-[#1d70b8]">2026 annual verification</p>
              <p className="mt-1 text-sm text-[#505a5f] dark:text-muted-foreground">Northstar Cloud Platforms</p>
            </div>
            <StatusBadge status="open" />
          </div>
          <div className="mt-5 max-w-xl">
            <ProgressBar value={4} total={7} />
          </div>
        </Link>
      </section>
    </ConsoleLayout>
  );
}

export function CasesListPage() {
  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Annual verification work for IT platform companies."
      breadcrumbs={[{ label: "Case Management", path: "/cases" }, { label: "Cases" }]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Resource list"
        title="Cases"
        description="Annual verification cases for platform companies, including current progress and review status."
      />
      <ResourceTable headings={["Case", "Company", "Status", "Progress", "Risk", "Last activity"]}>
        {cases.map((caseRecord) => {
          const company = getCompany(caseRecord.companyId);
          return (
            <tr key={caseRecord.id} className="border-b border-[#b1b4b6] last:border-b-0">
              <td className="px-4 py-3">
                <Link className="font-bold text-[#1d70b8] hover:underline" to={`/cases/${caseRecord.id}`}>
                  {caseRecord.title}
                </Link>
              </td>
              <td className="px-4 py-3">{company?.name}</td>
              <td className="px-4 py-3"><StatusBadge status={caseRecord.status} /></td>
              <td className="px-4 py-3"><ProgressBar value={caseRecord.completedChecks} total={caseRecord.totalChecks} /></td>
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
  const { caseId } = useParams();
  const caseRecord = getCase(caseId);
  if (!caseRecord) return <Navigate to="/cases/list" replace />;

  const company = getCompany(caseRecord.companyId);
  const checks = caseRecord.checks.length ? caseRecord.checks : cases[0].checks;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Annual verification work for IT platform companies."
      breadcrumbs={[
        { label: "Case Management", path: "/cases" },
        { label: "Cases", path: "/cases/list" },
        { label: `${company?.name ?? "Company"} ${caseRecord.year}` },
      ]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Case"
        title={caseRecord.title}
        description={`${company?.name ?? "Unknown company"} verification case for evidence collection, task completion, and association review.`}
      />
      <Tabs
        current="Summary"
        tabs={[
          { label: "Summary", path: `/cases/${caseRecord.id}` },
          { label: "Checks", path: `/cases/${caseRecord.id}` },
          { label: "Evidence", path: `/cases/${caseRecord.id}` },
          { label: "Activity", path: `/cases/${caseRecord.id}` },
          { label: "Review", path: `/cases/${caseRecord.id}` },
        ]}
      />
      <MetricStrip
        items={[
          { label: "Case status", value: caseRecord.status, tone: caseRecord.status === "review" ? "yellow" : "blue" },
          { label: "Checks complete", value: `${caseRecord.completedChecks}/${caseRecord.totalChecks}`, tone: "green" },
          { label: "Risk", value: caseRecord.risk, tone: caseRecord.risk === "high" ? "red" : "yellow" },
          { label: "Last activity", value: caseRecord.lastActivity, tone: "blue" },
        ]}
      />
      <section className="mt-8">
        <h3 className="mb-3 text-xl font-bold">Checks</h3>
        <div className="grid gap-3">
          {checks.map((check) => {
            const Icon = check.Icon;
            return (
              <Link
                key={check.id}
                to={`/cases/${caseRecord.id}/checks/${check.id}`}
                className="grid gap-4 border border-[#b1b4b6] bg-white p-4 hover:border-[#1d70b8] dark:bg-card md:grid-cols-[auto_1fr_auto]"
              >
                <span className="flex size-11 items-center justify-center rounded-sm bg-[#eaf4fb] text-[#1d70b8]">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold text-[#1d70b8]">{check.title}</span>
                  <span className="mt-1 block text-sm text-[#505a5f] dark:text-muted-foreground">{check.description}</span>
                  <span className="mt-2 block text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
                    Owner: {check.owner} | Due: {check.due}
                  </span>
                </span>
                <span className="self-start"><StatusBadge status={check.status} /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </ConsoleLayout>
  );
}

export function CheckDetailPage() {
  const { caseId, checkId } = useParams();
  const caseRecord = getCase(caseId);
  const check = getCheck(caseId, checkId) ?? cases[0].checks.find((item) => item.id === checkId);
  if (!caseRecord || !check) return <Navigate to="/cases/list" replace />;

  const company = getCompany(caseRecord.companyId);
  const Icon = check.Icon;

  return (
    <ConsoleLayout
      appName="Case Management"
      appDescription="Annual verification work for IT platform companies."
      breadcrumbs={[
        { label: "Case Management", path: "/cases" },
        { label: "Cases", path: "/cases/list" },
        { label: `${company?.name ?? "Company"} ${caseRecord.year}`, path: `/cases/${caseRecord.id}` },
        { label: check.title },
      ]}
      sidebarItems={caseSidebar}
    >
      <PageTitle
        eyebrow="Check"
        title={check.title}
        description={check.description}
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
          { label: "Overview", path: `/cases/${caseRecord.id}/checks/${check.id}` },
          { label: "Uploads", path: `/cases/${caseRecord.id}/checks/${check.id}` },
          { label: "History", path: `/cases/${caseRecord.id}/checks/${check.id}` },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-[#b1b4b6] bg-white p-5 dark:bg-card">
          <div className="flex items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-sm bg-[#eaf4fb] text-[#1d70b8]">
              <Icon className="size-6" />
            </span>
            <div>
              <StatusBadge status={check.status} />
              <h3 className="mt-4 text-xl font-bold">Work area</h3>
              <p className="mt-2 text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                Manage evidence, generated review signals, submission state, and audit history for this verification task.
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
              <dd>{check.owner}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Due date</dt>
              <dd>{check.due}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#505a5f] dark:text-muted-foreground">Type</dt>
              <dd>{check.type}</dd>
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
      appDescription={isAdmin ? "Association controls for annual verification." : "Annual verification work for IT platform companies."}
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
