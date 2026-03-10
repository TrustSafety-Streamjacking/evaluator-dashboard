import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Video } from "@/lib/models/Video";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    await connectToDatabase();

    const video = await Video.findOne({ video_id: videoId }).lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized = { ...(video as any), _id: (video as any)._id.toString() };
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/videos/[videoId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
