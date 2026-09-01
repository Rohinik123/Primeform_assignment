import { Router } from "express";
import { goToNextStage } from "../controllers/state.controller";

export const stageRouter = Router();
stageRouter.post("/next", goToNextStage);
