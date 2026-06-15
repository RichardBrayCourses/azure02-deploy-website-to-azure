import { useAuth } from "@/context/AuthContext";
import {
  type AccountContext,
  getAccountContextsForUser,
  userIdentities,
} from "@/data/console";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Handshake,
  Landmark,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

const contextIcons = {
  authority: Landmark,
  participant: Building2,
  stakeholder: UserRoundCheck,
  helper: Handshake,
};

const contextLabels = {
  authority: "Association",
  participant: "Vendor",
  stakeholder: "Subscriber",
  helper: "Service provider",
};

function contextRoleLabel(context: AccountContext) {
  return `${contextLabels[context.entityType]} ${context.membershipRole.toLowerCase()}`;
}

export default function SignInPage() {
  const { login } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = userIdentities.find((identity) => identity.id === selectedUserId);
  const accountContexts = useMemo(
    () => getAccountContextsForUser(selectedUserId),
    [selectedUserId],
  );

  function submit(context: AccountContext) {
    login({
      authenticatableUserId: context.authenticatableUserId,
      name: context.name,
      email: context.email,
      authorityId: context.authorityId,
      role: context.role,
      accountContextId: context.id,
      accountContextType: context.entityType,
      accountContextEntityId: context.entityId,
      accountContextName: context.entityName,
      membershipRole: context.membershipRole,
      participantId: context.participantId,
      stakeholderId: context.stakeholderId,
    });
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 text-[#0b0c0c] dark:bg-background dark:text-foreground sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-[#b1b4b6] pb-5">
          <p className="text-sm font-bold uppercase text-[#505a5f] dark:text-muted-foreground">Sign in</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">CaseFlow Console</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#505a5f] dark:text-muted-foreground">
            Choose a user identity, then choose the association account context for this session.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(18rem,28rem)_1fr]">
          <div className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold">
              {[
                { label: "Identity", done: Boolean(selectedUser), active: !selectedUser },
                { label: "Account context", done: false, active: Boolean(selectedUser) },
              ].map((step) => (
                <span
                  key={step.label}
                  className={cn(
                    "inline-flex items-center gap-1 border px-2 py-1",
                    step.active && "border-[#1d70b8] bg-[#eaf4fb] text-[#1d70b8]",
                    step.done && "border-[#00703c] bg-[#eaf7ef] text-[#00703c]",
                    !step.active && !step.done && "border-[#b1b4b6] text-[#505a5f]",
                  )}
                >
                  {step.done && <CheckCircle2 className="size-3" />}
                  {step.label}
                </span>
              ))}
            </div>

            <h2 className="text-base font-bold">Who is signing in?</h2>
            <div className="mt-3 grid gap-2">
              {userIdentities.map((identity) => {
                const contexts = getAccountContextsForUser(identity.id);
                const selected = selectedUserId === identity.id;
                return (
                  <button
                    key={identity.id}
                    type="button"
                    onClick={() => setSelectedUserId(identity.id)}
                    className={cn(
                      "border p-3 text-left hover:border-[#1d70b8]",
                      selected
                        ? "border-[#00703c] bg-[#eaf7ef]"
                        : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                    )}
                  >
                    <span className={cn("block text-sm font-bold", selected ? "text-[#00703c]" : "text-[#1d70b8]")}>
                      {identity.name}
                    </span>
                    <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                      {identity.email}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
                      <BadgeCheck className="size-3" />
                      {contexts.length} account {contexts.length === 1 ? "context" : "contexts"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <h2 className="text-base font-bold">Choose account context</h2>
            <p className="mt-1 text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
              The active context controls which apps, vendors, DDQs, and subscriber reviews are visible.
            </p>

            {selectedUser ? (
              <div className="mt-4">
                <div className="mb-3 border-l-4 border-[#1d70b8] bg-[#f3f2f1] px-3 py-2 dark:bg-background">
                  <span className="block text-sm font-bold">{selectedUser.name}</span>
                  <span className="block text-xs text-[#505a5f] dark:text-muted-foreground">{selectedUser.email}</span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {accountContexts.map((context) => {
                    const Icon = contextIcons[context.entityType];
                    return (
                      <button
                        key={context.id}
                        type="button"
                        onClick={() => submit(context)}
                        className="border border-[#b1b4b6] bg-[#f8f8f8] p-4 text-left hover:border-[#1d70b8] hover:bg-[#eaf4fb] dark:bg-background"
                      >
                        <Icon className="mb-3 size-5 text-[#1d70b8]" />
                        <span className="block text-sm font-bold text-[#1d70b8]">{context.entityName}</span>
                        <span className="mt-1 block text-xs font-bold">{contextRoleLabel(context)}</span>
                        <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                          {context.authorityName}
                        </span>
                        <span className="mt-3 block text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
                          {context.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-[#b1b4b6] p-4 text-sm text-[#505a5f] dark:text-muted-foreground">
                Choose a user identity to show their available account contexts.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
