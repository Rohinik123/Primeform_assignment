import { CheckCircle2, Loader2 } from "lucide-react";

interface ConfirmButtonProps {
  confirmed: boolean;
  pending: boolean;
  onConfirm: () => void;
  label?: string;
  confirmedLabel?: string;
  pendingLabel?: string;
}

export function ConfirmButton({
  confirmed,
  pending,
  onConfirm,
  label = "Confirm Check",
  confirmedLabel = "Confirmed",
  pendingLabel = "Confirming...",
}: ConfirmButtonProps) {
  if (confirmed) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-950 px-5 py-3 text-base font-semibold text-emerald-400">
        <CheckCircle2 size={22} aria-hidden="true" />
        {confirmedLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onConfirm}
      disabled={pending}
      aria-busy={pending}
      className="inline-flex min-w-[11rem] items-center justify-center gap-2 rounded-xl border border-amber-500 bg-amber-500 px-5 py-3 text-base font-bold text-zinc-950 transition-colors hover:bg-amber-400 active:bg-amber-600 disabled:cursor-not-allowed disabled:border-zinc-600 disabled:bg-zinc-700 disabled:text-zinc-400"
    >
      {pending ? (
        <>
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
