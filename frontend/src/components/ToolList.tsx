import { CheckCircle2, Circle, Wrench } from "lucide-react";
import { ConfirmButton } from "./ConfirmButton";
import type { Tool } from "../types/workflow";

interface ToolListProps {
  tools: Tool[];
  onConfirm: (id: number) => void;
  isPending: (id: number) => boolean;
}

export function ToolList({ tools, onConfirm, isPending }: ToolListProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tools.map((tool) => (
        <li
          key={tool.id}
          className={`flex flex-col gap-4 rounded-xl border p-4 sm:p-5 ${
            tool.confirmed ? "border-emerald-800 bg-emerald-950/20" : "border-zinc-700 bg-zinc-900"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                tool.confirmed ? "bg-emerald-900 text-emerald-400" : "bg-zinc-800 text-zinc-400"
              }`}
              aria-hidden="true"
            >
              <Wrench size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {tool.confirmed ? (
                  <CheckCircle2 size={18} className="text-emerald-400" aria-hidden="true" />
                ) : (
                  <Circle size={18} className="text-zinc-500" aria-hidden="true" />
                )}
                <span className="font-mono text-base font-bold text-amber-400">
                  {tool.toolNumber}
                </span>
                <span className="text-base font-semibold text-zinc-100 sm:text-lg">
                  {tool.description}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Qty required: {tool.quantity} &middot; {tool.type}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500 sm:text-sm">
                Program: {tool.cncProgram} &middot; Revision: {tool.programRev}
              </p>
            </div>
          </div>
          <ConfirmButton
            confirmed={tool.confirmed}
            pending={isPending(tool.id)}
            onConfirm={() => onConfirm(tool.id)}
            label="Insert & Confirm"
            pendingLabel="Confirming..."
          />
        </li>
      ))}
    </ul>
  );
}
