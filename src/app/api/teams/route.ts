import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeamMember from "@/models/TeamMember";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Role from "@/models/Role"; // Import Role model to register it with Mongoose
import { verifyAuth } from "@/lib/auth";

// GET all team members
export async function GET() {
  try {
    await connectDB();

    const members = await TeamMember.find()
      .populate("role")
      .sort({ category: 1, fullName: 1 })
      .lean();

    const formattedMembers = members.map((member) => {
      const role = member.role as unknown as { _id: string; name: string };
      return {
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
        slogan: member.slogan || "",
        photoUrl: member.photoUrl,
        links: member.links || [],
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
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

// POST create new team member
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Core team can create members
    if (auth.category !== "Core") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      fullName,
      nickname,
      role,
      category,
      skills,
      bio,
      slogan,
      photoUrl,
      links,
      pin,
    } = body;

    if (!fullName || !role || !category || !pin) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const newMember = await TeamMember.create({
      fullName,
      nickname,
      role,
      category,
      skills: skills || [],
      bio,
      slogan: slogan || "",
      photoUrl,
      links: links || [],
      pin,
      isActive: true,
    });

    await newMember.populate("role");

    const roleData = newMember.role as unknown as { _id: string; name: string };

    return NextResponse.json({
      member: {
        id: newMember._id,
        fullName: newMember.fullName,
        nickname: newMember.nickname,
        role: {
          id: roleData._id,
          name: roleData.name,
        },
        category: newMember.category,
        skills: newMember.skills,
        bio: newMember.bio,
        slogan: newMember.slogan,
        photoUrl: newMember.photoUrl,
        links: newMember.links,
        isActive: newMember.isActive,
      },
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
