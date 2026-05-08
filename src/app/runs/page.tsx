import { Suspense } from "react";
import { RunsClient } from "@/components/runs/RunsClient";

export default function RunsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <RunsClient />
    </Suspense>
  );
}
