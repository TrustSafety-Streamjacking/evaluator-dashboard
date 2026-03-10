import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongoose";
import { Video } from "@/lib/models/Video";
import { LabelRequest, LabelValue } from "@/lib/types";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");

const VALID_LABELS: LabelValue[] = [
  "true_positive",
  "false_positive",
  "true_negative",
  "false_negative",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    // Extract reviewer from JWT cookie (server-side — not trusting client body)
    const token = request.cookies.get("sj_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const reviewer = String(payload.sub);

    const body: LabelRequest = await request.json();
    const { label, reasoning } = body;

    if (!label || !VALID_LABELS.includes(label)) {
      return NextResponse.json({ error: "Invalid label value" }, { status: 400 });
    }

    await connectToDatabase();

    const now = new Date().toISOString();

    const updated = await Video.findOneAndUpdate(
      { video_id: videoId },
      {
        $set: {
          ground_truth_label: label,
          validated_at: now,
          validation_reasoning: reasoning ?? null,
          validation: {
            label,
            reviewed_at: now,
            reviewer,
          },
        },
      },
      { new: true, lean: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized = { ...(updated as any), _id: (updated as any)._id.toString() };
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("PATCH /api/videos/[videoId]/label error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
