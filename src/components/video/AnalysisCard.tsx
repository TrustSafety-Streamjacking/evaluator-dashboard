"use client";

import { useState } from "react";
import { VideoDocument } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface AnalysisCardProps {
  video: VideoDocument;
}

interface ParsedSignal {
  text: string;
  keywords?: string[];
  hasCryptoWarning: boolean;
  contribution: number; // exact value from score map, or estimated
  hasExactScore: boolean;
}

function parseSignals(
  signals: string[],
  scoreMap: Record<string, number> | undefined,
  fallbackScore: number,
): ParsedSignal[] {
  const estimated = signals.length > 0 ? Math.round(fallbackScore / signals.length) : 0;
  return signals.map((text) => {
    const lower = text.toLowerCase();
    const hasCryptoWarning = /crypto address|suspicious url/.test(lower);
    const keywordMatch = text.match(/(?:scam keywords?|keywords?):\s*(.+)/i);
    const keywords = keywordMatch
      ? keywordMatch[1].split(/,\s*/).map((k) => k.trim()).filter(Boolean)
      : undefined;
    const exactScore = scoreMap?.[text];
    const hasExactScore = exactScore !== undefined;
    return {
      text,
      keywords,
      hasCryptoWarning,
      contribution: hasExactScore ? exactScore! : estimated,
      hasExactScore,
    };
  });
}

export function AnalysisCard({ video }: AnalysisCardProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const videoSignals = parseSignals(
    video.video_signals ?? [],
    video.video_signal_scores,
    video.video_risk_score ?? 0,
  );
  const channelSignals = parseSignals(
    video.channel_signals ?? [],
    video.channel_signal_scores,
    video.channel_risk_score ?? 0,
  );
  const totalScore = video.total_risk_score ?? 0;
  // Use max absolute contribution as the bar scale so negatives render sensibly
  const allContributions = [...videoSignals, ...channelSignals].map((s) => Math.abs(s.contribution));
  const maxContribution = allContributions.length > 0 ? Math.max(...allContributions) : 1;
  const tags = video.tags ?? [];

  return (
    <div className="space-y-5 text-sm">
      {/* Score breakdown */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Score breakdown</p>
        <div className="space-y-2">
          <ScoreBar label="Video risk" score={video.video_risk_score ?? 0} total={totalScore} color="bg-amber-400" />
          <ScoreBar label="Channel risk" score={video.channel_risk_score ?? 0} total={totalScore} color="bg-blue-400" />
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-slate-500 text-xs">Total risk score</span>
            <span className="font-mono font-semibold text-slate-900">{Math.round(totalScore)}</span>
          </div>
          {video.confidence_score != null && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">Confidence score</span>
              <span className={`font-mono font-semibold text-xs ${getConfColor(video.confidence_score)}`}>
                {video.confidence_score.toFixed(3)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Video signals */}
      {videoSignals.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Video signals
            <span className="ml-1.5 text-amber-600 font-mono normal-case">({Math.round(video.video_risk_score ?? 0)} pts)</span>
          </p>
          <div className="space-y-3">
            {videoSignals.map((s, i) => (
              <SignalRow key={i} signal={s} maxContribution={maxContribution} />
            ))}
          </div>
        </div>
      )}

      {/* Channel signals */}
      {channelSignals.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Channel signals
            <span className="ml-1.5 text-blue-600 font-mono normal-case">({Math.round(video.channel_risk_score ?? 0)} pts)</span>
          </p>
          <div className="space-y-3">
            {channelSignals.map((s, i) => (
              <SignalRow key={i} signal={s} maxContribution={maxContribution} />
            ))}
          </div>
        </div>
      )}

      {videoSignals.length === 0 && channelSignals.length === 0 && (
        <p className="text-slate-400 text-xs">No signals recorded for this video.</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {(tagsExpanded ? tags : tags.slice(0, 8)).map((tag, i) => (
              <span key={i} className="inline-block text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
          {tags.length > 8 && (
            <button
              onClick={() => setTagsExpanded((v) => !v)}
              className="mt-1.5 text-xs text-blue-600 hover:underline"
            >
              {tagsExpanded ? "Show less" : `Show ${tags.length - 8} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, total, color }: { label: string; score: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((score / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 text-xs w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-slate-700 w-8 text-right shrink-0">{Math.round(score)}</span>
    </div>
  );
}

function SignalRow({ signal, maxContribution }: { signal: ParsedSignal; maxContribution: number }) {
  const isNegative = signal.contribution < 0;
  const pct = maxContribution > 0 ? Math.round((Math.abs(signal.contribution) / maxContribution) * 100) : 0;
  const barColor = isNegative ? "bg-green-400" : "bg-slate-300";
  const scoreLabel = isNegative
    ? `${Math.round(signal.contribution)}`
    : `+${Math.round(signal.contribution)}`;
  const scoreLabelColor = isNegative ? "text-green-600" : "text-slate-500";

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-700 leading-relaxed">{signal.text}</p>
          {signal.keywords && signal.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {signal.keywords.map((kw, i) => (
                <span key={i} className="inline-block text-xs bg-red-50 text-red-700 border border-red-200 rounded px-1.5 py-0.5">
                  {kw}
                </span>
              ))}
            </div>
          )}
          {signal.hasCryptoWarning && (
            <p className="mt-1 text-xs text-amber-700 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              Verify: check video description — address may not actually be present
            </p>
          )}
        </div>
        <span className={`font-mono text-xs shrink-0 pt-0.5 ${scoreLabelColor}`}>
          {scoreLabel}
          {!signal.hasExactScore && <span className="text-slate-300 ml-0.5">~</span>}
        </span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function getConfColor(score: number): string {
  if (score >= 0.7) return "text-red-600";
  if (score >= 0.4) return "text-orange-500";
  return "text-green-600";
}
