import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, CircleDot, OctagonX } from "lucide-react";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_STYLES: Record<BadgeTone, string> = {
  success: "bg-emerald-950 text-emerald-400 border-emerald-700",
  warning: "bg-amber-950 text-amber-400 border-amber-700",
  danger: "bg-red-950 text-red-400 border-red-700",
  info: "bg-sky-950 text-sky-400 border-sky-700",
  neutral: "bg-zinc-800 text-zinc-300 border-zinc-600",
};

const TONE_ICON: Record<BadgeTone, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: OctagonX,
  info: CircleDot,
  neutral: CircleDot,
};

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  size?: "sm" | "lg";
  className?: string;
}

export function StatusBadge({ label, tone, size = "sm", className = "" }: StatusBadgeProps) {
  const Icon = TONE_ICON[tone];
  const sizeClasses =
    size === "lg"
      ? "px-5 py-2.5 text-xl gap-2.5 rounded-xl"
      : "px-3 py-1.5 text-sm gap-1.5 rounded-lg";
  const iconSize = size === "lg" ? 24 : 16;

  return (
    <span
      role="status"
      className={`inline-flex items-center font-semibold border ${TONE_STYLES[tone]} ${sizeClasses} ${className}`}
    >
      <Icon size={iconSize} aria-hidden="true" strokeWidth={2.5} />
      {label}
    </span>
  );
}
