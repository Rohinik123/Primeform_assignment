import { Router } from "express";
import { confirmMachineCheck } from "../controllers/machineChecks.controller";

export const machineChecksRouter = Router();
machineChecksRouter.put("/:id/confirm", confirmMachineCheck);
