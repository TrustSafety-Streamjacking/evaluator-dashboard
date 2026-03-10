import { cn } from "@/lib/utils";
import { LABEL_COLORS, LABEL_DISPLAY } from "@/lib/constants";
import { LabelValue } from "@/lib/types";

interface LabelBadgeProps {
  label?: LabelValue | null;
  showFull?: boolean;
  className?: string;
}

export function LabelBadge({ label, showFull = false, className }: LabelBadgeProps) {
  if (!label) {
    return (
      <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-slate-100 text-slate-500 border-slate-200", className)}>
        Unlabeled
      </span>
    );
  }

  const colorClass = LABEL_COLORS[label];
  const display = showFull
    ? label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : LABEL_DISPLAY[label];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {display}
    </span>
  );
}
