import { Router } from "express";
import { resetWorkflow } from "../controllers/reset.controller";

export const resetRouter = Router();
resetRouter.post("/", resetWorkflow);
