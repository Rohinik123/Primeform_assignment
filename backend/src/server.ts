import "dotenv/config";
import express from "express";
import cors from "cors";
import { jobRouter } from "./routes/job.routes";
import { stateRouter } from "./routes/state.routes";
import { stageRouter } from "./routes/stage.routes";
import { machineChecksRouter } from "./routes/machineChecks.routes";
import { toolsRouter } from "./routes/tools.routes";
import { workpieceChecksRouter } from "./routes/workpieceChecks.routes";
import { operationRouter } from "./routes/operation.routes";
import { resetRouter } from "./routes/reset.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/job", jobRouter);
app.use("/api/state", stateRouter);
app.use("/api/stage", stageRouter);
app.use("/api/machine-checks", machineChecksRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/workpiece-checks", workpieceChecksRouter);
app.use("/api/operation", operationRouter);
app.use("/api/reset", resetRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`VMC HMI backend listening on port ${PORT}`);
});
