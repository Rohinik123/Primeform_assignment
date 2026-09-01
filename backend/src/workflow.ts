// The five stages an operator moves through, in order. Kept as a plain array so
// "what's next" is just an index lookup instead of a separate transition table.
export const STAGE_ORDER = ["MACHINE_CHECKS", "TOOLS", "WORKPIECE", "READY", "OPERATION"] as const;
export type Stage = (typeof STAGE_ORDER)[number];

export type OperationStatus = "READY" | "RUNNING" | "STOPPED";

// How long the simulated operation takes to go from 0% to 100%.
export const OPERATION_DURATION_MS = 20_000;

/**
 * Progress is derived from elapsed time rather than ticked by a server-side timer,
 * so it stays correct across a page refresh or a server restart.
 */
export function computeLiveProgress(
  status: OperationStatus,
  startedAt: Date | null,
  storedProgress: number
): { progress: number; completed: boolean } {
  if (status !== "RUNNING" || !startedAt) {
    return { progress: storedProgress, completed: false };
  }
  const elapsed = Date.now() - startedAt.getTime();
  const progress = Math.min(100, Math.floor((elapsed / OPERATION_DURATION_MS) * 100));
  return { progress, completed: progress >= 100 };
}
