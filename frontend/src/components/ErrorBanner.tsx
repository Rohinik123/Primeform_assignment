import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-start gap-3 rounded-xl border border-red-700 bg-red-950 p-4 shadow-lg sm:right-4 sm:left-auto"
    >
      <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-400" aria-hidden="true" />
      <p className="flex-1 text-sm text-red-200">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="shrink-0 rounded-md p-1 text-red-300 hover:bg-red-900 hover:text-red-100"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
