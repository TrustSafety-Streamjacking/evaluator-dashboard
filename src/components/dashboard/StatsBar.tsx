import { LabelStats } from "@/lib/types";

interface StatsBarProps {
  stats?: LabelStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  if (!stats) return null;

  const pct = stats.total > 0 ? ((stats.labeled / stats.total) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center gap-6 flex-wrap text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Total</span>
          <span className="font-semibold text-slate-900">{stats.total.toLocaleString()}</span>
        </div>
        <div className="text-slate-300">|</div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Labeled</span>
          <span className="font-semibold text-slate-900">
            {stats.labeled.toLocaleString()}
            <span className="text-slate-400 font-normal ml-1">({pct}%)</span>
          </span>
        </div>
        <div className="text-slate-300">|</div>
        <div className="flex items-center gap-4">
          <Stat label="TP" value={stats.true_positive} color="text-red-700" />
          <Stat label="FP" value={stats.false_positive} color="text-orange-700" />
          <Stat label="TN" value={stats.true_negative} color="text-green-700" />
          <Stat label="FN" value={stats.false_negative} color="text-purple-700" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`font-semibold text-xs ${color}`}>{label}</span>
      <span className="text-slate-700 font-medium">{value.toLocaleString()}</span>
    </div>
  );
}
