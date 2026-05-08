"use client";

import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  username?: string;
  displayName?: string;
}

export function Header({ username, displayName }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const isDashboard = pathname?.startsWith("/dashboard");
  const isRuns = pathname?.startsWith("/runs");

  return (
    <header className="border-b border-slate-200 bg-white shrink-0">
      <div className="h-14 px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ShieldAlert className="h-5 w-5 text-slate-700" />
          <span className="font-semibold text-slate-900">Streamjacking Evaluator</span>
        </Link>

        {username && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <User className="h-4 w-4" />
              <span>{displayName || username}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>
        )}
      </div>

      {username && (
        <div className="h-10 px-6 border-t border-slate-100 flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              isDashboard ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/runs"
            className={`text-sm font-medium transition-colors ${
              isRuns ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Runs
          </Link>
        </div>
      )}
    </header>
  );
}
