import type { LucideIcon } from "lucide-react";
import { AlertOctagon, BellOff, Compass, DoorClosed, Droplets, Power } from "lucide-react";
import { ChecklistItem } from "./ChecklistItem";
import type { MachineCheck } from "../types/workflow";

const ICONS: Record<string, LucideIcon> = {
  power: Power,
  estop: AlertOctagon,
  guard: DoorClosed,
  alarm: BellOff,
  coolant: Droplets,
  reference: Compass,
};

interface ChecklistProps {
  checks: MachineCheck[];
  onConfirm: (id: number) => void;
  isPending: (id: number) => boolean;
}

export function Checklist({ checks, onConfirm, isPending }: ChecklistProps) {
  return (
    <ul className="flex flex-col gap-3">
      {checks.map((check) => (
        <ChecklistItem
          key={check.id}
          icon={ICONS[check.key] ?? Power}
          name={check.name}
          description={check.description}
          confirmed={check.confirmed}
          pending={isPending(check.id)}
          onConfirm={() => onConfirm(check.id)}
        />
      ))}
    </ul>
  );
}
