"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "unlabeled";
  const risk = searchParams.get("risk_category") || "all";
  const sort = searchParams.get("sort") || "risk_desc";
  const search = searchParams.get("search") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 flex-wrap">
      <Select value={status} onValueChange={(v) => updateParam("status", v)}>
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unlabeled">Unlabeled</SelectItem>
          <SelectItem value="labeled">Labeled</SelectItem>
          <SelectItem value="all">All videos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={risk} onValueChange={(v) => updateParam("risk_category", v)}>
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Risk" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All risks</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
        <SelectTrigger className="w-44 h-8 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="risk_desc">Risk score (high first)</SelectItem>
          <SelectItem value="confidence_desc">Confidence (high first)</SelectItem>
          <SelectItem value="confidence_asc">Confidence (low first)</SelectItem>
          <SelectItem value="detected_desc">Detected (newest)</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative flex-1 min-w-48 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search title or channel..."
          defaultValue={search}
          className="pl-8 h-8 text-sm"
          onChange={(e) => {
            const val = e.target.value;
            clearTimeout((window as Window & { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout);
            (window as Window & { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout = setTimeout(() => updateParam("search", val), 400);
          }}
        />
      </div>
    </div>
  );
}
