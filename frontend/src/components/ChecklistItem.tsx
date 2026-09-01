import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Circle } from "lucide-react";
import { ConfirmButton } from "./ConfirmButton";

interface ChecklistItemProps {
  icon: LucideIcon;
  name: string;
  description: string;
  confirmed: boolean;
  pending: boolean;
  onConfirm: () => void;
}

export function ChecklistItem({
  icon: Icon,
  name,
  description,
  confirmed,
  pending,
  onConfirm,
}: ChecklistItemProps) {
  return (
    <li
      className={`flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
        confirmed ? "border-emerald-800 bg-emerald-950/20" : "border-zinc-700 bg-zinc-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            confirmed ? "bg-emerald-900 text-emerald-400" : "bg-zinc-800 text-zinc-400"
          }`}
          aria-hidden="true"
        >
          <Icon size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {confirmed ? (
              <CheckCircle2 size={18} className="text-emerald-400" aria-hidden="true" />
            ) : (
              <Circle size={18} className="text-zinc-500" aria-hidden="true" />
            )}
            <span className="text-base font-semibold text-zinc-100 sm:text-lg">{name}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-400 sm:text-base">{description}</p>
        </div>
      </div>
      <div className="shrink-0 sm:pl-4">
        <ConfirmButton confirmed={confirmed} pending={pending} onConfirm={onConfirm} />
      </div>
    </li>
  );
}
