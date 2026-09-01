import { Router } from "express";
import { confirmWorkpieceCheck } from "../controllers/workpieceChecks.controller";

export const workpieceChecksRouter = Router();
workpieceChecksRouter.put("/:id/confirm", confirmWorkpieceCheck);
