import { Router } from "express";
import { getJob } from "../controllers/job.controller";

export const jobRouter = Router();
jobRouter.get("/", getJob);
