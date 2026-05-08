export type LabelValue =
  | "true_positive"
  | "false_positive"
  | "true_negative"
  | "false_negative";

export type RiskCategory = "LOW" | "MEDIUM" | "HIGH";

export interface ValidationRecord {
  label: LabelValue;
  reviewed_at: string;
  reviewer: string;
}

export interface SoftRedetect {
  bert_scam_score?: number | null;
  video_signals?: string[];
  video_signal_scores?: Record<string, number>;
  channel_signals?: string[];
  channel_signal_scores?: Record<string, number>;
  confidence_score?: number;
  takeover_type?: string;
  risk_category?: string;
  total_risk_score?: number;
  video_risk_score?: number;
  channel_risk_score?: number;
  redetected_at?: string;
  signals_skipped?: string[];
  history_available?: boolean;
}

export interface VideoDocument {
  _id: string;
  video_id: string;
  channel_id?: string;
  channel_risk_score?: number;
  channel_signals?: string[];
  channel_title?: string;
  channel_url?: string;
  channel_description?: string;
  video_description?: string;
  confidence_score?: number;
  detected_at?: string;
  detection_count?: number;
  first_detected?: string;
  is_live?: boolean;
  risk_category?: RiskCategory;
  search_query?: string;
  total_risk_score?: number;
  video_risk_score?: number;
  video_signals?: string[];
  video_title?: string;
  video_url?: string;
  ground_truth_label?: LabelValue | null;
  scam_type?: string | null;
  validated_at?: string | null;
  validation?: ValidationRecord | null;
  validation_reasoning?: string | null;
  is_active?: boolean;
  verification_date?: string | null;
  verification_status?: string | null;
  detector_version?: DetectorVersion | null;
  tags?: string[];
  video_signal_scores?: Record<string, number>;
  channel_signal_scores?: Record<string, number>;
  soft_redetect?: SoftRedetect | null;
}

export interface PaginatedVideosResponse {
  videos: VideoDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: LabelStats;
}

export interface LabelStats {
  total: number;
  labeled: number;
  unlabeled: number;
  true_positive: number;
  false_positive: number;
  true_negative: number;
  false_negative: number;
}

export interface LabelRequest {
  label: LabelValue;
  reasoning?: string;
}

export type DetectorVersion = "V1" | "V2" | "V3";

export type FilterStatus = "unlabeled" | "labeled" | "all";
export type SortOption = "risk_desc" | "detected_desc";

export interface FilterState {
  page: number;
  status: FilterStatus;
  risk_category: RiskCategory | "all";
  search: string;
  sort: SortOption;
}

export type RunStatus = "running" | "succeeded" | "failed" | "cancelled";

export interface RunStats {
  videos_processed: number;
  videos_detected: number;
  new_detections: number;
  re_detections: number;
  live_at_detection: number;
  errors: number;
  by_risk: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
}

export interface DetectorRunDocument {
  _id: string;
  run_id: string;
  execution_name: string;
  job_name: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  status: RunStatus;
  task_count: number;
  succeeded_count: number;
  failed_count: number;
  cancelled_count: number;
  triggered_by: string;
  is_scheduled: boolean;
  log_uri: string;
  detector_version: DetectorVersion;
  search_queries: string[];
  stats: RunStats;
  error_message: string | null;
  labels: Record<string, string>;
  created_at: string;
}

export interface PaginatedRunsResponse {
  runs: DetectorRunDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
