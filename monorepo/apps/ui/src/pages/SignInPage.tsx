import { useAuth } from "@/context/AuthContext";
import {
  type AccountContext,
  type AuthenticatableUserMembership,
  authorities,
  getAccountContextsForUser,
  getAuthenticatableUsersForEntity,
  participants,
  stakeholders,
  userIdentities,
} from "@/data/console";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PrimaryContextType = AuthenticatableUserMembership["entityType"];
type EntityOption = {
  id: string;
  name: string;
  authorityName?: string;
};

const contextLabels = {
  authority: "Authority",
  participant: "Participant",
  stakeholder: "Stakeholder",
  helper: "Service provider",
};

function contextRoleLabel(context: AccountContext) {
  return `${contextLabels[context.entityType]} ${context.membershipRole.toLowerCase()}`;
}

const contextTypeOptions: Array<{ value: PrimaryContextType; label: string }> = [
  { value: "authority", label: "Authority" },
  { value: "participant", label: "Participant" },
  { value: "stakeholder", label: "Stakeholder" },
];

export default function SignInPage() {
  const { login } = useAuth();
  const [selectedContextType, setSelectedContextType] = useState<PrimaryContextType | "">("");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const selectedMembership = selectedContextType && selectedEntityId
    ? { entityType: selectedContextType, entityId: selectedEntityId } satisfies AuthenticatableUserMembership
    : null;
  const entityOptions = useMemo<EntityOption[]>(() => {
    if (selectedContextType === "authority") {
      return authorities.map((authority) => ({ id: authority.id, name: authority.name }));
    }
    if (selectedContextType === "participant") {
      return participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        authorityName: authorities.find((authority) => authority.id === participant.authorityId)?.name,
      }));
    }
    if (selectedContextType === "stakeholder") {
      return stakeholders.map((stakeholder) => ({
        id: stakeholder.id,
        name: stakeholder.name,
        authorityName: authorities.find((authority) => authority.id === stakeholder.authorityId)?.name,
      }));
    }
    return [];
  }, [selectedContextType]);
  const filteredUsers = useMemo(() => {
    if (!selectedMembership) return [];
    const userIds = new Set(
      getAuthenticatableUsersForEntity(selectedMembership).map((membership) => membership.id),
    );
    return userIdentities.filter((identity) => userIds.has(identity.id));
  }, [selectedMembership]);

  useEffect(() => {
    setSelectedEntityId("");
  }, [selectedContextType]);

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

  function getSelectedContextForUser(userId: string) {
    if (!selectedMembership) return undefined;
    return getAccountContextsForUser(userId).find(
      (context) =>
        context.entityType === selectedMembership.entityType &&
        context.entityId === selectedMembership.entityId,
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 text-[#0b0c0c] dark:bg-background dark:text-foreground sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-[#b1b4b6] pb-5">
          <p className="text-sm font-bold uppercase text-[#505a5f] dark:text-muted-foreground">Sign in</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">CaseFlow Console</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#505a5f] dark:text-muted-foreground">
            Choose an account type and organisation, then choose a user identity for this session.
          </p>
        </div>

        <section className="max-w-xl">
          <div className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold">
              {[
                { label: "Account type", done: Boolean(selectedContextType), active: !selectedContextType },
                { label: "Organisation", done: Boolean(selectedEntityId), active: Boolean(selectedContextType) && !selectedEntityId },
                { label: "Identity", done: false, active: Boolean(selectedEntityId) },
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

            <div className="grid gap-3">
              <label className="grid gap-1 text-sm font-bold" htmlFor="context-type">
                Account type
                <select
                  id="context-type"
                  required
                  value={selectedContextType}
                  onChange={(event) => setSelectedContextType(event.target.value as PrimaryContextType | "")}
                  className="h-10 w-full border border-[#0b0c0c] bg-white px-3 text-sm font-normal text-[#0b0c0c] outline-none focus:border-[#1d70b8] focus:ring-2 focus:ring-[#ffdd00] dark:bg-background dark:text-foreground"
                >
                  <option value="">Select account type</option>
                  {contextTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-sm font-bold" htmlFor="entity-id">
                Organisation
                <select
                  id="entity-id"
                  required
                  value={selectedEntityId}
                  disabled={!selectedContextType}
                  onChange={(event) => setSelectedEntityId(event.target.value)}
                  className="h-10 w-full border border-[#0b0c0c] bg-white px-3 text-sm font-normal text-[#0b0c0c] outline-none focus:border-[#1d70b8] focus:ring-2 focus:ring-[#ffdd00] disabled:border-[#b1b4b6] disabled:bg-[#f3f2f1] disabled:text-[#505a5f] dark:bg-background dark:text-foreground"
                >
                  <option value="">
                    {selectedContextType ? `Select ${contextLabels[selectedContextType].toLowerCase()}` : "Select account type first"}
                  </option>
                  {entityOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.authorityName ? `${option.name} - ${option.authorityName}` : option.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h2 className="mt-5 text-base font-bold">Who is signing in?</h2>
            <div className="mt-3 grid gap-2">
              {selectedMembership ? filteredUsers.map((identity) => {
                const context = getSelectedContextForUser(identity.id);
                return (
                  <button
                    key={identity.id}
                    type="button"
                    disabled={!context}
                    onClick={() => context && submit(context)}
                    className="border border-[#b1b4b6] bg-[#f8f8f8] p-3 text-left hover:border-[#1d70b8] hover:bg-[#eaf4fb] disabled:pointer-events-none disabled:opacity-50 dark:bg-background"
                  >
                    <span className="block text-sm font-bold text-[#1d70b8]">
                      {identity.name}
                    </span>
                    <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                      {identity.email}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#505a5f] dark:text-muted-foreground">
                      <BadgeCheck className="size-3" />
                      {context ? contextRoleLabel(context) : "No matching account context"}
                    </span>
                  </button>
                );
              }) : (
                <div className="border border-dashed border-[#b1b4b6] p-4 text-sm text-[#505a5f] dark:text-muted-foreground">
                  Select an account type and organisation to show matching users.
                </div>
              )}
              {selectedMembership && filteredUsers.length === 0 && (
                <div className="border border-dashed border-[#b1b4b6] p-4 text-sm text-[#505a5f] dark:text-muted-foreground">
                  No active users belong to this organisation.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
