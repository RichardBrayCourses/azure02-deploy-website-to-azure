import { Button } from "@/components/ui/button";
import { USER_ROLES, UserRole, useAuth } from "@/context/AuthContext";
import {
  getOperationalParticipantsForOwningOrganisation,
  owningOrganisations,
} from "@/data/console";
import { cn } from "@/lib/utils";
import { Building2, CheckCircle2, UserRoundCheck, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

const roleIcons = {
  "owning-organisation-admin": Building2,
  "operational-participant": UsersRound,
  "interested-party": UserRoundCheck,
};

export default function SignInPage() {
  const { login } = useAuth();
  const [owningOrganisationId, setOwningOrganisationId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [operationalParticipantId, setOperationalParticipantId] = useState<string | null>(null);

  const operationalParticipants = useMemo(
    () => getOperationalParticipantsForOwningOrganisation(owningOrganisationId ?? undefined),
    [owningOrganisationId],
  );
  const requiresOperationalParticipant = role === "operational-participant" || role === "interested-party";
  const canSignIn = owningOrganisationId && role && (!requiresOperationalParticipant || operationalParticipantId);
  const step = !owningOrganisationId ? 1 : !role ? 2 : requiresOperationalParticipant && !operationalParticipantId ? 3 : 4;

  function selectOwningOrganisation(id: string) {
    setOwningOrganisationId(id);
    setRole(null);
    setOperationalParticipantId(null);
  }

  function selectRole(nextRole: UserRole) {
    setRole(nextRole);
    setOperationalParticipantId(null);
  }

  function submit() {
    if (!owningOrganisationId || !role) return;
    login({
      owningOrganisationId,
      role,
      operationalParticipantId: role === "owning-organisation-admin" ? null : operationalParticipantId,
    });
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 text-[#0b0c0c] dark:bg-background dark:text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-[#b1b4b6] pb-5">
          <p className="text-sm font-bold uppercase text-[#505a5f] dark:text-muted-foreground">Sign in</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">CaseFlow Console</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#505a5f] dark:text-muted-foreground">
            Choose the organisation and access scope for this session.
          </p>
        </div>

        <section className="border border-[#b1b4b6] bg-white p-5 dark:bg-card">
          <div className="mb-5 flex flex-wrap gap-2 text-sm font-bold">
            {["Owning organisation", "Role", "Operational participant"].map((label, index) => {
              const active = step === index + 1;
              const done = step > index + 1;
              return (
                <span
                  key={label}
                  className={cn(
                    "inline-flex items-center gap-2 border px-3 py-2",
                    active && "border-[#1d70b8] bg-[#eaf4fb] text-[#1d70b8]",
                    done && "border-[#00703c] bg-[#eaf7ef] text-[#00703c]",
                    !active && !done && "border-[#b1b4b6] text-[#505a5f]",
                  )}
                >
                  {done && <CheckCircle2 className="size-4" />}
                  {label}
                </span>
              );
            })}
          </div>

          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-bold">Which owning organisation are you interested in?</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {owningOrganisations.map((organisation) => (
                  <button
                    key={organisation.id}
                    type="button"
                    onClick={() => selectOwningOrganisation(organisation.id)}
                    className={cn(
                      "border p-4 text-left hover:border-[#1d70b8]",
                      owningOrganisationId === organisation.id
                        ? "border-[#1d70b8] bg-[#eaf4fb]"
                        : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                    )}
                  >
                    <span className="block text-lg font-bold text-[#1d70b8]">{organisation.name}</span>
                    <span className="mt-1 block text-sm font-bold">{organisation.scenario}</span>
                    <span className="mt-2 block text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                      {organisation.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {owningOrganisationId && (
              <div>
                <h2 className="text-xl font-bold">Are you signing in as?</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {USER_ROLES.map((item) => {
                    const Icon = roleIcons[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectRole(item.id)}
                        className={cn(
                          "border p-4 text-left hover:border-[#1d70b8]",
                          role === item.id
                            ? "border-[#1d70b8] bg-[#eaf4fb]"
                            : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                        )}
                      >
                        <Icon className="mb-3 size-6 text-[#1d70b8]" />
                        <span className="block text-lg font-bold">{item.label}</span>
                        <span className="mt-2 block text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
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
                <h2 className="text-xl font-bold">Which operational participant are you interested in?</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {operationalParticipants.map((participant) => (
                    <button
                      key={participant.id}
                      type="button"
                      onClick={() => setOperationalParticipantId(participant.id)}
                      className={cn(
                        "border p-4 text-left hover:border-[#1d70b8]",
                        operationalParticipantId === participant.id
                          ? "border-[#1d70b8] bg-[#eaf4fb]"
                          : "border-[#b1b4b6] bg-[#f8f8f8] dark:bg-background",
                      )}
                    >
                      <span className="block text-lg font-bold text-[#1d70b8]">{participant.name}</span>
                      <span className="mt-1 block text-sm font-bold">{participant.type}</span>
                      <span className="mt-2 block text-sm leading-6 text-[#505a5f] dark:text-muted-foreground">
                        {participant.operationalRole}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-[#b1b4b6] pt-5">
              <Button disabled={!canSignIn} onClick={submit}>
                Sign in
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
