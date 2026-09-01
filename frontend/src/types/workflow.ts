export type Stage = "MACHINE_CHECKS" | "TOOLS" | "WORKPIECE" | "READY" | "OPERATION";

export const STAGE_ORDER: Stage[] = ["MACHINE_CHECKS", "TOOLS", "WORKPIECE", "READY", "OPERATION"];

export const STAGE_LABEL: Record<Stage, string> = {
  MACHINE_CHECKS: "Machine Checks",
  TOOLS: "Tools",
  WORKPIECE: "Workpiece",
  READY: "Ready",
  OPERATION: "Operation",
};

export type OperationStatus = "READY" | "RUNNING" | "STOPPED";

export interface Job {
  id: number;
  operationName: string;
  quantity: number;
  material: string;
  drawingRevision: string;
  cncProgram: string;
  programRevision: string;
  fixture: string;
  workOffset: string;
}

export interface MachineCheck {
  id: number;
  key: string;
  name: string;
  description: string;
  order: number;
  confirmed: boolean;
}

export interface Tool {
  id: number;
  toolNumber: string;
  type: string;
  description: string;
  quantity: number;
  cncProgram: string;
  programRev: string;
  order: number;
  confirmed: boolean;
}

export interface WorkpieceCheck {
  id: number;
  key: string;
  name: string;
  description: string;
  order: number;
  confirmed: boolean;
}

export interface WorkflowSnapshot {
  currentStage: Stage;
  operationStatus: OperationStatus;
  progress: number;
  updatedAt: string;
}

export interface StatePayload {
  job: Job;
  machineChecks: MachineCheck[];
  tools: Tool[];
  workpieceChecks: WorkpieceCheck[];
  workflow: WorkflowSnapshot;
}
