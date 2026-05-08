import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { DetectorRun } from "@/lib/models/DetectorRun";
import { PAGE_SIZE } from "@/lib/constants";
import { DetectorVersion, RunStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = parseInt(searchParams.get("limit") || String(PAGE_SIZE));
    const status = searchParams.get("status") || "all";
    const detector_version = searchParams.get("detector_version") || "all";

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (status !== "all") {
      filter.status = status as RunStatus;
    }

    if (detector_version !== "all") {
      filter.detector_version = detector_version as DetectorVersion;
    }

    const skip = (page - 1) * limit;

    // Run query and count in parallel
    const [runs, total] = await Promise.all([
      DetectorRun.find(filter).sort({ started_at: -1 }).skip(skip).limit(limit).lean(),
      DetectorRun.countDocuments(filter),
    ]);

    // Serialize _id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized = runs.map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      started_at: new Date(r.started_at).toISOString(),
      completed_at: r.completed_at ? new Date(r.completed_at).toISOString() : null,
      created_at: new Date(r.created_at).toISOString(),
    }));

    return NextResponse.json({
      runs: serialized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/runs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
