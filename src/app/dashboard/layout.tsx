import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { Header } from "@/components/shared/Header";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      // Token invalid — middleware will redirect, but render header gracefully
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header username={username} displayName={displayName} />
      {children}
    </div>
  );
}
