import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiRequestError } from "../services/api";
import type { StatePayload } from "../types/workflow";

const POLL_INTERVAL_MS = 1000;

type PendingKey =
  | `check-${number}`
  | `tool-${number}`
  | `workpiece-${number}`
  | "next"
  | "start"
  | "stop"
  | "reset";

export function useWorkflow() {
  const [state, setState] = useState<StatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Partial<Record<PendingKey, boolean>>>({});
  const stateRef = useRef<StatePayload | null>(null);
  stateRef.current = state;

  const load = useCallback(async () => {
    try {
      const next = await api.getState();
      setState(next);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.message : "Unable to load machine state.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // While the operation is running, poll so progress and completion reflect server time.
  useEffect(() => {
    if (state?.workflow.operationStatus !== "RUNNING") return;
    const id = window.setInterval(load, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [state?.workflow.operationStatus, load]);

  const run = useCallback(async (key: PendingKey, fn: () => Promise<StatePayload>) => {
    if (stateRef.current === null) return;
    setPending((p) => ({ ...p, [key]: true }));
    setError(null);
    try {
      const next = await fn();
      setState(next);
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setPending((p) => ({ ...p, [key]: false }));
    }
  }, []);

  const isPending = useCallback((key: PendingKey) => Boolean(pending[key]), [pending]);
  const anyPending = Object.values(pending).some(Boolean);

  return {
    state,
    loading,
    error,
    clearError: () => setError(null),
    isPending,
    anyPending,
    confirmMachineCheck: (id: number) => run(`check-${id}`, () => api.confirmMachineCheck(id)),
    confirmTool: (id: number) => run(`tool-${id}`, () => api.confirmTool(id)),
    confirmWorkpieceCheck: (id: number) =>
      run(`workpiece-${id}`, () => api.confirmWorkpieceCheck(id)),
    nextStage: () => run("next", () => api.nextStage()),
    startOperation: () => run("start", () => api.startOperation()),
    stopOperation: () => run("stop", () => api.stopOperation()),
    reset: () => run("reset", () => api.reset()),
  };
}

export type UseWorkflow = ReturnType<typeof useWorkflow>;
