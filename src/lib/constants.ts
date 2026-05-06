import { DetectorVersion, LabelValue, RiskCategory } from "./types";

export const PAGE_SIZE = 25;

export const LABELS: { value: LabelValue; label: string; description: string }[] = [
  {
    value: "true_positive",
    label: "True Positive",
    description: "Correctly flagged — this is a real streamjacking incident",
  },
  {
    value: "false_positive",
    label: "False Positive",
    description: "Incorrectly flagged — this is NOT a streamjacking incident",
  },
  {
    value: "true_negative",
    label: "True Negative",
    description: "Correctly cleared — legitimate content, not flagged as scam",
  },
  {
    value: "false_negative",
    label: "False Negative",
    description: "Missed scam — should have been flagged but wasn't",
  },
];

export const RISK_CATEGORIES: RiskCategory[] = ["LOW", "MEDIUM", "HIGH"];

export const RISK_COLORS: Record<RiskCategory, string> = {
  LOW: "bg-green-100 text-green-800 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HIGH: "bg-red-100 text-red-800 border-red-200",
};

export const LABEL_COLORS: Record<LabelValue, string> = {
  true_positive: "bg-red-100 text-red-800 border-red-200",
  false_positive: "bg-orange-100 text-orange-800 border-orange-200",
  true_negative: "bg-green-100 text-green-800 border-green-200",
  false_negative: "bg-purple-100 text-purple-800 border-purple-200",
};

export const VERSION_COLORS: Record<DetectorVersion, string> = {
  V1: "bg-slate-100 text-slate-600 border-slate-300",
  V2: "bg-blue-100 text-blue-700 border-blue-200",
  V3: "bg-violet-100 text-violet-700 border-violet-200",
};

export const VERSION_DATES: Record<DetectorVersion, string> = {
  V1: "before 2026-01-01",
  V2: "2026-01-01 - 2026-04-24",
  V3: "2026-04-25 - present",
};

export const LABEL_DISPLAY: Record<LabelValue, string> = {
  true_positive: "TP",
  false_positive: "FP",
  true_negative: "TN",
  false_negative: "FN",
};
