import type { ReactNode } from "react";
import { CheckCircle2, ClipboardCheck, Cog, ShieldCheck } from "lucide-react";
import { NextButton } from "./NextButton";
import type { WorkpieceCheck } from "../types/workflow";

interface SummaryRowProps {
  label: string;
}

function SummaryRow({ label }: SummaryRowProps) {
  return (
    <li className="flex items-center gap-2 text-sm text-zinc-300 sm:text-base">
      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" aria-hidden="true" />
      {label}
    </li>
  );
}

interface SummaryCardProps {
  icon: typeof Cog;
  title: string;
  children: ReactNode;
}

function SummaryCard({ icon: Icon, title, children }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-emerald-400" aria-hidden="true" />
        <h3 className="text-base font-bold text-zinc-100 sm:text-lg">{title}</h3>
      </div>
      <ul className="mt-3 flex flex-col gap-2">{children}</ul>
    </div>
  );
}

interface ReadyReviewProps {
  workpieceChecks: WorkpieceCheck[];
  allComplete: boolean;
  onProceed: () => void;
  pending: boolean;
}

export function ReadyReview({ workpieceChecks, allComplete, onProceed, pending }: ReadyReviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard icon={Cog} title="Machine">
          <SummaryRow label="All machine checks completed" />
        </SummaryCard>
        <SummaryCard icon={ClipboardCheck} title="Tools">
          <SummaryRow label="All required tools loaded" />
        </SummaryCard>
        <SummaryCard icon={ShieldCheck} title="Workpiece">
          {workpieceChecks.map((check) => (
            <SummaryRow key={check.id} label={`${check.name.replace(/ verified$/, "")} confirmed`} />
          ))}
        </SummaryCard>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-700 bg-emerald-950/40 px-6 py-8 text-center">
        <div className="flex items-center gap-3 text-emerald-400">
          <CheckCircle2 size={40} aria-hidden="true" />
          <span className="text-3xl font-extrabold tracking-wide sm:text-4xl">READY</span>
        </div>
        <p className="max-w-md text-sm text-emerald-200/80 sm:text-base">
          All required machine, tooling and workpiece arrangements are complete.
        </p>
      </div>

      <div className="flex justify-center">
        <NextButton
          onClick={onProceed}
          disabled={!allComplete}
          pending={pending}
          label="Proceed to Operation"
          pendingLabel="Proceeding..."
        />
      </div>
    </div>
  );
}
