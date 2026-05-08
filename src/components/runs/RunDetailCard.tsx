"use client";

import { useRouter } from "next/navigation";
import { DetectorRunDocument } from "@/lib/types";
import { RunStatusBadge } from "@/components/runs/RunStatusBadge";
import { VersionBadge } from "@/components/shared/VersionBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { formatDate, formatDuration, cn } from "@/lib/utils";

interface RunDetailCardProps {
  run: DetectorRunDocument;
}

function StatCard({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={cn("px-4 py-3 bg-slate-50 rounded border border-slate-200", className)}>
      <div className="text-xs font-medium text-slate-600 mb-1">{label}</div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export function RunDetailCard({ run }: RunDetailCardProps) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/runs")}
              className="text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{run.run_id}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RunStatusBadge status={run.status} />
            <VersionBadge version={run.detector_version} />
            {run.log_uri && (
              <a
                href={run.log_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-500 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="Started" value={formatDate(run.started_at)} />
            <StatCard
              label="Completed"
              value={run.completed_at ? formatDate(run.completed_at) : "In progress"}
            />
            <StatCard
              label="Duration"
              value={run.duration_seconds != null ? formatDuration(run.duration_seconds) : "—"}
            />
            <div title={run.triggered_by}>
              <StatCard label="Triggered by" value={run.triggered_by.split("@")[0]} />
            </div>
            <StatCard label="Scheduled" value={run.is_scheduled ? "Yes" : "Manual"} />
          </div>
        </div>

        {/* Detection Stats */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Detection Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Processed" value={run.stats.videos_processed} />
            <StatCard label="Detected" value={run.stats.videos_detected} />
            <StatCard label="New" value={run.stats.new_detections} />
            <StatCard label="Re-detected" value={run.stats.re_detections} />
            <StatCard label="Live" value={run.stats.live_at_detection} />
            <StatCard
              label="Errors"
              value={run.stats.errors}
              className={run.stats.errors > 0 ? "bg-red-50 border-red-200" : ""}
            />
          </div>

          {/* Risk Breakdown */}
          <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200">
            <div className="text-xs font-medium text-slate-600 mb-3">Risk Breakdown</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <RiskBadge category="LOW" />
                <span className="text-sm font-semibold text-slate-900">{run.stats.by_risk.LOW}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge category="MEDIUM" />
                <span className="text-sm font-semibold text-slate-900">{run.stats.by_risk.MEDIUM}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge category="HIGH" />
                <span className="text-sm font-semibold text-slate-900">{run.stats.by_risk.HIGH}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GCP Execution */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">GCP Execution</h2>
          <div className="p-4 bg-white border border-slate-200 rounded space-y-3">
            <div>
              <div className="text-xs font-medium text-slate-600">Job</div>
              <div className="text-sm font-mono text-slate-900">{run.job_name}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600">Execution</div>
              <div
                className="text-sm font-mono text-slate-600 truncate cursor-help"
                title={run.execution_name}
              >
                {run.execution_name}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <div className="text-xs font-medium text-slate-600">Total Tasks</div>
                <div className="text-sm font-semibold text-slate-900">{run.task_count}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600">Succeeded</div>
                <div className="text-sm font-semibold text-green-700">{run.succeeded_count}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600">Failed</div>
                <div className={`text-sm font-semibold ${run.failed_count > 0 ? "text-red-700" : "text-slate-500"}`}>
                  {run.failed_count}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600">Cancelled</div>
                <div className={`text-sm font-semibold ${run.cancelled_count > 0 ? "text-orange-700" : "text-slate-500"}`}>
                  {run.cancelled_count}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Queries */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Search Queries</h2>
          {run.search_queries.length > 0 ? (
            <ul className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              {run.search_queries.map((query, i) => (
                <li key={i} className="text-sm text-slate-700">
                  • {query}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <span className="text-sm text-slate-500">—</span>
            </div>
          )}
        </div>

        {/* Error Section (conditional) */}
        {run.status === "failed" && run.error_message && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-red-700">Error</h2>
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800 font-mono">{run.error_message}</p>
            </div>
          </div>
        )}

        {/* Labels Section (conditional) */}
        {Object.keys(run.labels).length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">Labels</h2>
            <div className="p-4 bg-white border border-slate-200 rounded">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(run.labels).map(([key, value]) => (
                    <tr key={key} className="border-b border-slate-100 last:border-b-0">
                      <td className="py-2 pr-4 font-medium text-slate-600">{key}</td>
                      <td className="py-2 font-mono text-slate-700">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
