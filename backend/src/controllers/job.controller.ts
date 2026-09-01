import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { ApiError } from "../errors";

export async function getJob(_req: Request, res: Response, next: NextFunction) {
  try {
    const job = await prisma.job.findFirst();
    if (!job) throw new ApiError(404, "No job scenario loaded.");
    res.json(job);
  } catch (err) {
    next(err);
  }
}
