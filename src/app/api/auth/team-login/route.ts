import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeamMember from "@/models/TeamMember";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Role, { type IRole } from "@/models/Role";
import { signJwt } from "@/lib/auth";

const ADMIN_COOKIE_NAME = "sb_admin_token";

// Simple rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.lastAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  record.lastAttempt = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { memberId, pin } = body;

    if (!memberId || !pin) {
      return NextResponse.json(
        { error: "Member ID and PIN are required" },
        { status: 400 }
      );
    }

    if (pin.length < 4 || pin.length > 6) {
      return NextResponse.json(
        { error: "PIN must be 4-6 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find team member and populate role
    const member = await TeamMember.findById(memberId).populate("role");

    if (!member) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!member.isActive) {
      return NextResponse.json(
        { error: "Account is disabled. Please contact administrator." },
        { status: 403 }
      );
    }

    // Verify PIN
    const isPinValid = await member.comparePin(pin);

    if (!isPinValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const role = member.role as unknown as IRole;
    const token = signJwt(
      {
        memberId: String(member._id),
        fullName: member.fullName,
        category: member.category,
        role: role.name,
      },
      "7d"
    );

    // Create response with cookie
    const response = NextResponse.json({
      ok: true,
      member: {
        id: member._id,
        fullName: member.fullName,
        nickname: member.nickname,
        category: member.category,
        role: role.name,
        photoUrl: member.photoUrl,
      },
    });

    // Set cookie directly in response
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
