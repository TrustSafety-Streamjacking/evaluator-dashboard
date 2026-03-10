"use client";

import { useState } from "react";
import { LabelValue, VideoDocument } from "@/lib/types";
import { LABELS } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LabelBadge } from "@/components/shared/LabelBadge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface LabelFormProps {
  video: VideoDocument;
  onLabeled?: (updatedVideo: VideoDocument) => void;
}

export function LabelForm({ video, onLabeled }: LabelFormProps) {
  const [selectedLabel, setSelectedLabel] = useState<LabelValue | "">(
    video.ground_truth_label || ""
  );
  const [reasoning, setReasoning] = useState(video.validation_reasoning || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!selectedLabel) {
      toast.error("Please select a label before saving.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/videos/${video.video_id}/label`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: selectedLabel, reasoning: reasoning.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save label");
        return;
      }

      const updated = await res.json();
      toast.success("Label saved successfully");
      onLabeled?.(updated);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Label this video</p>
      <div className="space-y-4">
        {/* Existing label info */}
        {video.validation && (
          <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              <span className="text-slate-600">
                Labeled by <strong>{video.validation.reviewer}</strong> on {formatDate(video.validation.reviewed_at)}
              </span>
            </div>
            <div className="flex items-center gap-2 pl-5">
              <span className="text-slate-500">Current label:</span>
              <LabelBadge label={video.ground_truth_label} showFull />
            </div>
          </div>
        )}

        {/* Label selection */}
        <RadioGroup
          value={selectedLabel}
          onValueChange={(v) => setSelectedLabel(v as LabelValue)}
          className="space-y-2"
        >
          {LABELS.map((lbl) => (
            <div
              key={lbl.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedLabel === lbl.value
                  ? "border-slate-400 bg-slate-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
              onClick={() => setSelectedLabel(lbl.value)}
            >
              <RadioGroupItem value={lbl.value} id={lbl.value} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <Label htmlFor={lbl.value} className="font-medium cursor-pointer text-sm">
                  {lbl.label}
                </Label>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{lbl.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        {/* Reasoning */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">
            Reasoning <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Textarea
            placeholder="Briefly explain your decision..."
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            className="text-sm resize-none h-24"
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={saving || !selectedLabel}
        >
          {saving ? "Saving..." : video.ground_truth_label ? "Update label" : "Save label"}
        </Button>
      </div>
    </div>
  );
}
