"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  username?: string;
  displayName?: string;
}

export function Header({ username, displayName }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
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
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-slate-900">
            <LogOut className="h-4 w-4 mr-1.5" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
