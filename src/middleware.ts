import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");

const PROTECTED_PAGE_PATHS = ["/dashboard", "/videos"];
const PROTECTED_API_PATHS = ["/api/videos"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sj_token")?.value;

  const isProtectedPage = PROTECTED_PAGE_PATHS.some((p) => pathname.startsWith(p));
  const isProtectedApi = PROTECTED_API_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const response = NextResponse.next();
    // Pass reviewer identity to API routes via headers
    if (payload.sub) {
      response.headers.set("x-reviewer-username", payload.sub);
      response.headers.set("x-reviewer-name", String(payload.name ?? payload.sub));
    }
    return response;
  } catch {
    // Invalid or expired token
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("sj_token");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/videos/:path*", "/api/videos/:path*"],
};
