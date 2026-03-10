import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/mongoose";
import { Video } from "@/lib/models/Video";
import { Header } from "@/components/shared/Header";
import { VideoDetailClient } from "./VideoDetailClient";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { videoId } = await params;

  // Get reviewer info from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("sj_token")?.value;
  let username = "";
  let displayName = "";

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      username = String(payload.sub ?? "");
      displayName = String(payload.name ?? payload.sub ?? "");
    } catch {
      // handled by middleware
    }
  }

  await connectToDatabase();

  const video = await Video.findOne({ video_id: videoId }).lean();
  if (!video) notFound();

  // Find adjacent unlabeled videos for prev/next navigation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = video as any;

  const unlabeledFilter = {
    $or: [{ ground_truth_label: null }, { ground_truth_label: { $exists: false } }],
  };

  const [prevVideo, nextVideo] = await Promise.all([
    Video.findOne({
      ...unlabeledFilter,
      total_risk_score: { $gt: v.total_risk_score ?? 0 },
    })
      .sort({ total_risk_score: 1 })
      .select("video_id")
      .lean(),
    Video.findOne({
      ...unlabeledFilter,
      total_risk_score: { $lt: v.total_risk_score ?? 0 },
    })
      .sort({ total_risk_score: -1 })
      .select("video_id")
      .lean(),
  ]);

  // Serialize
  const serialized = { ...v, _id: v._id.toString() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevId = prevVideo ? (prevVideo as any).video_id : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextId = nextVideo ? (nextVideo as any).video_id : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header username={username} displayName={displayName} />
      <VideoDetailClient
        video={serialized}
        prevVideoId={prevId}
        nextVideoId={nextId}
      />
    </div>
  );
}
