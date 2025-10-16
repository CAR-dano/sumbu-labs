import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import TeamMember from "@/models/TeamMember";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Role from "@/models/Role"; // Import Role model to register it with Mongoose

export async function GET() {
  try {
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const member = await TeamMember.findById(auth.memberId)
      .populate("role")
      .select("-pin")
      .lean();

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const role = member.role as unknown as { _id: string; name: string };

    return NextResponse.json({
      member: {
        id: member._id,
        fullName: member.fullName,
        nickname: member.nickname,
        role: {
          id: role._id,
          name: role.name,
        },
        category: member.category,
        skills: member.skills,
        bio: member.bio,
        photoUrl: member.photoUrl,
        isActive: member.isActive,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
