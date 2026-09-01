import { useState } from "react";
import { Loader2, Play, RotateCcw, Square } from "lucide-react";
import { StatusBadge, type BadgeTone } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import type { Job, OperationStatus } from "../types/workflow";

const STATUS_TONE: Record<OperationStatus, BadgeTone> = {
  READY: "info",
  RUNNING: "success",
  STOPPED: "danger",
};

interface DetailProps {
  label: string;
  value: string;
}

function Detail({ label, value }: DetailProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

interface OperationPanelProps {
  job: Job;
  operationStatus: OperationStatus;
  progress: number;
  onStart: () => void;
  onStop: () => void;
  onRestartOperation: () => void;
  onRestartSetup: () => void;
  startPending: boolean;
  stopPending: boolean;
  restartOperationPending: boolean;
  restartSetupPending: boolean;
}

export function OperationPanel({
  job,
  operationStatus,
  progress,
  onStart,
  onStop,
  onRestartOperation,
  onRestartSetup,
  startPending,
  stopPending,
  restartOperationPending,
  restartSetupPending,
}: OperationPanelProps) {
  const [confirmingRestartSetup, setConfirmingRestartSetup] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:grid-cols-3 sm:p-6">
        <Detail label="Operation" value={job.operationName} />
        <Detail label="Program" value={job.cncProgram} />
        <Detail label="Program Revision" value={job.programRevision} />
        <Detail label="Machine" value="VMC-01" />
        <Detail label="Work Offset" value={job.workOffset} />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</div>
          <StatusBadge label={operationStatus} tone={STATUS_TONE[operationStatus]} className="mt-1.5" />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Operation Progress
          </span>
          <span className="font-mono text-lg font-bold text-zinc-100">{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Operation progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-5 w-full overflow-hidden rounded-full border border-zinc-700 bg-zinc-900"
        >
          <div
            className={`h-full rounded-full bg-emerald-500 transition-[width] duration-500 ease-linear ${
              operationStatus === "RUNNING" ? "animate-pulse-slow" : ""
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {operationStatus === "RUNNING" ? (
          <button
            type="button"
            onClick={onStop}
            disabled={stopPending}
            aria-busy={stopPending}
            className="inline-flex w-full min-w-[14rem] items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-red-500 active:bg-red-700 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 sm:w-auto"
          >
            {stopPending ? (
              <Loader2 size={22} className="animate-spin" aria-hidden="true" />
            ) : (
              <Square size={22} aria-hidden="true" fill="currentColor" />
            )}
            {stopPending ? "Stopping..." : "STOP OPERATION"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={operationStatus === "STOPPED" ? onRestartOperation : onStart}
              disabled={startPending || restartOperationPending}
              aria-busy={startPending || restartOperationPending}
              className="inline-flex w-full min-w-[14rem] items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-8 py-4 text-lg font-bold text-zinc-950 transition-colors hover:bg-emerald-400 active:bg-emerald-600 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 sm:w-auto"
            >
              {operationStatus === "STOPPED" ? (
                restartOperationPending ? (
                  <Loader2 size={22} className="animate-spin" aria-hidden="true" />
                ) : (
                  <RotateCcw size={22} aria-hidden="true" />
                )
              ) : startPending ? (
                <Loader2 size={22} className="animate-spin" aria-hidden="true" />
              ) : (
                <Play size={22} aria-hidden="true" fill="currentColor" />
              )}
              {operationStatus === "STOPPED"
                ? restartOperationPending
                  ? "Restarting..."
                  : "RESTART OPERATION"
                : startPending
                  ? "Starting..."
                  : "START OPERATION"}
            </button>

            <button
              type="button"
              onClick={() => setConfirmingRestartSetup(true)}
              className="w-full rounded-xl border border-zinc-700 px-6 py-4 text-base font-semibold text-zinc-400 transition-colors hover:border-red-800 hover:text-red-400 sm:w-auto"
            >
              RESTART SETUP
            </button>
          </>
        )}
      </div>

      {confirmingRestartSetup && (
        <ConfirmDialog
          title="Restart Setup?"
          message="This will clear the completed machine, tool and workpiece checks and return you to Machine Checks."
          confirmLabel="RESTART SETUP"
          pendingLabel="Restarting..."
          pending={restartSetupPending}
          onCancel={() => setConfirmingRestartSetup(false)}
          onConfirm={onRestartSetup}
        />
      )}
    </div>
  );
}
