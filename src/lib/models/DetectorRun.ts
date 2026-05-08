import mongoose, { Schema, Model } from "mongoose";
import { DetectorRunDocument } from "@/lib/types";

const RunStatsSchema = new Schema(
  {
    videos_processed: Number,
    videos_detected: Number,
    new_detections: Number,
    re_detections: Number,
    live_at_detection: Number,
    errors: Number,
    by_risk: {
      LOW: Number,
      MEDIUM: Number,
      HIGH: Number,
    },
  },
  { _id: false }
);

const DetectorRunSchema = new Schema(
  {
    run_id: { type: String, required: true, unique: true },
    execution_name: { type: String, required: true },
    job_name: { type: String, required: true },
    started_at: { type: Date, required: true },
    completed_at: { type: Date, default: null },
    duration_seconds: { type: Number, default: null },
    status: { type: String, required: true },
    task_count: { type: Number, required: true },
    succeeded_count: { type: Number, required: true },
    failed_count: { type: Number, required: true },
    cancelled_count: { type: Number, required: true },
    triggered_by: { type: String, required: true },
    is_scheduled: { type: Boolean, required: true },
    log_uri: { type: String, required: true },
    detector_version: { type: String, required: true },
    search_queries: [String],
    stats: { type: RunStatsSchema, required: true },
    error_message: { type: String, default: null },
    labels: { type: Schema.Types.Mixed, default: {} },
    created_at: { type: Date, required: true },
  },
  {
    strict: false,
    collection: "detector_runs",
  }
);

// Indexes for efficient filtering and sorting
DetectorRunSchema.index({ started_at: -1 });
DetectorRunSchema.index({ status: 1, started_at: -1 });
DetectorRunSchema.index({ detector_version: 1, started_at: -1 });
DetectorRunSchema.index({ run_id: 1 }, { unique: true });

export const DetectorRun: Model<DetectorRunDocument> =
  (mongoose.models.DetectorRun as Model<DetectorRunDocument>) ||
  mongoose.model<DetectorRunDocument>("DetectorRun", DetectorRunSchema);
