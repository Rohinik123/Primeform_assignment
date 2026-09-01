import type { ReactNode } from "react";

interface StageContainerProps {
  title: string;
  instruction: string;
  children: ReactNode;
}

export function StageContainer({ title, instruction, children }: StageContainerProps) {
  return (
    <section
      aria-labelledby="stage-title"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6"
    >
      <h2 id="stage-title" className="text-2xl font-bold text-zinc-100 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-1 text-base text-zinc-400 sm:text-lg">{instruction}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
