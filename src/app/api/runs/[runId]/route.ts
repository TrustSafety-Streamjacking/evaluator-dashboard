import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { DetectorRun } from "@/lib/models/DetectorRun";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await context.params;
    await connectToDatabase();

    const run = await DetectorRun.findOne({ run_id: runId }).lean();

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    // Serialize _id and dates
    const serialized = {
      ...run,
      _id: run._id.toString(),
      started_at: new Date(run.started_at).toISOString(),
      completed_at: run.completed_at ? new Date(run.completed_at).toISOString() : null,
      created_at: new Date(run.created_at).toISOString(),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/runs/[runId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
