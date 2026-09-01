import { Request, Response, NextFunction } from "express";
import { prisma, getFullState, getWorkflowState } from "../db";
import { ApiError } from "../errors";

export async function confirmWorkpieceCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new ApiError(400, "Invalid workpiece check id.");

    const item = await prisma.workpieceCheck.findUnique({ where: { id } });
    if (!item) throw new ApiError(404, "Workpiece check not found.");

    const state = await getWorkflowState();
    if (state.currentStage !== "WORKPIECE") {
      throw new ApiError(409, "Workpiece setup can only be confirmed during the Workpiece stage.");
    }

    if (!item.confirmed) {
      await prisma.workpieceCheck.update({ where: { id }, data: { confirmed: true } });
    }

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}
