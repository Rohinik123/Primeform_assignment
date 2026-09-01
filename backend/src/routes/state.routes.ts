import { Router } from "express";
import { getState } from "../controllers/state.controller";

export const stateRouter = Router();
stateRouter.get("/", getState);
