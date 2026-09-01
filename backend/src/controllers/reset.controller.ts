import { Request, Response, NextFunction } from "express";
import { prisma, getFullState, getWorkflowState } from "../db";

/** Resets confirmations and the workflow stage back to the start of the demo. Job data is untouched. */
export async function resetWorkflow(_req: Request, res: Response, next: NextFunction) {
  try {
    const state = await getWorkflowState();

    await prisma.$transaction([
      prisma.machineCheck.updateMany({ data: { confirmed: false } }),
      prisma.tool.updateMany({ data: { confirmed: false } }),
      prisma.workpieceCheck.updateMany({ data: { confirmed: false } }),
      prisma.workflowState.update({
        where: { id: state.id },
        data: {
          currentStage: "MACHINE_CHECKS",
          operationStatus: "READY",
          progress: 0,
          operationStartedAt: null,
        },
      }),
    ]);

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}
