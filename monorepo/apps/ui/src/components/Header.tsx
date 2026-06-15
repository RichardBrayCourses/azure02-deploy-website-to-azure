import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getUserRoleLabel, useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  getConsoleAppsForRole,
  getOperationalParticipant,
  getOwningOrganisation,
  getSearchItemsForUser,
} from "@/data/console";
import { cn } from "@/lib/utils";
import {
  Bell,
  CircleHelp,
  Grid3X3,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AppLauncherIcon() {
  return (
    <span className="grid size-5 grid-cols-3 gap-0.5" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className="rounded-[1px] bg-current" />
      ))}
    </span>
  );
}

function GlobalSearch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const searchItems = getSearchItemsForUser(user);
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchItems.slice(0, 6);

    return searchItems
      .filter((item) =>
        `${item.title} ${item.description} ${item.group}`
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 7);
  }, [query, user]);

  function go(path: string) {
    navigate(path);
    setQuery("");
    setOpen(false);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (matches[0]) go(matches[0].path);
  }

  return (
    <form className="relative hidden w-full max-w-2xl lg:block" onSubmit={onSubmit}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70" />
      <Input
        aria-label="Search console"
        className="h-9 rounded-sm border-white/25 bg-white/10 pl-9 text-sm text-white shadow-none placeholder:text-white/65 focus-visible:border-white focus-visible:ring-white/35"
        placeholder="Search apps, cases, organisations, tasks"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />
      {open && (
        <div className="absolute left-0 right-0 top-11 z-50 rounded-sm border border-[#b1b4b6] bg-white py-2 text-[#0b0c0c] shadow-xl">
          {matches.length ? (
            matches.map((item) => (
              <button
                key={`${item.group}-${item.path}`}
                type="button"
                className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-[#f3f2f1] focus:bg-[#f3f2f1] focus:outline-none"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => go(item.path)}
              >
                <span className="mt-1 rounded-sm bg-[#1d70b8] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                  {item.group}
                </span>
                <span>
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="block text-xs text-[#505a5f]">{item.description}</span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-[#505a5f]">No console results found.</div>
          )}
        </div>
      )}
    </form>
  );
}

const Header = () => {
  const { dark, setDark } = useTheme();
  const { user, logout } = useAuth();
  const availableApps = getConsoleAppsForRole(user.role);
  const owningOrganisation = getOwningOrganisation(user.owningOrganisationId ?? undefined);
  const operationalParticipant = getOperationalParticipant(user.operationalParticipantId ?? undefined);

  return (
    <header className="sticky top-0 z-40 border-b border-black bg-[#0b1f33] text-white">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open app launcher"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-white hover:bg-white/10 hover:text-white",
            )}
          >
            <AppLauncherIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 rounded-sm p-3">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Grid3X3 className="size-4" />
              Console apps
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-2 gap-2 p-1">
              {availableApps.map((app) => {
                const Icon = app.Icon;
                return (
                  <DropdownMenuItem key={app.id} asChild className="block p-0">
                    <Link
                      to={app.path}
                      className="block rounded-sm border border-transparent p-3 hover:border-[#1d70b8] hover:bg-[#f3f2f1]"
                    >
                      <span className={cn("mb-2 flex size-8 items-center justify-center rounded-sm text-white", app.accent)}>
                        <Icon className="size-4" />
                      </span>
                      <span className="block text-sm font-bold">{app.shortName}</span>
                      <span className="mt-1 block text-xs leading-4 text-[#505a5f]">
                        {app.description}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="ghost" className="h-10 px-2 text-white hover:bg-white/10 hover:text-white">
          <Link to="/" className="text-base font-bold tracking-normal">
            CaseFlow Console
          </Link>
        </Button>

        <span className="hidden rounded-sm border border-white/25 bg-white/10 px-2 py-1 text-xs font-bold sm:inline-flex">
          {getUserRoleLabel(user.role)}
        </span>
        {owningOrganisation && (
          <span className="hidden rounded-sm border border-white/25 bg-white/10 px-2 py-1 text-xs font-bold xl:inline-flex">
            {owningOrganisation.name}
          </span>
        )}

        <GlobalSearch />

        <div className="ml-auto flex items-center gap-1">
          <Button
            aria-label="Help"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <CircleHelp />
          </Button>
          <Button
            aria-label="Notifications"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <Bell />
          </Button>
          <Button
            aria-label="Toggle theme"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-white hover:bg-white/10 hover:text-white",
              )}
              aria-label="Open account menu"
            >
              <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-sm">
              <DropdownMenuLabel>
                <span className="block">Account</span>
                <span className="block text-xs font-normal text-muted-foreground">
                  {user.email ?? "Not signed in"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <span className="block text-xs font-bold uppercase text-muted-foreground">Current scope</span>
                <span className="mt-1 block text-sm font-medium">{getUserRoleLabel(user.role)}</span>
                {owningOrganisation && (
                  <span className="block text-xs text-muted-foreground">{owningOrganisation.name}</span>
                )}
                {operationalParticipant && (
                  <span className="block text-xs text-muted-foreground">{operationalParticipant.name}</span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
