import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeamMember from "@/models/TeamMember";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Role from "@/models/Role"; // Import Role model to register it with Mongoose

export async function GET() {
  try {
    await connectDB();

    const members = await TeamMember.find({ isActive: true })
      .populate("role")
      .select("fullName nickname photoUrl role")
      .sort({ fullName: 1 })
      .lean();

    const formattedMembers = members.map((member) => {
      const role = member.role as unknown as { name: string };
      return {
        id: member._id,
        fullName: member.fullName,
        nickname: member.nickname,
        photoUrl: member.photoUrl,
        roleName: role.name,
      };
    });

    return NextResponse.json({ members: formattedMembers });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
