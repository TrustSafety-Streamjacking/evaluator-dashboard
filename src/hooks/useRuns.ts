import useSWR from "swr";
import { PaginatedRunsResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UseRunsParams {
  page?: number;
  status?: string;
  detector_version?: string;
}

export function useRuns(params: UseRunsParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.status) query.set("status", params.status);
  if (params.detector_version) query.set("detector_version", params.detector_version);

  const key = `/api/runs?${query.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedRunsResponse>(key, fetcher, {
    keepPreviousData: true,
  });

  return { data, error, isLoading, mutate };
}
