import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
import { verifyAuth } from "@/lib/auth";

// GET all roles
export async function GET() {
  try {
    await connectDB();

    const roles = await Role.find().sort({ name: 1 }).lean();

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// POST create new role
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Core team can create roles
    if (auth.category !== "Core") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return NextResponse.json(
        { error: "Role already exists" },
        { status: 409 }
      );
    }

    const newRole = await Role.create({
      name,
      description,
    });

    return NextResponse.json({
      role: {
        id: newRole._id,
        name: newRole.name,
        description: newRole.description,
      },
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}
