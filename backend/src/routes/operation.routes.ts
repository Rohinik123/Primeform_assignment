import { Router } from "express";
import { startOperation, stopOperation, restartOperation } from "../controllers/operation.controller";

export const operationRouter = Router();
operationRouter.post("/start", startOperation);
operationRouter.post("/stop", stopOperation);
operationRouter.post("/restart", restartOperation);
