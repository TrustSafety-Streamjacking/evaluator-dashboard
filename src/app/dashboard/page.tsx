import { Suspense } from "react";
import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
