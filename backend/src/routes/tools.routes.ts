import { Router } from "express";
import { confirmTool } from "../controllers/tools.controller";

export const toolsRouter = Router();
toolsRouter.put("/:id/confirm", confirmTool);
