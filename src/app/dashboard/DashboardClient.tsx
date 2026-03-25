"use client";

import { useSearchParams } from "next/navigation";
import { useVideos } from "@/hooks/useVideos";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { VideoTable } from "@/components/dashboard/VideoTable";
import { PaginationControls } from "@/components/dashboard/PaginationControls";

export function DashboardClient() {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "unlabeled";
  const risk_category = searchParams.get("risk_category") || "all";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "risk_desc";

  const { data, isLoading } = useVideos({ page, status, risk_category, search, sort });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <StatsBar stats={data?.stats} />
      <FilterBar />
      <div className="flex-1 flex flex-col overflow-hidden bg-white border-x border-b border-slate-200 mx-6 mt-4 mb-4 rounded-lg shadow-sm">
        <VideoTable videos={data?.videos ?? []} isLoading={isLoading} filterParams={searchParams.toString()} />
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
