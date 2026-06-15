import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";

/////////////
// USER TYPE
/////////////

export type AuthenticatedUser = {
  isLoggedIn: boolean;
  email: string | null;
  role: UserRole;
  owningOrganisationId: string | null;
  operationalParticipantId: string | null;
};

export type UserRole = "owning-organisation-admin" | "operational-participant" | "interested-party";

export const USER_ROLES: Array<{ id: UserRole; label: string; description: string }> = [
  {
    id: "owning-organisation-admin",
    label: "Owning organisation",
    description: "Configure case types, roles, workflow, and review",
  },
  {
    id: "operational-participant",
    label: "Operational participant",
    description: "Complete tasks, submit forms, and upload evidence",
  },
  {
    id: "interested-party",
    label: "Interested party",
    description: "Read-only assurance, status, and outcome visibility",
  },
];

export function getUserRoleLabel(role: UserRole) {
  return USER_ROLES.find((item) => item.id === role)?.label ?? "Owning organisation";
}

////////////////////////////////////
// LOGGED IN / LOGGED OUT CONSTANTS
////////////////////////////////////

const LOGGED_IN_USER = {
  isLoggedIn: true,
  email: "demo@example.com",
  role: "owning-organisation-admin" as UserRole,
  owningOrganisationId: null,
  operationalParticipantId: null,
};

const LOGGED_OUT_USER = {
  isLoggedIn: false,
  email: null,
  role: "owning-organisation-admin" as UserRole,
  owningOrganisationId: null,
  operationalParticipantId: null,
};

/////////////
// CONTEXT
/////////////

interface AuthContextData {
  user: AuthenticatedUser;
}
export type SignInSelection = {
  owningOrganisationId: string;
  role: UserRole;
  operationalParticipantId: string | null;
};

interface AuthContextValue extends AuthContextData {
  login: (selection: SignInSelection) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/////////////
// HELPER
/////////////

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within <AuthProvider>");
  return value;
}

////////////////////////
// LOAD / SAVE CONTEXT
////////////////////////

function saveContext(contextData: AuthContextData) {
  localStorage.setItem("user", JSON.stringify(contextData.user));
}

function loadContext(): AuthContextData {
  const storedData = localStorage.getItem("user");

  if (storedData === null) {
    return { user: LOGGED_OUT_USER };
  } else {
    const storedUser = JSON.parse(storedData) as Partial<AuthenticatedUser>;
    const isLoggedIn = Boolean(storedUser.isLoggedIn && storedUser.owningOrganisationId);
    return {
      user: {
        isLoggedIn,
        email: isLoggedIn ? storedUser.email ?? null : null,
        role: storedUser.role ?? "owning-organisation-admin",
        owningOrganisationId: isLoggedIn ? storedUser.owningOrganisationId ?? null : null,
        operationalParticipantId: isLoggedIn ? storedUser.operationalParticipantId ?? null : null,
      },
    };
  }
}

/////////////
// PROVIDER
/////////////

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(loadContext().user);

  useEffect(() => {
    saveContext({ user });
  }, [user]);

  const login = (selection: SignInSelection) =>
    setUser({
      ...LOGGED_IN_USER,
      role: selection.role,
      owningOrganisationId: selection.owningOrganisationId,
      operationalParticipantId:
        selection.role === "owning-organisation-admin" ? null : selection.operationalParticipantId,
    });

  const logout = () => setUser(LOGGED_OUT_USER);

  const sharedData = { user, login, logout };

  return (
    <AuthContext.Provider value={sharedData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
