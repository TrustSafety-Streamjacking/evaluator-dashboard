#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "trust-safety";

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI not set");
  process.exit(1);
}

async function seedRuns() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });

    const db = mongoose.connection;
    const runsCollection = db.collection("detector_runs");

    // Create indexes
    await runsCollection.createIndex({ started_at: -1 });
    await runsCollection.createIndex({ status: 1, started_at: -1 });
    await runsCollection.createIndex({ detector_version: 1, started_at: -1 });
    await runsCollection.createIndex({ run_id: 1 }, { unique: true });

    // Clear existing docs
    await runsCollection.deleteMany({});

    const now = new Date();
    const runs = [
      {
        run_id: "detector-run-20260506-001",
        execution_name:
          "projects/streamjacking/locations/us-central1/jobs/detector/executions/detector-run-20260506-001",
        job_name: "streamjacking-detector",
        started_at: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        completed_at: new Date(now.getTime() - 24 * 60 * 60 * 1000 + 3600000),
        duration_seconds: 3600,
        status: "succeeded",
        task_count: 1,
        succeeded_count: 1,
        failed_count: 0,
        cancelled_count: 0,
        triggered_by: "detector-service@streamjacking.iam.gserviceaccount.com",
        is_scheduled: true,
        log_uri:
          "https://console.cloud.google.com/logs/query?project=streamjacking&query=resource.labels.execution_name%3D%22projects%2Fstreamjacking%2Flocations%2Fus-central1%2Fjobs%2Fdetector%2Fexecutions%2Fdetector-run-20260506-001%22",
        detector_version: "V3",
        search_queries: ["streamjacking", "live takeover", "channel hijack"],
        stats: {
          videos_processed: 150,
          videos_detected: 12,
          new_detections: 8,
          re_detections: 4,
          live_at_detection: 10,
          errors: 0,
          by_risk: { LOW: 3, MEDIUM: 5, HIGH: 4 },
        },
        error_message: null,
        labels: { environment: "production", triggered_by: "schedule" },
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000 + 3600000),
      },
      {
        run_id: "detector-run-20260505-001",
        execution_name:
          "projects/streamjacking/locations/us-central1/jobs/detector/executions/detector-run-20260505-001",
        job_name: "streamjacking-detector",
        started_at: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        completed_at: new Date(now.getTime() - 12 * 60 * 60 * 1000 + 1800000),
        duration_seconds: 1800,
        status: "succeeded",
        task_count: 1,
        succeeded_count: 1,
        failed_count: 0,
        cancelled_count: 0,
        triggered_by: "detector-service@streamjacking.iam.gserviceaccount.com",
        is_scheduled: true,
        log_uri:
          "https://console.cloud.google.com/logs/query?project=streamjacking&query=resource.labels.execution_name%3D%22projects%2Fstreamjacking%2Flocations%2Fus-central1%2Fjobs%2Fdetector%2Fexecutions%2Fdetector-run-20260505-001%22",
        detector_version: "V3",
        search_queries: ["live stream scam"],
        stats: {
          videos_processed: 85,
          videos_detected: 5,
          new_detections: 3,
          re_detections: 2,
          live_at_detection: 4,
          errors: 0,
          by_risk: { LOW: 1, MEDIUM: 2, HIGH: 2 },
        },
        error_message: null,
        labels: { environment: "production" },
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000 + 1800000),
      },
      {
        run_id: "detector-run-20260506-002",
        execution_name:
          "projects/streamjacking/locations/us-central1/jobs/detector/executions/detector-run-20260506-002",
        job_name: "streamjacking-detector",
        started_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        completed_at: null,
        duration_seconds: null,
        status: "running",
        task_count: 1,
        succeeded_count: 0,
        failed_count: 0,
        cancelled_count: 0,
        triggered_by: "user@example.com",
        is_scheduled: false,
        log_uri:
          "https://console.cloud.google.com/logs/query?project=streamjacking&query=resource.labels.execution_name%3D%22projects%2Fstreamjacking%2Flocations%2Fus-central1%2Fjobs%2Fdetector%2Fexecutions%2Fdetector-run-20260506-002%22",
        detector_version: "V3",
        search_queries: ["test query"],
        stats: {
          videos_processed: 0,
          videos_detected: 0,
          new_detections: 0,
          re_detections: 0,
          live_at_detection: 0,
          errors: 0,
          by_risk: { LOW: 0, MEDIUM: 0, HIGH: 0 },
        },
        error_message: null,
        labels: { environment: "debug" },
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        run_id: "detector-run-20260504-001",
        execution_name:
          "projects/streamjacking/locations/us-central1/jobs/detector/executions/detector-run-20260504-001",
        job_name: "streamjacking-detector",
        started_at: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        completed_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 900000),
        duration_seconds: 900,
        status: "failed",
        task_count: 1,
        succeeded_count: 0,
        failed_count: 1,
        cancelled_count: 0,
        triggered_by: "detector-service@streamjacking.iam.gserviceaccount.com",
        is_scheduled: true,
        log_uri:
          "https://console.cloud.google.com/logs/query?project=streamjacking&query=resource.labels.execution_name%3D%22projects%2Fstreamjacking%2Flocations%2Fus-central1%2Fjobs%2Fdetector%2Fexecutions%2Fdetector-run-20260504-001%22",
        detector_version: "V2",
        search_queries: ["outdated detector run"],
        stats: {
          videos_processed: 45,
          videos_detected: 0,
          new_detections: 0,
          re_detections: 0,
          live_at_detection: 0,
          errors: 45,
          by_risk: { LOW: 0, MEDIUM: 0, HIGH: 0 },
        },
        error_message: "Connection timeout to YouTube API",
        labels: { environment: "production", error: "api_timeout" },
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 900000),
      },
    ];

    await runsCollection.insertMany(runs);
    console.log("✓ Seeded 4 detector runs");
    console.log("");
    console.log("Run IDs:");
    runs.forEach((r) => console.log(`  - ${r.run_id} (${r.status})`));

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seedRuns();
