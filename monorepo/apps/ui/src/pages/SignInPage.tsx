import { USER_ROLES, UserRole, useAuth } from "@/context/AuthContext";
import {
  type AuthenticatableUserMembership,
  getAuthenticatableUsersForEntity,
  getParticipantsForAuthority,
  authorities,
} from "@/data/console";
import { cn } from "@/lib/utils";
import { Building2, CheckCircle2, UserRoundCheck, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

const roleIcons = {
  "authority-admin": Building2,
  "participant": UsersRound,
  "stakeholder": UserRoundCheck,
};

export default function SignInPage() {
  const { login } = useAuth();
  const [authorityId, setAuthorityId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  const participants = useMemo(
    () => getParticipantsForAuthority(authorityId ?? undefined),
    [authorityId],
  );
  const requiresParticipant = role === "participant" || role === "stakeholder";
  const step = !authorityId ? 1 : !role ? 2 : requiresParticipant && !participantId ? 3 : 4;
  const selectedAuthority = authorities.find((organization) => organization.id === authorityId);
  const selectedParticipant = participants.find((participant) => participant.id === participantId);
  const selectedMembership: AuthenticatableUserMembership | null =
    !authorityId || !role
      ? null
      : role === "authority-admin"
        ? { entityType: "authority", entityId: authorityId }
        : !selectedParticipant
          ? null
          : role === "participant"
            ? { entityType: "participant", entityId: selectedParticipant.id }
            : { entityType: "stakeholder", entityId: selectedParticipant.stakeholderId };
  const authenticatableUsers = getAuthenticatableUsersForEntity(selectedMembership);

  function selectAuthority(id: string) {
    setAuthorityId(id);
    setRole(null);
    setParticipantId(null);
  }

  function selectRole(nextRole: UserRole) {
    setRole(nextRole);
    setParticipantId(null);
  }

  function changeAuthority() {
    setAuthorityId(null);
    setRole(null);
    setParticipantId(null);
  }

  function changeRole() {
    setRole(null);
    setParticipantId(null);
  }

  function changeParticipant() {
    setParticipantId(null);
  }

  function submit(authenticatableUser: (typeof authenticatableUsers)[number]) {
    if (!authorityId || !role || !selectedMembership) return;
    login({
      authenticatableUserId: authenticatableUser.id,
      name: authenticatableUser.name,
      email: authenticatableUser.email,
      authorityId,
      role,
      participantId: role === "authority-admin" ? null : participantId,
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

        <section className="grid gap-6 lg:grid-cols-[minmax(20rem,32rem)_22rem]">
          <div className="border border-[#b1b4b6] bg-white p-4 dark:bg-card">
            <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold">
              {["Authority", "Role", "Participant"].map((label, index) => {
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
                <h2 className="text-base font-bold">Which authority do you want to sign in under?</h2>
                {selectedAuthority ? (
                  <div className="mt-2 flex items-center justify-between gap-3 border border-[#00703c] bg-[#eaf7ef] p-2">
                    <div>
                      <span className="block text-sm font-bold text-[#00703c]">{selectedAuthority.name}</span>
                      <span className="block text-xs text-[#505a5f]">{selectedAuthority.scenario}</span>
                    </div>
                    <button className="text-xs font-bold text-[#1d70b8] hover:underline" type="button" onClick={changeAuthority}>
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 grid gap-2">
                    {authorities.map((organization) => (
                      <button
                        key={organization.id}
                        type="button"
                        onClick={() => selectAuthority(organization.id)}
                        className="border border-[#b1b4b6] bg-[#f8f8f8] p-3 text-left hover:border-[#1d70b8] dark:bg-background"
                      >
                        <span className="block text-sm font-bold text-[#1d70b8]">{organization.name}</span>
                        <span className="mt-1 block text-xs font-bold">{organization.scenario}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
                          {organization.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {authorityId && (
                <div>
                  <h2 className="text-base font-bold">Are you signing in as?</h2>
                  {role ? (
                    <div className="mt-2 flex items-center justify-between gap-3 border border-[#00703c] bg-[#eaf7ef] p-2">
                      <span className="text-sm font-bold text-[#00703c]">{USER_ROLES.find((item) => item.id === role)?.label}</span>
                      <button className="text-xs font-bold text-[#1d70b8] hover:underline" type="button" onClick={changeRole}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-2">
                      {USER_ROLES.map((item) => {
                        const Icon = roleIcons[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectRole(item.id)}
                            className="border border-[#b1b4b6] bg-[#f8f8f8] p-3 text-left hover:border-[#1d70b8] dark:bg-background"
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
                  )}
                </div>
              )}

              {requiresParticipant && (
                <div>
                  <h2 className="text-base font-bold">
                    {role === "participant"
                      ? "Which participant are you?"
                      : "Which participant do you want to view?"}
                  </h2>
                  {selectedParticipant ? (
                    <div className="mt-2 flex items-center justify-between gap-3 border border-[#00703c] bg-[#eaf7ef] p-2">
                      <div>
                        <span className="block text-sm font-bold text-[#00703c]">{selectedParticipant.name}</span>
                        <span className="block text-xs text-[#505a5f]">{selectedParticipant.type}</span>
                      </div>
                      <button className="text-xs font-bold text-[#1d70b8] hover:underline" type="button" onClick={changeParticipant}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-2">
                      {participants.map((participant) => (
                        <button
                          key={participant.id}
                          type="button"
                          onClick={() => setParticipantId(participant.id)}
                          className="border border-[#b1b4b6] bg-[#f8f8f8] p-3 text-left hover:border-[#1d70b8] dark:bg-background"
                        >
                          <span className="block text-sm font-bold text-[#1d70b8]">{participant.name}</span>
                          <span className="mt-1 block text-xs font-bold">{participant.type}</span>
                          <span className="mt-1 block text-xs leading-5 text-[#505a5f] dark:text-muted-foreground">
                            {participant.participantRole}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
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
