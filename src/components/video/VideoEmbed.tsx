"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoEmbedProps {
  videoId: string;
  title?: string;
}

export function VideoEmbed({ videoId, title }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {!loaded ? (
        <div
          className="relative w-full h-full cursor-pointer group"
          onClick={() => setLoaded(true)}
        >
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-500 border-0 shadow-lg"
              onClick={() => setLoaded(true)}
            >
              <Play className="h-7 w-7 fill-white text-white ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
