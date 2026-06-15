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
  authenticatableUserId: string | null;
  name: string | null;
  email: string | null;
  role: UserRole;
  umbrellaOrganizationId: string | null;
  operationalParticipantId: string | null;
};

export type UserRole = "umbrella-organization-admin" | "operational-participant" | "interested-party";
type StoredUserRole = UserRole | "owning-organisation-admin";
type StoredUser = Partial<Omit<AuthenticatedUser, "role">> & {
  role?: StoredUserRole;
  owningOrganisationId?: string | null;
};

export const USER_ROLES: Array<{ id: UserRole; label: string; description: string }> = [
  {
    id: "umbrella-organization-admin",
    label: "Umbrella organization",
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
  return USER_ROLES.find((item) => item.id === role)?.label ?? "Umbrella organization";
}

////////////////////////////////////
// LOGGED IN / LOGGED OUT CONSTANTS
////////////////////////////////////

const LOGGED_IN_USER = {
  isLoggedIn: true,
  authenticatableUserId: null,
  name: null,
  email: null,
  role: "umbrella-organization-admin" as UserRole,
  umbrellaOrganizationId: null,
  operationalParticipantId: null,
};

const LOGGED_OUT_USER = {
  isLoggedIn: false,
  authenticatableUserId: null,
  name: null,
  email: null,
  role: "umbrella-organization-admin" as UserRole,
  umbrellaOrganizationId: null,
  operationalParticipantId: null,
};

/////////////
// CONTEXT
/////////////

interface AuthContextData {
  user: AuthenticatedUser;
}
export type SignInSelection = {
  authenticatableUserId: string;
  name: string;
  email: string;
  umbrellaOrganizationId: string;
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

function normalizeRole(role: StoredUserRole | undefined): UserRole {
  if (role === "owning-organisation-admin") return "umbrella-organization-admin";
  return role ?? "umbrella-organization-admin";
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
    const storedUser = JSON.parse(storedData) as StoredUser;
    const umbrellaOrganizationId = storedUser.umbrellaOrganizationId ?? storedUser.owningOrganisationId ?? null;
    const isLoggedIn = Boolean(storedUser.isLoggedIn && umbrellaOrganizationId && storedUser.authenticatableUserId);
    return {
      user: {
        isLoggedIn,
        authenticatableUserId: isLoggedIn ? storedUser.authenticatableUserId ?? null : null,
        name: isLoggedIn ? storedUser.name ?? null : null,
        email: isLoggedIn ? storedUser.email ?? null : null,
        role: normalizeRole(storedUser.role),
        umbrellaOrganizationId: isLoggedIn ? umbrellaOrganizationId : null,
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
      authenticatableUserId: selection.authenticatableUserId,
      name: selection.name,
      email: selection.email,
      role: selection.role,
      umbrellaOrganizationId: selection.umbrellaOrganizationId,
      operationalParticipantId:
        selection.role === "umbrella-organization-admin" ? null : selection.operationalParticipantId,
    });

  const logout = () => setUser(LOGGED_OUT_USER);

  const sharedData = { user, login, logout };

  return (
    <AuthContext.Provider value={sharedData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
