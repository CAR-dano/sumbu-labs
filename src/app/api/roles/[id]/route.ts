import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
import TeamMember from "@/models/TeamMember";
import { verifyAuth } from "@/lib/auth";

// PATCH update role
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Core team can update roles
    if (auth.category !== "Core") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    await connectDB();

    const updateData: Record<string, string> = {};
    if (body.name) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;

    const updatedRole = await Role.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({
      role: {
        id: updatedRole._id,
        name: updatedRole.name,
        description: updatedRole.description,
      },
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

// DELETE role
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Core team can delete roles
    if (auth.category !== "Core") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    await connectDB();

    // Check if role is in use
    const membersUsingRole = await TeamMember.countDocuments({ role: id });
    if (membersUsingRole > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete role. ${membersUsingRole} team member(s) are assigned to this role.`,
        },
        { status: 409 }
      );
    }

    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
