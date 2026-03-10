import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongoose";
import { Reviewer } from "@/lib/models/Reviewer";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const reviewer = await Reviewer.findOne({ username: username.toLowerCase().trim() });

    if (!reviewer) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, reviewer.password_hash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Parse expiry (e.g. "7d" → 7 days in seconds)
    const expiresInSeconds = parseExpiry(JWT_EXPIRES_IN);

    const token = await new SignJWT({
      sub: reviewer.username,
      name: reviewer.display_name || reviewer.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      username: reviewer.username,
      display_name: reviewer.display_name || reviewer.username,
    });

    response.cookies.set("sj_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60; // default 7d
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return value * (multipliers[unit] || 86400);
}
