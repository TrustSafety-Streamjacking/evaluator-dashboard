import mongoose, { Schema, Model } from "mongoose";
import { VideoDocument } from "@/lib/types";

const ValidationSchema = new Schema(
  {
    label: String,
    reviewed_at: String,
    reviewer: String,
  },
  { _id: false }
);

const VideoSchema = new Schema(
  {
    video_id: String,
    video_title: String,
    video_url: String,
    channel_id: String,
    channel_title: String,
    channel_url: String,
    channel_description: String,
    video_description: String,
    channel_risk_score: Number,
    channel_signals: [String],
    confidence_score: Number,
    detected_at: String,
    detection_count: Number,
    first_detected: String,
    is_live: Boolean,
    risk_category: String,
    search_query: String,
    total_risk_score: Number,
    video_risk_score: Number,
    video_signals: [String],
    ground_truth_label: { type: String, default: null },
    validated_at: { type: String, default: null },
    validation_reasoning: { type: String, default: null },
    validation: { type: ValidationSchema, default: null },
    scam_type: { type: String, default: null },
    is_active: Boolean,
    verification_status: String,
    verification_date: Schema.Types.Mixed,
  },
  {
    strict: false,
    collection: process.env.MONGODB_COLLECTION_NAME || "detected_videos",
  }
);

// Indexes for efficient filtering
VideoSchema.index({ ground_truth_label: 1, total_risk_score: -1 });
VideoSchema.index({ risk_category: 1, ground_truth_label: 1 });
VideoSchema.index({ video_title: "text", channel_title: "text" });
VideoSchema.index({ video_id: 1 }, { unique: true });

export const Video: Model<VideoDocument> =
  (mongoose.models.Video as Model<VideoDocument>) ||
  mongoose.model<VideoDocument>("Video", VideoSchema);
