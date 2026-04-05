/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 */

import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearStoredStaffSession,
  loginStaff,
  logoutStaff,
  normalizeStaffUser,
  readStoredStaffSession,
  refreshStaffSession,
} from "./staffApi";
import {
  clearStoredHcoSession,
  loginHco,
  logoutHco,
  readStoredHcoSession,
  refreshHcoSession,
} from "./hcoApi";

const AuthContext = createContext(null);

function AuthProviderInner({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshSession = useCallback(async () => {
    try {
      const storedHcoSession = readStoredHcoSession();
      const hcoSession = await refreshHcoSession();

      if (hcoSession?.user?.scope === "hco") {
        setUser(hcoSession.user);
        setError("");
        setLoading(false);
        return;
      }

      if (storedHcoSession?.user?.scope === "hco") {
        setUser(null);
        setError("");
        setLoading(false);
        return;
      }
    } catch {
      // Lanjut cek sesi staff jika sesi HCO tidak tersedia.
    }

    try {
      const session = await refreshStaffSession();
      const nextUser =
        session?.user ||
        normalizeStaffUser(readStoredStaffSession()?.user);
      setUser(nextUser);
      setError("");
    } catch {
      setUser(null);
      clearStoredStaffSession();
      setError("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    async (scope, username, password) => {
      if (scope === "hco") {
        const session = await loginHco(username, password);
        const nextUser = session?.user || null;
        setUser(nextUser);
        setError("");
        return nextUser;
      }

      const session = await loginStaff(username, password);
      const nextUser = session?.user ?? null;
      clearStoredHcoSession();
      setUser(nextUser);
      setError("");
      return nextUser;
    },
    [setError, setUser],
  );

  const logout = useCallback(async () => {
    if (user?.scope === "pelatih") {
      try {
        await logoutStaff();
      } catch {
        clearStoredStaffSession();
      }
    } else if (user?.scope === "hco") {
      await logoutHco();
    }

    setUser(null);
  }, [user]);

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
    [error, loading, login, logout, refreshSession, user],
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
