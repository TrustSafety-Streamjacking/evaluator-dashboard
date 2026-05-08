"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRuns } from "@/hooks/useRuns";
import { RunsTable } from "@/components/runs/RunsTable";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function RunsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "all";
  const detector_version = searchParams.get("detector_version") || "all";

  const { data, isLoading } = useRuns({ page, status, detector_version });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Detector Runs</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          Filters
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>

        {showFilters && (
          <div className="mt-4 flex gap-4 flex-wrap">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value === "all") {
                    params.delete("status");
                  } else {
                    params.set("status", e.target.value);
                  }
                  params.set("page", "1");
                  window.history.pushState({}, "", `?${params.toString()}`);
                }}
                className="text-sm px-2 py-1 border border-slate-200 rounded"
              >
                <option value="all">All</option>
                <option value="running">Running</option>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-2">Detector Version</label>
              <select
                value={detector_version}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value === "all") {
                    params.delete("detector_version");
                  } else {
                    params.set("detector_version", e.target.value);
                  }
                  params.set("page", "1");
                  window.history.pushState({}, "", `?${params.toString()}`);
                }}
                className="text-sm px-2 py-1 border border-slate-200 rounded"
              >
                <option value="all">All</option>
                <option value="V1">V1</option>
                <option value="V2">V2</option>
                <option value="V3">V3</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white border-x border-b border-slate-200 mx-6 mt-4 mb-4 rounded-lg shadow-sm">
        <RunsTable runs={data?.runs ?? []} isLoading={isLoading} />
        {data && (
          <PaginationControls
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
          />
        )}
      </div>
    </div>
  );
}
