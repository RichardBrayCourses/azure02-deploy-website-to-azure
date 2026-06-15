import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

export type Crumb = {
  label: string;
  path?: string;
};

export type SidebarItem = {
  label: string;
  path: string;
  Icon: typeof Home;
  detail?: string;
};

type ConsoleLayoutProps = {
  appName?: string;
  appDescription?: string;
  breadcrumbs: Crumb[];
  sidebarItems?: SidebarItem[];
  actions?: ReactNode;
  children: ReactNode;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
      <Link className="flex items-center gap-1 font-bold text-[#1d70b8] hover:underline" to="/">
        <Home className="size-4" />
        Console home
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.path ?? "current"}`} className="flex items-center gap-1">
          <ChevronRight className="size-4 text-[#505a5f]" />
          {item.path ? (
            <Link className="font-bold text-[#1d70b8] hover:underline" to={item.path}>
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-[#0b0c0c] dark:text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function ConsoleLayout({
  appName,
  appDescription,
  breadcrumbs,
  sidebarItems,
  actions,
  children,
}: ConsoleLayoutProps) {
  const visibleSidebarItems = sidebarItems ?? [];
  const hasSidebar = visibleSidebarItems.length > 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f8f8f8] text-[#0b0c0c] dark:bg-background dark:text-foreground">
      <div className="border-b border-[#b1b4b6] bg-white dark:bg-card">
        <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div
        className={cn(
          "mx-auto grid w-full max-w-[1440px]",
          hasSidebar && "lg:grid-cols-[280px_minmax(0,1fr)]",
        )}
      >
        {hasSidebar && (
          <aside className="border-b border-[#b1b4b6] bg-white p-3 dark:bg-card lg:min-h-[calc(100vh-7.25rem)] lg:border-b-0 lg:border-r">
            {appName && (
              <div className="mb-3 border-b border-[#b1b4b6] px-2 pb-4">
                <p className="text-xs font-bold uppercase text-[#505a5f] dark:text-muted-foreground">
                  Resource console
                </p>
                <h1 className="mt-1 text-xl font-bold">{appName}</h1>
                {appDescription && (
                  <p className="mt-1 text-sm leading-5 text-[#505a5f] dark:text-muted-foreground">
                    {appDescription}
                  </p>
                )}
              </div>
            )}
            <nav className="grid gap-1" aria-label={`${appName ?? "Console"} navigation`}>
              {visibleSidebarItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin" || item.path === "/cases"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-sm border-l-4 border-transparent px-3 py-2 text-sm font-bold text-[#0b0c0c] hover:bg-[#f3f2f1] dark:text-foreground dark:hover:bg-accent",
                        isActive && "border-[#1d70b8] bg-[#eaf4fb] dark:bg-accent",
                      )
                    }
                  >
                    <Icon className="size-4 text-[#1d70b8]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.label}</span>
                      {item.detail && (
                        <span className="block truncate text-xs font-normal text-[#505a5f] dark:text-muted-foreground">
                          {item.detail}
                        </span>
                      )}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        )}

        <main className="min-w-0 p-4 sm:p-6">
          {actions && <div className="mb-4 flex flex-wrap justify-end gap-2">{actions}</div>}
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
