import { ChevronRight, Loader2 } from "lucide-react";

interface NextButtonProps {
  onClick: () => void;
  disabled: boolean;
  pending: boolean;
  label?: string;
  pendingLabel?: string;
}

export function NextButton({
  onClick,
  disabled,
  pending,
  label = "Next",
  pendingLabel = "Advancing...",
}: NextButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      aria-busy={pending}
      className="inline-flex min-w-[12rem] items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-8 py-4 text-lg font-bold text-zinc-950 transition-colors hover:bg-emerald-400 active:bg-emerald-600 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
    >
      {pending ? (
        <>
          <Loader2 size={22} className="animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          <ChevronRight size={22} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
