import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeamMember from "@/models/TeamMember";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Role from "@/models/Role"; // Import Role model to register it with Mongoose
import { verifyAuth } from "@/lib/auth";
import { processLinks, validateSlogan, stripHtml } from "@/lib/link-utils";
import bcrypt from "bcryptjs";

// GET single team member
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDB();

    const member = await TeamMember.findById(id).populate("role").lean();

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
        slogan: member.slogan || "",
        photoUrl: member.photoUrl,
        links: member.links || [],
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

// PATCH update team member
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Members can only edit themselves, Core can edit anyone
    if (auth.category !== "Core" && auth.memberId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const updateData: Record<string, unknown> = {};

    if (body.fullName) updateData.fullName = body.fullName;
    if (body.nickname !== undefined) updateData.nickname = body.nickname;
    if (body.skills) updateData.skills = body.skills;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl;

    // Handle slogan update (Members can edit their own)
    if (body.slogan !== undefined) {
      const sloganText = stripHtml(body.slogan);
      const sloganValidation = validateSlogan(sloganText);
      if (!sloganValidation.valid) {
        return NextResponse.json(
          { error: sloganValidation.errors.join(", ") },
          { status: 400 }
        );
      }
      updateData.slogan = sloganText;
    }

    // Handle links update (Members can edit their own)
    if (body.links !== undefined) {
      if (body.links.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 links allowed per member" },
          { status: 400 }
        );
      }
      try {
        updateData.links = processLinks(body.links);
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Invalid links" },
          { status: 400 }
        );
      }
    }

    // Only Core can change these
    if (auth.category === "Core") {
      if (body.role) updateData.role = body.role;
      if (body.category) updateData.category = body.category;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
    }

    // Handle PIN change separately
    if (body.pin) {
      if (body.pin.length !== 6) {
        return NextResponse.json(
          { error: "PIN must be exactly 6 digits" },
          { status: 400 }
        );
      }

      if (!/^\d+$/.test(body.pin)) {
        return NextResponse.json(
          { error: "PIN must contain only numbers" },
          { status: 400 }
        );
      }

      // Hash PIN before saving (since findByIdAndUpdate bypasses pre-save hooks)
      const salt = await bcrypt.genSalt(10);
      updateData.pin = await bcrypt.hash(body.pin, salt);
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("role");

    if (!updatedMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const role = updatedMember.role as unknown as { _id: string; name: string };

    return NextResponse.json({
      member: {
        id: updatedMember._id,
        fullName: updatedMember.fullName,
        nickname: updatedMember.nickname,
        role: {
          id: role._id,
          name: role.name,
        },
        category: updatedMember.category,
        skills: updatedMember.skills,
        bio: updatedMember.bio,
        slogan: updatedMember.slogan,
        photoUrl: updatedMember.photoUrl,
        links: updatedMember.links,
        isActive: updatedMember.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE team member
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Core can delete
    if (auth.category !== "Core") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    await connectDB();

    const deletedMember = await TeamMember.findByIdAndDelete(id);

    if (!deletedMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
