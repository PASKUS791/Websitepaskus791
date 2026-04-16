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
import { createApiEventSource } from "../../lib/api";
import {
  cancelStaffTrainingSession,
  createEmptyStaffPortalSnapshot,
  createStaffTrainingSession,
  deleteStaffOperator,
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

    const eventSource = createApiEventSource();

    const handleMessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload?.type === "resource-updated" && payload?.resource === "staffPortal.shared") {
          reload().catch(() => undefined);
        }
      } catch {
        // Ignore malformed SSE payloads.
      }
    };

    eventSource.addEventListener("message", handleMessage);
    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.close();
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
  };
}
