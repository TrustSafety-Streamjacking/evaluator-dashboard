import { cn } from "@/lib/utils";
import { RUN_STATUS_COLORS } from "@/lib/constants";
import { RunStatus } from "@/lib/types";

interface RunStatusBadgeProps {
  status: RunStatus;
  className?: string;
}

export function RunStatusBadge({ status, className }: RunStatusBadgeProps) {
  const colorClass = RUN_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600 border-slate-200";

  const displayText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {displayText}
    </span>
  );
}
