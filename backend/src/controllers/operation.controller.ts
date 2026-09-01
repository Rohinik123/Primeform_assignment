import { Request, Response, NextFunction } from "express";
import { prisma, getFullState, getLiveWorkflowState } from "../db";
import { ApiError } from "../errors";
import { isStageComplete } from "./state.controller";

export async function startOperation(_req: Request, res: Response, next: NextFunction) {
  try {
    const state = await getLiveWorkflowState();

    if (state.currentStage !== "OPERATION") {
      throw new ApiError(409, "Operation cannot be started until setup is complete.");
    }
    if (state.operationStatus === "RUNNING") {
      throw new ApiError(409, "Operation is already running.");
    }
    // Defense in depth: don't just trust the stage flag, re-check the requirements.
    if (!(await isStageComplete("READY"))) {
      throw new ApiError(409, "Operation cannot be started until setup is complete.");
    }

    await prisma.workflowState.update({
      where: { id: state.id },
      data: { operationStatus: "RUNNING", progress: 0, operationStartedAt: new Date() },
    });

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}

export async function stopOperation(_req: Request, res: Response, next: NextFunction) {
  try {
    const state = await getLiveWorkflowState();

    if (state.currentStage !== "OPERATION" || state.operationStatus !== "RUNNING") {
      throw new ApiError(409, "Operation is not running.");
    }

    await prisma.workflowState.update({
      where: { id: state.id },
      data: { operationStatus: "STOPPED", operationStartedAt: null },
    });

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}

/**
 * Resets a stopped operation back to READY at 0% so it can be started again.
 * Unlike /api/reset, this only touches the operation status/progress — machine checks,
 * tools, workpiece confirmations, and the current stage are left untouched.
 */
export async function restartOperation(_req: Request, res: Response, next: NextFunction) {
  try {
    const state = await getLiveWorkflowState();

    if (state.currentStage !== "OPERATION" || state.operationStatus !== "STOPPED") {
      throw new ApiError(409, "Operation must be stopped before it can be restarted.");
    }

    await prisma.workflowState.update({
      where: { id: state.id },
      data: { operationStatus: "READY", progress: 0, operationStartedAt: null },
    });

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}
