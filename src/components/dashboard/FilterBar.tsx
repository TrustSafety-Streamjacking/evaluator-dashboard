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
import { cn } from "@/lib/utils";
import { VERSION_DATES } from "@/lib/constants";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "unlabeled";
  const risk = searchParams.get("risk_category") || "all";
  const version = searchParams.get("detector_version") || "all";
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
      params.set("page", "1");
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

      <Select value={version} onValueChange={(v) => updateParam("detector_version", v)}>
        <SelectTrigger className="w-40 h-8 text-sm">
          <SelectValue placeholder="Version" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All versions</SelectItem>
          <SelectItem value="V1" title={VERSION_DATES.V1}>V1</SelectItem>
          <SelectItem value="V2" title={VERSION_DATES.V2}>V2</SelectItem>
          <SelectItem value="V3" title={VERSION_DATES.V3}>V3</SelectItem>
          <SelectItem value="V4" title={`V4`}>V4</SelectItem>
        </SelectContent>
      </Select>

      <div className="inline-flex h-8 rounded-md border border-slate-200 overflow-hidden text-sm">
        <SortToggle
          active={sort === "risk_desc"}
          onClick={() => updateParam("sort", "risk_desc")}
          label="Risk ↓"
        />
        <SortToggle
          active={sort === "detected_desc"}
          onClick={() => updateParam("sort", "detected_desc")}
          label="Newest"
        />
      </div>

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

function SortToggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 transition-colors border-r border-slate-200 last:border-r-0",
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}
