import { useAuth } from "@/context/AuthContext";
import {
  type AuthenticatableUserMembership,
  authorities,
  getAccountContextsForUser,
  getAuthenticatableUsersForEntity,
  participants,
  stakeholders,
  userIdentities,
} from "@/data/console";
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

  function submit(context: NonNullable<ReturnType<typeof getSelectedContextForUser>>) {
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
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-10 text-[#0b0c0c] dark:bg-background dark:text-foreground sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Sign in</h1>
        </div>

        <section>
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm font-bold" htmlFor="context-type">
              Account type
              <select
                id="context-type"
                required
                value={selectedContextType}
                onChange={(event) => setSelectedContextType(event.target.value as PrimaryContextType | "")}
                className="h-10 w-full border border-[#0b0c0c] bg-white px-3 text-sm font-normal text-[#0b0c0c] outline-none focus:ring-2 focus:ring-[#ffdd00] dark:bg-background dark:text-foreground"
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
                className="h-10 w-full border border-[#0b0c0c] bg-white px-3 text-sm font-normal text-[#0b0c0c] outline-none focus:ring-2 focus:ring-[#ffdd00] disabled:border-[#b1b4b6] disabled:bg-[#f3f2f1] disabled:text-[#505a5f] dark:bg-background dark:text-foreground"
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

          <h2 className="mt-8 text-base font-bold">User</h2>
          <div className="mt-3 grid gap-2">
            {selectedMembership ? filteredUsers.map((identity) => {
              const context = getSelectedContextForUser(identity.id);
              return (
                <button
                  key={identity.id}
                  type="button"
                  disabled={!context}
                  onClick={() => context && submit(context)}
                  className="border border-[#b1b4b6] bg-white p-3 text-left hover:border-[#0b0c0c] disabled:pointer-events-none disabled:opacity-50 dark:bg-card"
                >
                  <span className="block text-sm font-bold">
                    {identity.name}
                  </span>
                  <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                    {identity.email}
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
        </section>
      </div>
    </main>
  );
}
