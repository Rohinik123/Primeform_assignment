import { Router } from "express";
import { startOperation, stopOperation } from "../controllers/operation.controller";

export const operationRouter = Router();
operationRouter.post("/start", startOperation);
operationRouter.post("/stop", stopOperation);
