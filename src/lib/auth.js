/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Staff Auth Provider
 * Purpose: Provider auth khusus website staff agar alur login tetap fokus ke portal pelatih.
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
  fetchWalletAuthConfig,
  loginInternalAccount,
  loginStaff,
  logoutInternalSession,
  logoutStaff,
  normalizeStaffUser,
  requestWalletAuthChallenge,
  readStoredStaffSession,
  refreshInternalSession,
  refreshStaffSession,
  verifyWalletAuthLogin,
} from "./staffApi";

const AuthContext = createContext(null);

function AuthProviderInner({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshSession = useCallback(async () => {
    try {
      const session = await refreshStaffSession();
      const nextUser = session?.user || normalizeStaffUser(readStoredStaffSession()?.user);
      setUser(nextUser);
      setError("");
      return;
    } catch {
      clearStoredStaffSession();
    }

    try {
      const internalUser = await refreshInternalSession();
      const nextUser = internalUser?.scope === "admin" ? internalUser : null;
      setUser(nextUser);
      setError("");
    } catch {
      setUser(null);
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
      let nextUser = null;

      if (scope === "admin") {
        clearStoredStaffSession();
        nextUser = await loginInternalAccount(scope, username, password);
      } else {
        nextUser = (await loginStaff(username, password))?.user ?? null;
      }

      setUser(nextUser);
      setError("");
      return nextUser;
    },
    [setError, setUser],
  );

  const logout = useCallback(async () => {
    try {
      if (user?.scope === "admin") {
        await logoutInternalSession();
      } else {
        await logoutStaff();
      }
    } catch {
      clearStoredStaffSession();
      try {
        await logoutInternalSession();
      } catch {
        // Ignore logout cleanup failures from the internal API.
      }
    }

    setUser(null);
  }, [user?.scope]);

  const loginWithWallet = useCallback(
    async ({
      scope = "admin",
      username,
      password,
      address,
      chainId,
      signMessage,
    }) => {
      const walletConfig = await fetchWalletAuthConfig(scope);

      if (!walletConfig.enabled) {
        throw new Error("Wallet auth belum aktif untuk scope ini.");
      }

      if (typeof signMessage !== "function") {
        throw new Error("Provider wallet belum siap untuk proses signature.");
      }

      const challenge = await requestWalletAuthChallenge({
        scope,
        username,
        address,
        chainId,
      });

      if (!challenge?.message || !challenge?.nonce) {
        throw new Error("Challenge wallet tidak valid.");
      }

      const signature = await signMessage(challenge.message);
      const nextUser = await verifyWalletAuthLogin({
        scope,
        username,
        password,
        address,
        nonce: challenge.nonce,
        signature,
      });

      setUser(nextUser);
      setError("");
      return nextUser;
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      loginWithWallet,
      logout,
      refreshSession,
      isScopeAuthenticated: (scope) => user?.scope === scope,
    }),
    [error, loading, login, loginWithWallet, logout, refreshSession, user],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function AuthProvider({ children }) {
  return createElement(AuthProviderInner, null, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside StaffAuthProvider.");
  }

  return context;
}
