import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { DetectorRun } from "@/lib/models/DetectorRun";
import { RunDetailCard } from "@/components/runs/RunDetailCard";
import { DetectorRunDocument } from "@/lib/types";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;

  try {
    await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const run = (await DetectorRun.findOne({ run_id: runId }).lean()) as any;

    if (!run) {
      notFound();
    }

    // Serialize _id and dates
    const serialized: DetectorRunDocument = {
      ...run,
      _id: run._id.toString(),
      started_at: new Date(run.started_at).toISOString(),
      completed_at: run.completed_at ? new Date(run.completed_at).toISOString() : null,
      created_at: new Date(run.created_at).toISOString(),
    };

    return <RunDetailCard run={serialized} />;
  } catch (error) {
    console.error("Error fetching run:", error);
    notFound();
  }
}
