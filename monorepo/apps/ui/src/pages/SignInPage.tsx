import { USER_ROLES, UserRole, useAuth } from "@/context/AuthContext";
import {
  type AuthenticatableUserMembership,
  getAuthenticatableUsersForEntity,
  getOperationalParticipantsForUmbrellaOrganization,
  umbrellaOrganizations,
} from "@/data/console";
import { cn } from "@/lib/utils";
import { Building2, CheckCircle2, UserRoundCheck, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

const roleIcons = {
  "umbrella-organization-admin": Building2,
  "operational-participant": UsersRound,
  "interested-party": UserRoundCheck,
};

export default function SignInPage() {
  const { login } = useAuth();
  const [umbrellaOrganizationId, setUmbrellaOrganizationId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [operationalParticipantId, setOperationalParticipantId] = useState<string | null>(null);

  const operationalParticipants = useMemo(
    () => getOperationalParticipantsForUmbrellaOrganization(umbrellaOrganizationId ?? undefined),
    [umbrellaOrganizationId],
  );
  const requiresOperationalParticipant = role === "operational-participant" || role === "interested-party";
  const step = !umbrellaOrganizationId ? 1 : !role ? 2 : requiresOperationalParticipant && !operationalParticipantId ? 3 : 4;
  const selectedParticipant = operationalParticipants.find((participant) => participant.id === operationalParticipantId);
  const selectedMembership: AuthenticatableUserMembership | null =
    !umbrellaOrganizationId || !role
      ? null
      : role === "umbrella-organization-admin"
        ? { entityType: "umbrella-organization", entityId: umbrellaOrganizationId }
        : !selectedParticipant
          ? null
          : role === "operational-participant"
            ? { entityType: "operational-participant", entityId: selectedParticipant.id }
            : { entityType: "interested-party", entityId: selectedParticipant.interestedPartyId };
  const authenticatableUsers = getAuthenticatableUsersForEntity(selectedMembership);

  function selectUmbrellaOrganization(id: string) {
    setUmbrellaOrganizationId(id);
    setRole(null);
    setOperationalParticipantId(null);
  }

  function selectRole(nextRole: UserRole) {
    setRole(nextRole);
    setOperationalParticipantId(null);
  }

  function submit(authenticatableUser: (typeof authenticatableUsers)[number]) {
    if (!umbrellaOrganizationId || !role || !selectedMembership) return;
    login({
      authenticatableUserId: authenticatableUser.id,
      name: authenticatableUser.name,
      email: authenticatableUser.email,
      umbrellaOrganizationId,
      role,
      operationalParticipantId: role === "umbrella-organization-admin" ? null : operationalParticipantId,
    });
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 text-[#0b0c0c] dark:bg-background dark:text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-[#b1b4b6] pb-5">
          <p className="text-sm font-bold uppercase text-[#505a5f] dark:text-muted-foreground">Sign in</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">CaseFlow Console</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#505a5f] dark:text-muted-foreground">
            Choose the organization and access scope for this session.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold">
              {["Umbrella organization", "Role", "Operational participant"].map((label, index) => {
                const active = step === index + 1;
                const done = step > index + 1;
                return (
                  <span
                    key={label}
                    className={cn(
                      "inline-flex items-center gap-1 border px-2 py-1",
                      active && "border-[#1d70b8] bg-[#eaf4fb] text-[#1d70b8]",
                      done && "border-[#00703c] bg-[#eaf7ef] text-[#00703c]",
                      !active && !done && "border-[#b1b4b6] text-[#505a5f]",
                    )}
                  >
                    {done && <CheckCircle2 className="size-3" />}
                    {label}
                  </span>
                );
              })}
            </div>

            <div className="grid gap-5">
              <div>
                <h2 className="text-base font-bold">Which umbrella organization are you interested in?</h2>
                <div className="mt-3 grid gap-2">
                  {umbrellaOrganizations.map((organization) => (
                    <button
                      key={organization.id}
                      type="button"
                      onClick={() => selectUmbrellaOrganization(organization.id)}
                      className={cn(
                        "border p-3 text-left hover:border-[#1d70b8]",
                        umbrellaOrganizationId === organization.id
                          ? "border-[#1d70b8] bg-[#eaf4fb]"
                          : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                      )}
                    >
                      <span className="block text-sm font-bold text-[#1d70b8]">{organization.name}</span>
                      <span className="mt-1 block text-xs font-bold">{organization.scenario}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
                        {organization.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {umbrellaOrganizationId && (
                <div>
                  <h2 className="text-base font-bold">Are you signing in as?</h2>
                  <div className="mt-3 grid gap-2">
                    {USER_ROLES.map((item) => {
                      const Icon = roleIcons[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectRole(item.id)}
                          className={cn(
                            "border p-3 text-left hover:border-[#1d70b8]",
                            role === item.id
                              ? "border-[#1d70b8] bg-[#eaf4fb]"
                              : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                          )}
                        >
                          <Icon className="mb-2 size-5 text-[#1d70b8]" />
                          <span className="block text-sm font-bold">{item.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
                            {item.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {requiresOperationalParticipant && (
                <div>
                  <h2 className="text-base font-bold">
                    {role === "operational-participant"
                      ? "Which operational participant are you?"
                      : "Which operational participant are you interested in?"}
                  </h2>
                  <div className="mt-3 grid gap-2">
                    {operationalParticipants.map((participant) => (
                      <button
                        key={participant.id}
                        type="button"
                        onClick={() => setOperationalParticipantId(participant.id)}
                        className={cn(
                          "border p-3 text-left hover:border-[#1d70b8]",
                          operationalParticipantId === participant.id
                            ? "border-[#1d70b8] bg-[#eaf4fb]"
                            : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                        )}
                      >
                        <span className="block text-sm font-bold text-[#1d70b8]">{participant.name}</span>
                        <span className="mt-1 block text-xs font-bold">{participant.type}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
                          {participant.operationalRole}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <h2 className="text-base font-bold">Choose user</h2>
            <p className="mt-1 text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
              Sign in as an authenticatable user who belongs to the selected entity.
            </p>
            {selectedMembership ? (
              <div className="mt-4 grid gap-2">
                {authenticatableUsers.map((authenticatableUser) => (
                  <button
                    key={authenticatableUser.id}
                    type="button"
                    onClick={() => submit(authenticatableUser)}
                    className="border border-[#b1b4b6] bg-[#f8f8f8] p-3 text-left hover:border-[#1d70b8] hover:bg-[#eaf4fb] dark:bg-background"
                  >
                    <span className="block text-sm font-bold text-[#1d70b8]">{authenticatableUser.name}</span>
                    <span className="mt-1 block text-xs text-[#505a5f] dark:text-muted-foreground">
                      {authenticatableUser.email}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-[#b1b4b6] p-4 text-sm text-[#505a5f] dark:text-muted-foreground">
                Complete the selections on the left to show available users.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
