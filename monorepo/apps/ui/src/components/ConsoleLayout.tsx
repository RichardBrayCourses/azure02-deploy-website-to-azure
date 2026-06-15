import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type Crumb = {
  label: string;
  path?: string;
};

type ConsoleLayoutProps = {
  appName?: string;
  appDescription?: string;
  breadcrumbs: Crumb[];
  actions?: ReactNode;
  affirmativeActionLabel?: string;
  affirmativeActionCompleteLabel?: string;
  isEdited?: boolean;
  onAffirmativeAction?: () => void;
  readOnly?: boolean;
  children: ReactNode;
};

function confirmBreadcrumbNavigation() {
  return window.confirm("You have unsaved work. If you leave this page, your changes may be lost.");
}

export function Breadcrumbs({
  hasPendingChanges,
  items,
}: {
  hasPendingChanges: boolean;
  items: Crumb[];
}) {
  const navigate = useNavigate();

  function go(path: string) {
    if (!hasPendingChanges || confirmBreadcrumbNavigation()) {
      navigate(path);
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, index) => (
        <span key={`${item.label}-${item.path ?? "current"}`} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="size-4 text-[#505a5f]" />}
          {item.path ? (
            <button
              className="font-bold text-[#1d70b8] hover:underline"
              type="button"
              onClick={() => go(item.path ?? "/")}
            >
              {item.label}
            </button>
          ) : (
            <span className="font-bold text-[#0b0c0c] dark:text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function ConsoleLayout({
  affirmativeActionCompleteLabel = "Updated",
  affirmativeActionLabel = "Save changes",
  breadcrumbs,
  actions,
  isEdited,
  onAffirmativeAction,
  readOnly = false,
  children,
}: ConsoleLayoutProps) {
  const location = useLocation();
  const isControlled = isEdited !== undefined;
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const hasEdits = readOnly ? false : isEdited ?? hasPendingChanges;
  const affirmativeText = hasEdits || isControlled ? affirmativeActionLabel : affirmativeActionCompleteLabel;

  useEffect(() => {
    if (!isControlled) {
      setHasPendingChanges(false);
    }
  }, [isControlled, location.pathname]);

  function completeAffirmativeAction() {
    if (onAffirmativeAction) {
      onAffirmativeAction();
    } else {
      setHasPendingChanges(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8f8f8] text-[#0b0c0c] dark:bg-background dark:text-foreground">
      <div className="border-b border-[#b1b4b6] bg-white dark:bg-card">
        <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6">
          <Breadcrumbs hasPendingChanges={hasEdits} items={breadcrumbs} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px]">
        <main className="min-w-0 p-4 sm:p-6">
          {(actions || !readOnly) && (
            <div className="mb-4 flex flex-wrap justify-end gap-2">
              {actions}
              {!readOnly && (
                <Button
                  type="button"
                  variant={hasEdits ? "default" : "outline"}
                  onClick={completeAffirmativeAction}
                  disabled={!hasEdits}
                >
                  <CheckCircle2 />
                  {affirmativeText}
                </Button>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#b1b4b6] pb-5 md:flex-row md:items-start md:justify-between">
      <div className="max-w-4xl">
        {eyebrow && <p className="text-sm font-bold uppercase text-[#505a5f] dark:text-muted-foreground">{eyebrow}</p>}
        <h2 className="mt-1 text-3xl font-bold tracking-normal sm:text-4xl">{title}</h2>
        {description && (
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#505a5f] dark:text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function MetricStrip({
  items,
}: {
  items: Array<{ label: string; value: string; tone?: "blue" | "green" | "red" | "yellow" }>;
}) {
  const toneMap = {
    blue: "border-[#1d70b8]",
    green: "border-[#00703c]",
    red: "border-[#d4351c]",
    yellow: "border-[#ffdd00]",
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "border-l-4 bg-white px-4 py-3 shadow-sm dark:bg-card",
            toneMap[item.tone ?? "blue"],
          )}
        >
          <p className="text-sm font-bold text-[#505a5f] dark:text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function Tabs({
  tabs,
  current,
}: {
  tabs: Array<{ label: string; path: string }>;
  current: string;
}) {
  return (
    <div className="mb-6 border-b border-[#b1b4b6]">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.path}
            asChild
            variant="ghost"
            className={cn(
              "h-11 rounded-none border-b-4 border-transparent px-4 font-bold",
              current === tab.label && "border-[#1d70b8] bg-white dark:bg-card",
            )}
          >
            <Link to={tab.path}>{tab.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
