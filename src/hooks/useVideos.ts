import useSWR from "swr";
import { PaginatedVideosResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UseVideosParams {
  page?: number;
  status?: string;
  risk_category?: string;
  search?: string;
  sort?: string;
}

export function useVideos(params: UseVideosParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.status) query.set("status", params.status);
  if (params.risk_category) query.set("risk_category", params.risk_category);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);

  const key = `/api/videos?${query.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedVideosResponse>(key, fetcher, {
    keepPreviousData: true,
  });

  return { data, error, isLoading, mutate };
}
