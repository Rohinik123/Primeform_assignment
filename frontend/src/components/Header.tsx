import { Factory } from "lucide-react";
import { StatusBadge, type BadgeTone } from "./StatusBadge";
import type { Job, OperationStatus } from "../types/workflow";

const STATUS_TONE: Record<OperationStatus, BadgeTone> = {
  READY: "info",
  RUNNING: "success",
  STOPPED: "danger",
};

interface HeaderProps {
  job: Job;
  operationStatus: OperationStatus;
}

export function Header({ job, operationStatus }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-amber-400">
            <Factory size={24} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 sm:text-xl">
              Machine: VMC-01
            </h1>
            <p className="truncate text-sm text-zinc-400">Operation: {job.operationName}</p>
          </div>
        </div>
        <StatusBadge label={operationStatus} tone={STATUS_TONE[operationStatus]} size="lg" />
      </div>
    </header>
  );
}
