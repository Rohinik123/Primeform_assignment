import { PrismaClient } from "@prisma/client";
import { computeLiveProgress, OperationStatus } from "./workflow";

export const prisma = new PrismaClient();

/** There's only ever one workflow state row — this is the whole "app state" record. */
export async function getWorkflowState() {
  const existing = await prisma.workflowState.findFirst();
  if (existing) return existing;
  return prisma.workflowState.create({ data: {} });
}

/**
 * Reads the workflow state and, if an operation is running, recomputes progress from
 * elapsed time (and auto-completes it at 100%). This is what keeps state correct even
 * if the server restarted mid-operation.
 */
export async function getLiveWorkflowState() {
  const state = await getWorkflowState();
  const { progress, completed } = computeLiveProgress(
    state.operationStatus as OperationStatus,
    state.operationStartedAt,
    state.progress
  );

  if (completed) {
    return prisma.workflowState.update({
      where: { id: state.id },
      data: { operationStatus: "STOPPED", progress: 100, operationStartedAt: null },
    });
  }

  if (progress !== state.progress) {
    return prisma.workflowState.update({ where: { id: state.id }, data: { progress } });
  }

  return state;
}

/** Full snapshot sent to the frontend after every read or mutation. */
export async function getFullState() {
  const [job, machineChecks, tools, workpieceChecks, workflowState] = await Promise.all([
    prisma.job.findFirst(),
    prisma.machineCheck.findMany({ orderBy: { order: "asc" } }),
    prisma.tool.findMany({ orderBy: { order: "asc" } }),
    prisma.workpieceCheck.findMany({ orderBy: { order: "asc" } }),
    getLiveWorkflowState(),
  ]);

  return {
    job,
    machineChecks,
    tools,
    workpieceChecks,
    workflow: {
      currentStage: workflowState.currentStage,
      operationStatus: workflowState.operationStatus,
      progress: workflowState.progress,
      updatedAt: workflowState.updatedAt,
    },
  };
}
