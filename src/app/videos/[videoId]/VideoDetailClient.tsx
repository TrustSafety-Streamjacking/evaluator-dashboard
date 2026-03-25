"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoDocument } from "@/lib/types";
import { VideoEmbed } from "@/components/video/VideoEmbed";
import { MetadataCard } from "@/components/video/MetadataCard";
import { LabelForm } from "@/components/video/LabelForm";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

interface VideoDetailClientProps {
  video: VideoDocument;
  prevVideoId?: string | null;
  nextVideoId?: string | null;
  filterParams?: string;
}

export function VideoDetailClient({ video: initialVideo, prevVideoId, nextVideoId, filterParams }: VideoDetailClientProps) {
  const router = useRouter();
  const [video, setVideo] = useState(initialVideo);

  const qs = filterParams ? `?${filterParams}` : "";

  function handleLabeled(updated: VideoDocument) {
    setVideo(updated);
    // Auto-advance to next video after a short delay
    if (nextVideoId) {
      setTimeout(() => {
        router.push(`/videos/${nextVideoId}${qs}`);
      }, 1200);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Toaster position="top-right" />

      {/* Top nav bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={!prevVideoId}
            onClick={() => prevVideoId && router.push(`/videos/${prevVideoId}${qs}`)}
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Prev unlabeled
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={!nextVideoId}
            onClick={() => nextVideoId && router.push(`/videos/${nextVideoId}${qs}`)}
          >
            Next unlabeled
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Main content: full height, two-column side by side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left column: embed, flush to nav bar */}
        <div className="flex-1 min-w-0 flex flex-col p-6 lg:sticky lg:top-0 lg:h-[calc(100vh-7rem)] overflow-hidden">
          <VideoEmbed videoId={video.video_id} title={video.video_title} />
        </div>

        {/* Right column: fixed width, full-height panel */}
        <div className="w-[420px] shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
          {/* Title / channel header */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-start gap-2 flex-wrap mb-1">
              <RiskBadge category={video.risk_category} />
              <h1 className="text-base font-semibold text-slate-900 leading-snug flex-1 min-w-0">
                {video.video_title || video.video_id}
              </h1>
            </div>
            {video.channel_title && (
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1 flex-wrap">
                {video.channel_title}
                {video.video_url && (
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                    YouTube
                  </a>
                )}
              </p>
            )}
          </div>

          {/* Tabbed: Metadata / Label */}
          <Tabs defaultValue="label" className="flex flex-col flex-1 min-h-0">
            <TabsList className="shrink-0 px-1">
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="label">
                Label
                {video.ground_truth_label && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metadata" className="flex-1 overflow-y-auto px-5 py-5 data-[state=inactive]:hidden">
              <MetadataCard video={video} />
            </TabsContent>

            <TabsContent value="label" className="flex-1 overflow-y-auto px-5 py-5 pb-8 data-[state=inactive]:hidden">
              <LabelForm video={video} onLabeled={handleLabeled} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
