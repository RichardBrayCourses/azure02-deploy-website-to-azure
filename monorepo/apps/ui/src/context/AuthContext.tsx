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
  authorityId: string | null;
  participantId: string | null;
};

export type UserRole = "authority-admin" | "participant" | "stakeholder";
type StoredUserRole = UserRole | "authority-admin";
type StoredUser = Partial<Omit<AuthenticatedUser, "role">> & {
  role?: StoredUserRole;
  authorityId?: string | null;
};

export const USER_ROLES: Array<{ id: UserRole; label: string; description: string }> = [
  {
    id: "authority-admin",
    label: "Authority",
    description: "Configure case types, roles, workflow, and review",
  },
  {
    id: "participant",
    label: "Participant",
    description: "Complete tasks, submit forms, and upload evidence",
  },
  {
    id: "stakeholder",
    label: "Stakeholder",
    description: "Read-only assurance, status, and outcome visibility",
  },
];

export function getUserRoleLabel(role: UserRole) {
  return USER_ROLES.find((item) => item.id === role)?.label ?? "Authority";
}

////////////////////////////////////
// LOGGED IN / LOGGED OUT CONSTANTS
////////////////////////////////////

const LOGGED_IN_USER = {
  isLoggedIn: true,
  authenticatableUserId: null,
  name: null,
  email: null,
  role: "authority-admin" as UserRole,
  authorityId: null,
  participantId: null,
};

const LOGGED_OUT_USER = {
  isLoggedIn: false,
  authenticatableUserId: null,
  name: null,
  email: null,
  role: "authority-admin" as UserRole,
  authorityId: null,
  participantId: null,
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
  authorityId: string;
  role: UserRole;
  participantId: string | null;
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
  if (role === "authority-admin") return "authority-admin";
  return role ?? "authority-admin";
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
    const authorityId = storedUser.authorityId ?? storedUser.authorityId ?? null;
    const isLoggedIn = Boolean(storedUser.isLoggedIn && authorityId && storedUser.authenticatableUserId);
    return {
      user: {
        isLoggedIn,
        authenticatableUserId: isLoggedIn ? storedUser.authenticatableUserId ?? null : null,
        name: isLoggedIn ? storedUser.name ?? null : null,
        email: isLoggedIn ? storedUser.email ?? null : null,
        role: normalizeRole(storedUser.role),
        authorityId: isLoggedIn ? authorityId : null,
        participantId: isLoggedIn ? storedUser.participantId ?? null : null,
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
      authorityId: selection.authorityId,
      participantId:
        selection.role === "authority-admin" ? null : selection.participantId,
    });

  const logout = () => setUser(LOGGED_OUT_USER);

  const sharedData = { user, login, logout };

  return (
    <AuthContext.Provider value={sharedData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
