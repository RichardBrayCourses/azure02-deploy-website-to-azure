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
  group: UserGroup;
};

export type UserGroup = "association" | "provider" | "interested-party";

export const USER_GROUPS: Array<{ id: UserGroup; label: string; description: string }> = [
  {
    id: "association",
    label: "Association",
    description: "Administration and cross-company review",
  },
  {
    id: "provider",
    label: "IT platform provider",
    description: "Case completion for one platform company",
  },
  {
    id: "interested-party",
    label: "Platform provider interested party",
    description: "Read-only supplier verification status",
  },
];

export function getUserGroupLabel(group: UserGroup) {
  return USER_GROUPS.find((item) => item.id === group)?.label ?? "Association";
}

////////////////////////////////////
// LOGGED IN / LOGGED OUT CONSTANTS
////////////////////////////////////

const LOGGED_IN_USER = {
  isLoggedIn: true,
  email: "demo@example.com",
  group: "association" as UserGroup,
};

const LOGGED_OUT_USER = {
  isLoggedIn: false,
  email: null,
  group: "association" as UserGroup,
};

/////////////
// CONTEXT
/////////////

interface AuthContextData {
  user: AuthenticatedUser;
}
interface AuthContextValue extends AuthContextData {
  login: () => void;
  logout: () => void;
  setUserGroup: (group: UserGroup) => void;
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
    return {
      user: {
        isLoggedIn: storedUser.isLoggedIn ?? false,
        email: storedUser.email ?? null,
        group: storedUser.group ?? "association",
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

  const login = () => setUser((current) => ({ ...LOGGED_IN_USER, group: current.group }));
  const logout = () => setUser((current) => ({ ...LOGGED_OUT_USER, group: current.group }));
  const setUserGroup = (group: UserGroup) =>
    setUser((current) => ({
      ...current,
      group,
    }));

  const sharedData = { user, login, logout, setUserGroup };

  return (
    <AuthContext.Provider value={sharedData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
