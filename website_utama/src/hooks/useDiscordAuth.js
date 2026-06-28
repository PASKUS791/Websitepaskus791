import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage Discord OAuth session status.
 * simple fetch-based OAuth session state
 */
export function useDiscordAuth() {
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    user: null,
  });

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/discord-auth.php?action=status", {
        credentials: "same-origin",
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data && data.ok) {
        setAuthState({
          loading: false,
          authenticated: Boolean(data.authenticated),
          user: data.user || null,
        });
      } else {
        setAuthState({ loading: false, authenticated: false, user: null });
      }
    } catch (error) {
      console.warn("Failed checking Discord auth status:", error);
      setAuthState({ loading: false, authenticated: false, user: null });
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = useCallback(() => {
    // Save current pathname to return after auth
    const returnPath = window.location.pathname + window.location.search;
    window.location.href = `/api/discord-auth.php?action=login&return=${encodeURIComponent(returnPath)}`;
  }, []);

  const reset = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/discord-auth.php?action=reset-discord", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "user_triggered" }),
      });
      const data = response.ok ? await response.json().catch(() => null) : null;
      if (data && data.ok) {
        setAuthState({ loading: false, authenticated: false, user: null });
        return true;
      }
    } catch (error) {
      console.warn("Failed to reset Discord sync:", error);
    }
    setAuthState((prev) => ({ ...prev, loading: false }));
    return false;
  }, []);

  return {
    ...authState,
    login,
    reset,
    refetch: checkStatus,
  };
}
