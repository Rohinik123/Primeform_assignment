import type { Job, StatePayload } from "../types/workflow";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiRequestError("Unable to reach the server. Check your network connection.");
  }

  let body: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      // non-JSON response body, ignore
    }
  }

  if (!response.ok) {
    const message =
      (body as { error?: string } | null)?.error ?? `Request failed (${response.status}).`;
    throw new ApiRequestError(message, response.status);
  }

  return body as T;
}

export const api = {
  getJob: () => request<Job>("/api/job"),
  getState: () => request<StatePayload>("/api/state"),
  nextStage: () => request<StatePayload>("/api/stage/next", { method: "POST" }),
  confirmMachineCheck: (id: number) =>
    request<StatePayload>(`/api/machine-checks/${id}/confirm`, { method: "PUT" }),
  confirmTool: (id: number) =>
    request<StatePayload>(`/api/tools/${id}/confirm`, { method: "PUT" }),
  confirmWorkpieceCheck: (id: number) =>
    request<StatePayload>(`/api/workpiece-checks/${id}/confirm`, { method: "PUT" }),
  startOperation: () => request<StatePayload>("/api/operation/start", { method: "POST" }),
  stopOperation: () => request<StatePayload>("/api/operation/stop", { method: "POST" }),
  reset: () => request<StatePayload>("/api/reset", { method: "POST" }),
};
