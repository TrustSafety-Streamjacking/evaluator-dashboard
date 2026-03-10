import { cn } from "@/lib/utils";
import { RISK_COLORS } from "@/lib/constants";
import { RiskCategory } from "@/lib/types";

interface RiskBadgeProps {
  category?: RiskCategory | string | null;
  className?: string;
}

export function RiskBadge({ category, className }: RiskBadgeProps) {
  if (!category) return <span className="text-slate-400 text-xs">—</span>;

  const colorClass = RISK_COLORS[category as RiskCategory] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {category}
    </span>
  );
}
