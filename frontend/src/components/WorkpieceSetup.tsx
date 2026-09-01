import type { LucideIcon } from "lucide-react";
import { Box, Crosshair, FileText, Layers, Lock, MoveHorizontal } from "lucide-react";
import { ChecklistItem } from "./ChecklistItem";
import type { Job, WorkpieceCheck } from "../types/workflow";

const ICONS: Record<string, LucideIcon> = {
  fixture: Box,
  orientation: MoveHorizontal,
  clamped: Lock,
  material: Layers,
  drawing: FileText,
  offset: Crosshair,
};

interface InfoTileProps {
  label: string;
  value: string;
}

function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-0.5 truncate text-base font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

interface WorkpieceSetupProps {
  job: Job;
  checks: WorkpieceCheck[];
  onConfirm: (id: number) => void;
  isPending: (id: number) => boolean;
}

export function WorkpieceSetup({ job, checks, onConfirm, isPending }: WorkpieceSetupProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoTile label="Fixture" value={job.fixture} />
        <InfoTile label="Material" value={job.material} />
        <InfoTile label="Drawing" value={job.drawingRevision} />
        <InfoTile label="Work Offset" value={job.workOffset} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Orientation
          </h3>
          <p className="mt-1 text-sm text-zinc-300 sm:text-base">
            Reference face toward operator side. Locate workpiece against fixture datum.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Clamping
          </h3>
          <p className="mt-1 text-sm text-zinc-300 sm:text-base">
            Secure the workpiece firmly in the fixture. Verify all clamps are properly engaged.
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {checks.map((check) => (
          <ChecklistItem
            key={check.id}
            icon={ICONS[check.key] ?? Box}
            name={check.name}
            description={check.description}
            confirmed={check.confirmed}
            pending={isPending(check.id)}
            onConfirm={() => onConfirm(check.id)}
          />
        ))}
      </ul>
    </div>
  );
}
