import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "./api";

const AuthContext = createContext(null);

function AuthProviderInner({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshSession = useCallback(async () => {
    try {
      const payload = await apiFetch("/api/auth/session");
      setUser(payload?.authenticated ? payload.user : null);
      setError("");
    } catch (sessionError) {
      setUser(null);
      setError(sessionError.message || "Gagal memeriksa sesi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (scope, username, password) => {
    const payload = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { scope, username, password },
    });

    setUser(payload?.user ?? null);
    setError("");
    return payload?.user ?? null;
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout transport errors and clear local auth state anyway.
    }

    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      refreshSession,
      isScopeAuthenticated: (scope) => user?.scope === scope,
    }),
    [error, loading, refreshSession, user],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function AuthProvider({ children }) {
  return createElement(AuthProviderInner, null, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
