import { Request, Response, NextFunction } from "express";
import { prisma, getFullState, getWorkflowState } from "../db";
import { ApiError } from "../errors";
import { STAGE_ORDER, Stage } from "../workflow";

export async function getState(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}

const INCOMPLETE_STAGE_MESSAGE: Partial<Record<Stage, string>> = {
  MACHINE_CHECKS: "Please complete all machine checks before continuing.",
  TOOLS: "Please confirm all required tools before continuing.",
  WORKPIECE: "Please complete workpiece setup before proceeding.",
  READY: "Operation cannot be started until setup is complete.",
};

/** Whether everything required by a given stage has been confirmed. Reused by the operation start check. */
export async function isStageComplete(stage: Stage): Promise<boolean> {
  if (stage === "MACHINE_CHECKS") {
    return (await prisma.machineCheck.count({ where: { confirmed: false } })) === 0;
  }
  if (stage === "TOOLS") {
    return (await prisma.tool.count({ where: { confirmed: false } })) === 0;
  }
  if (stage === "WORKPIECE") {
    return (await prisma.workpieceCheck.count({ where: { confirmed: false } })) === 0;
  }
  if (stage === "READY") {
    const [machine, tools, workpiece] = await Promise.all([
      prisma.machineCheck.count({ where: { confirmed: false } }),
      prisma.tool.count({ where: { confirmed: false } }),
      prisma.workpieceCheck.count({ where: { confirmed: false } }),
    ]);
    return machine === 0 && tools === 0 && workpiece === 0;
  }
  return true;
}

/** Advances to the next stage in sequence. Rejects if the current stage isn't complete yet. */
export async function goToNextStage(_req: Request, res: Response, next: NextFunction) {
  try {
    const state = await getWorkflowState();
    const currentStage = state.currentStage as Stage;
    const currentIndex = STAGE_ORDER.indexOf(currentStage);

    if (currentIndex === STAGE_ORDER.length - 1) {
      throw new ApiError(409, "Already at the final stage.");
    }

    if (!(await isStageComplete(currentStage))) {
      throw new ApiError(409, INCOMPLETE_STAGE_MESSAGE[currentStage] ?? "Complete this stage before continuing.");
    }

    const nextStage = STAGE_ORDER[currentIndex + 1];
    await prisma.workflowState.update({
      where: { id: state.id },
      data: {
        currentStage: nextStage,
        // Entering the operation stage always starts from a clean READY/0% state.
        ...(nextStage === "OPERATION"
          ? { operationStatus: "READY", progress: 0, operationStartedAt: null }
          : {}),
      },
    });

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}
