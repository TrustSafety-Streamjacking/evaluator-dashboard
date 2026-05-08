"use client";

import Link from "next/link";
import { DetectorRunDocument } from "@/lib/types";
import { RunStatusBadge } from "@/components/runs/RunStatusBadge";
import { VersionBadge } from "@/components/shared/VersionBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { formatDateShort, formatDuration } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface RunsTableProps {
  runs: DetectorRunDocument[];
  isLoading?: boolean;
}

export function RunsTable({ runs, isLoading }: RunsTableProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-20">Status</TableHead>
              <TableHead>Run ID</TableHead>
              <TableHead className="w-16">Version</TableHead>
              <TableHead className="w-24">Started</TableHead>
              <TableHead className="w-20 text-right">Duration</TableHead>
              <TableHead className="w-24">Detected</TableHead>
              <TableHead className="w-16 text-right">Errors</TableHead>
              <TableHead className="w-32">Triggered by</TableHead>
              <TableHead className="w-20">Logs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        No detector runs found.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-20">Status</TableHead>
            <TableHead>Run ID</TableHead>
            <TableHead className="w-16">Version</TableHead>
            <TableHead className="w-24">Started</TableHead>
            <TableHead className="w-20 text-right">Duration</TableHead>
            <TableHead className="w-24">Detected</TableHead>
            <TableHead className="w-16 text-right">Errors</TableHead>
            <TableHead className="w-32">Triggered by</TableHead>
            <TableHead className="w-20">Logs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run._id} className="cursor-pointer hover:bg-slate-50 transition-colors">
              <TableCell>
                <RunStatusBadge status={run.status} />
              </TableCell>
              <TableCell>
                <Link
                  href={`/runs/${run.run_id}`}
                  className="text-sm font-medium text-slate-900 hover:text-blue-600"
                >
                  {run.run_id}
                </Link>
              </TableCell>
              <TableCell>
                <VersionBadge version={run.detector_version} />
              </TableCell>
              <TableCell>
                <span className="text-xs text-slate-500">{formatDateShort(run.started_at)}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-xs text-slate-600">
                  {run.duration_seconds != null
                    ? formatDuration(run.duration_seconds)
                    : "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600">
                  {run.stats.new_detections} new / {run.stats.re_detections} re
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={`text-sm font-mono ${run.stats.errors > 0 ? "text-red-600" : "text-green-600"}`}>
                  {run.stats.errors}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-slate-600 truncate">{run.triggered_by}</span>
              </TableCell>
              <TableCell>
                {run.log_uri && (
                  <a
                    href={run.log_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-slate-400 hover:text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
