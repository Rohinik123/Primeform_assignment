import { Request, Response, NextFunction } from "express";
import { prisma, getFullState, getWorkflowState } from "../db";
import { ApiError } from "../errors";

export async function confirmMachineCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new ApiError(400, "Invalid check id.");

    const check = await prisma.machineCheck.findUnique({ where: { id } });
    if (!check) throw new ApiError(404, "Machine check not found.");

    const state = await getWorkflowState();
    if (state.currentStage !== "MACHINE_CHECKS") {
      throw new ApiError(409, "Machine checks can only be confirmed during the Machine Checks stage.");
    }

    if (!check.confirmed) {
      await prisma.machineCheck.update({ where: { id }, data: { confirmed: true } });
    }

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}
