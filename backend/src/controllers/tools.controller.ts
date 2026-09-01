import { Request, Response, NextFunction } from "express";
import { prisma, getFullState, getWorkflowState } from "../db";
import { ApiError } from "../errors";

export async function confirmTool(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new ApiError(400, "Invalid tool id.");

    const tool = await prisma.tool.findUnique({ where: { id } });
    if (!tool) throw new ApiError(404, "Tool not found.");

    const state = await getWorkflowState();
    if (state.currentStage !== "TOOLS") {
      throw new ApiError(409, "Tools can only be confirmed during the Tools stage.");
    }

    if (!tool.confirmed) {
      await prisma.tool.update({ where: { id }, data: { confirmed: true } });
    }

    res.json(await getFullState());
  } catch (err) {
    next(err);
  }
}
