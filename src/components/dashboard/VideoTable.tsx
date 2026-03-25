"use client";

import Link from "next/link";
import { VideoDocument } from "@/lib/types";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { LabelBadge } from "@/components/shared/LabelBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, Radio } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoTableProps {
  videos: VideoDocument[];
  isLoading?: boolean;
  filterParams?: string;
}

export function VideoTable({ videos, isLoading, filterParams }: VideoTableProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-20">Risk</TableHead>
              <TableHead>Video</TableHead>
              <TableHead className="w-28">Channel</TableHead>
              <TableHead className="w-20 text-right">Conf.</TableHead>
              <TableHead className="w-20 text-right">Score</TableHead>
              <TableHead className="w-24">Detected</TableHead>
              <TableHead className="w-24">Label</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        No videos found matching your filters.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-20">Risk</TableHead>
            <TableHead>Video</TableHead>
            <TableHead className="w-36">Channel</TableHead>
            <TableHead className="w-16 text-right">Conf.</TableHead>
            <TableHead className="w-16 text-right">Score</TableHead>
            <TableHead className="w-24">Detected</TableHead>
            <TableHead className="w-24">Label</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow
              key={video._id}
              className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                video.ground_truth_label ? "opacity-70" : ""
              }`}
            >
              <TableCell>
                <RiskBadge category={video.risk_category} />
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2 min-w-0">
                  {video.is_live && (
                    <Radio className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/videos/${video.video_id}${filterParams ? `?${filterParams}` : ""}`}
                      className="text-sm font-medium text-slate-900 hover:text-blue-600 line-clamp-2 leading-snug"
                    >
                      {video.video_title || video.video_id}
                    </Link>
                    {video.video_url && (
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-xs text-slate-400 hover:text-blue-500 mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600 line-clamp-1">{video.channel_title || "—"}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className={`text-sm font-mono ${getConfidenceColor(video.confidence_score)}`}>
                  {video.confidence_score != null ? video.confidence_score.toFixed(2) : "—"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-mono text-slate-600">
                  {video.total_risk_score ?? "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-slate-500">{formatDateShort(video.detected_at)}</span>
              </TableCell>
              <TableCell>
                <LabelBadge label={video.ground_truth_label} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getConfidenceColor(score?: number | null): string {
  if (score == null) return "text-slate-400";
  if (score >= 0.7) return "text-red-600";
  if (score >= 0.4) return "text-orange-500";
  return "text-green-600";
}
