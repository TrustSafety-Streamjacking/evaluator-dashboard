import { VideoDocument } from "@/lib/types";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Radio } from "lucide-react";

interface MetadataCardProps {
  video: VideoDocument;
}

export function MetadataCard({ video }: MetadataCardProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Metadata</p>
      <div className="space-y-3 text-sm">
        {/* Channel */}
        <Row label="Channel">
          {video.channel_url ? (
            <a
              href={video.channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
            >
              {video.channel_title || video.channel_id}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span>{video.channel_title || video.channel_id || "—"}</span>
          )}
        </Row>

        {/* Live status */}
        {video.is_live && (
          <Row label="Status">
            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
              <Radio className="h-3.5 w-3.5" />
              Live at detection time
            </span>
          </Row>
        )}

        {/* Risk */}
        <Row label="Risk">
          <div className="flex items-center gap-2">
            <RiskBadge category={video.risk_category} />
            {video.total_risk_score != null && (
              <span className="text-slate-500 text-xs">Score: {video.total_risk_score}</span>
            )}
          </div>
        </Row>

        {/* Confidence */}
        {video.confidence_score != null && (
          <Row label="Confidence">
            <span className={`font-mono font-semibold ${getConfColor(video.confidence_score)}`}>
              {video.confidence_score.toFixed(3)}
            </span>
          </Row>
        )}

        {/* Detections */}
        {video.detection_count != null && (
          <Row label="Detection count">
            <span>{video.detection_count}</span>
          </Row>
        )}

        {/* First detected */}
        <Row label="First detected">
          <span>{formatDate(video.first_detected)}</span>
        </Row>

        {/* Detected at */}
        <Row label="Last detected">
          <span>{formatDate(video.detected_at)}</span>
        </Row>

        {/* Search query */}
        {video.search_query && (
          <Row label="Search query">
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{video.search_query}</span>
          </Row>
        )}

        {/* Verification */}
        {video.verification_status && (
          <Row label="Verification">
            <span>{video.verification_status}</span>
          </Row>
        )}

        {/* Signals */}
        {(video.channel_signals?.length ?? 0) > 0 && (
          <div className="pt-1">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Channel signals</p>
            <div className="flex flex-wrap gap-1.5">
              {video.channel_signals!.map((s, i) => (
                <span key={i} className="inline-block text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {(video.video_signals?.length ?? 0) > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">Video signals</p>
            <div className="flex flex-wrap gap-1.5">
              {video.video_signals!.map((s, i) => (
                <span key={i} className="inline-block text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded px-2 py-0.5">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-500 shrink-0 w-32">{label}</span>
      <div className="text-slate-900 min-w-0">{children}</div>
    </div>
  );
}

function getConfColor(score: number): string {
  if (score >= 0.7) return "text-red-600";
  if (score >= 0.4) return "text-orange-500";
  return "text-green-600";
}
