/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * Module: Dashboard / Staff Portal Hook
 * Purpose: Hook tunggal untuk memuat snapshot portal pelatih dari backend baru.
 */

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import {
  cancelStaffTrainingSession,
  createEmptyStaffPortalSnapshot,
  createStaffTrainingSession,
  deleteStaffOperator,
  deleteAllStaffOperators,
  dispatchStaffTrainingSession,
  eliminateStaffCandidate,
  fetchStaffPortalSnapshot,
  registerStaffOperator,
  saveStaffRecruitmentReport,
  updateStaffOperatorMetadata,
} from "../data/staffPortalBackend";

export function useStaffPortalData({ enabled = true } = {}) {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState(createEmptyStaffPortalSnapshot);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!enabled) {
      setSnapshot(createEmptyStaffPortalSnapshot());
      setLoading(false);
      setError("");
      return createEmptyStaffPortalSnapshot();
    }

    try {
      setLoading(true);
      const nextSnapshot = await fetchStaffPortalSnapshot(user);
      setSnapshot(nextSnapshot);
      setError("");
      return nextSnapshot;
    } catch (loadError) {
      setError(loadError.message || "Gagal memuat data portal pelatih.");
      throw loadError;
    } finally {
      setLoading(false);
    }
  }, [enabled, user]);

  useEffect(() => {
    reload().catch(() => undefined);
  }, [reload]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      reload().catch(() => undefined);
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, [enabled, reload]);

  const runMutation = useCallback(
    async (mutation) => {
      const nextSnapshot = await mutation();
      if (
        nextSnapshot &&
        typeof nextSnapshot === "object" &&
        "candidates" in nextSnapshot &&
        "trainingSessions" in nextSnapshot &&
        "reports" in nextSnapshot
      ) {
        setSnapshot(nextSnapshot);
        setError("");
        return nextSnapshot;
      }

      return reload();
    },
    [reload],
  );

  return {
    ...snapshot,
    loading,
    error,
    reload,
    createTrainingSession: async (payload) => {
      const result = await createStaffTrainingSession({
        ...payload,
        currentUser: user,
      });

      if (result?.snapshot) {
        setSnapshot(result.snapshot);
        setError("");
      } else {
        await reload();
      }

      return result;
    },
    saveRecruitmentReport: (report, options = {}) =>
      runMutation(() => saveStaffRecruitmentReport(report, user, options)),
    dispatchTrainingSession: (sessionId, reports, options = {}) =>
      runMutation(() => dispatchStaffTrainingSession(sessionId, reports, user, options)),
    cancelTrainingSession: (sessionId) =>
      runMutation(() => cancelStaffTrainingSession(sessionId, user)),
    eliminateCandidate: (report) =>
      runMutation(() => eliminateStaffCandidate(report, user)),
    registerOperator: async (formState) => {
      await registerStaffOperator(formState, user);
      return reload();
    },
    updateOperatorMetadata: async (payload) => {
      await updateStaffOperatorMetadata(payload, user);
      return reload();
    },
    deleteOperator: async (payload) => {
      await deleteStaffOperator(payload, user);
      return reload();
    },
    deleteAllOperators: async () => {
      const result = await deleteAllStaffOperators(user);
      await reload();
      return result;
    },
  };
}
