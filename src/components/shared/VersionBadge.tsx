import { cn } from "@/lib/utils";
import { VERSION_COLORS, VERSION_DATES } from "@/lib/constants";
import { DetectorVersion } from "@/lib/types";

interface VersionBadgeProps {
  version?: DetectorVersion | null;
  className?: string;
  showTooltip?: boolean;
}

export function VersionBadge({ version, className, showTooltip = true }: VersionBadgeProps) {
  if (!version) return <span className="text-slate-400 text-xs">—</span>;

  const colorClass = VERSION_COLORS[version] ?? "bg-slate-100 text-slate-600 border-slate-300";
  const title = showTooltip ? VERSION_DATES[version] : undefined;

  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border font-mono",
        colorClass,
        className
      )}
    >
      {version}
    </span>
  );
}
