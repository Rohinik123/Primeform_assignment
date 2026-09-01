import { Check } from "lucide-react";
import { STAGE_LABEL, STAGE_ORDER, type Stage } from "../types/workflow";

interface ProgressStepsProps {
  currentStage: Stage;
}

export function ProgressSteps({ currentStage }: ProgressStepsProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <nav aria-label="Workflow progress" className="w-full">
      <ol className="flex items-center justify-between gap-0.5 sm:gap-2">
        {STAGE_ORDER.map((stage, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={stage} className="flex flex-1 items-center gap-0.5 last:flex-initial sm:gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold sm:h-10 sm:w-10 sm:text-sm ${
                    isComplete
                      ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                      : isCurrent
                        ? "border-amber-400 bg-amber-400/10 text-amber-400"
                        : "border-zinc-700 bg-zinc-900 text-zinc-500"
                  }`}
                >
                  {isComplete ? <Check size={16} aria-hidden="true" /> : index + 1}
                </div>
                <span
                  className={`whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${
                    isCurrent ? "block text-amber-400" : "hidden sm:block"
                  } ${isComplete ? "text-emerald-400" : "text-zinc-500"}`}
                >
                  {STAGE_LABEL[stage]}
                </span>
              </div>
              {index < STAGE_ORDER.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`h-0.5 w-full shrink min-w-2 sm:w-full ${
                    isComplete ? "bg-emerald-600" : "bg-zinc-700"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
