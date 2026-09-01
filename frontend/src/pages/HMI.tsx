import { Loader2, RefreshCw } from "lucide-react";
import { useWorkflow } from "../hooks/useWorkflow";
import { Header } from "../components/Header";
import { ProgressSteps } from "../components/ProgressSteps";
import { StageContainer } from "../components/StageContainer";
import { Checklist } from "../components/Checklist";
import { ToolList } from "../components/ToolList";
import { WorkpieceSetup } from "../components/WorkpieceSetup";
import { ReadyReview } from "../components/ReadyReview";
import { OperationPanel } from "../components/OperationPanel";
import { NextButton } from "../components/NextButton";
import { ErrorBanner } from "../components/ErrorBanner";
import { STAGE_ORDER, type Stage } from "../types/workflow";

const STAGE_META: Record<Stage, { title: string; instruction: string }> = {
  MACHINE_CHECKS: {
    title: "Machine Checks",
    instruction: "Confirm each safety and readiness check before continuing.",
  },
  TOOLS: {
    title: "Required Tools",
    instruction: "Insert and confirm every tool required for this program.",
  },
  WORKPIECE: {
    title: "Workpiece Setup",
    instruction: "Secure the workpiece and confirm each setup item.",
  },
  READY: {
    title: "Ready Review",
    instruction: "Final readiness review before starting the operation.",
  },
  OPERATION: {
    title: "Operation",
    instruction: "Start the operation and monitor progress.",
  },
};

export function HMI() {
  const workflow = useWorkflow();
  const { state, loading, error, clearError } = workflow;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-amber-400" aria-hidden="true" />
          <p className="text-lg">Connecting to VMC-01...</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-300">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <p className="text-lg text-red-300">{error ?? "Unable to load machine state."}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500 bg-amber-500 px-5 py-3 font-bold text-zinc-950 hover:bg-amber-400"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { job, machineChecks, tools, workpieceChecks, workflow: wf } = state;
  const stage = wf.currentStage;
  const meta = STAGE_META[stage];
  const currentIndex = STAGE_ORDER.indexOf(stage);

  const allMachineChecksConfirmed = machineChecks.every((c) => c.confirmed);
  const allToolsConfirmed = tools.every((t) => t.confirmed);
  const allWorkpieceConfirmed = workpieceChecks.every((c) => c.confirmed);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header job={job} operationStatus={wf.operationStatus} />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <ProgressSteps currentStage={stage} />
        </div>

        <StageContainer title={meta.title} instruction={meta.instruction}>
          {stage === "MACHINE_CHECKS" && (
            <Checklist
              checks={machineChecks}
              onConfirm={workflow.confirmMachineCheck}
              isPending={(id) => workflow.isPending(`check-${id}`)}
            />
          )}
          {stage === "TOOLS" && (
            <ToolList
              tools={tools}
              onConfirm={workflow.confirmTool}
              isPending={(id) => workflow.isPending(`tool-${id}`)}
            />
          )}
          {stage === "WORKPIECE" && (
            <WorkpieceSetup
              job={job}
              checks={workpieceChecks}
              onConfirm={workflow.confirmWorkpieceCheck}
              isPending={(id) => workflow.isPending(`workpiece-${id}`)}
            />
          )}
          {stage === "READY" && (
            <ReadyReview
              workpieceChecks={workpieceChecks}
              allComplete={allMachineChecksConfirmed && allToolsConfirmed && allWorkpieceConfirmed}
              onProceed={workflow.nextStage}
              pending={workflow.isPending("next")}
            />
          )}
          {stage === "OPERATION" && (
            <OperationPanel
              job={job}
              operationStatus={wf.operationStatus}
              progress={wf.progress}
              onStart={workflow.startOperation}
              onStop={workflow.stopOperation}
              startPending={workflow.isPending("start")}
              stopPending={workflow.isPending("stop")}
            />
          )}

          {(stage === "MACHINE_CHECKS" || stage === "TOOLS" || stage === "WORKPIECE") && (
            <div className="mt-6 flex justify-center border-t border-zinc-800 pt-6">
              <NextButton
                onClick={workflow.nextStage}
                disabled={
                  stage === "MACHINE_CHECKS"
                    ? !allMachineChecksConfirmed
                    : stage === "TOOLS"
                      ? !allToolsConfirmed
                      : !allWorkpieceConfirmed
                }
                pending={workflow.isPending("next")}
              />
            </div>
          )}
        </StageContainer>
      </div>

      <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-zinc-500 sm:px-6">
        Progress: {currentIndex + 1} / {STAGE_ORDER.length}
      </footer>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}
    </div>
  );
}
