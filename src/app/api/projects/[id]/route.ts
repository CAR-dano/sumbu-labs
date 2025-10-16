import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { projectUpdateSchema } from "@/lib/zod";
import Project, { generateUniqueSlug } from "@/models/Project";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/projects/[id] - Protected endpoint
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Protected endpoint
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const validation = projectUpdateSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // If title changed, regenerate slug
    if (data.title) {
      const project = await Project.findById(id);
      if (project && project.title !== data.title) {
        data.slug = await generateUniqueSlug(data.title, id);
      }
    }

    // Prepare update object - explicitly handle categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = { ...data };

    // Explicitly set categories if present
    if (data.categories && Array.isArray(data.categories)) {
      updateData.categories = data.categories;
    }

    // Track who updated - only if user is a team member (not admin)
    if ("memberId" in user) {
      updateData.updatedBy = user.memberId;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      strict: false,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Protected endpoint (same as PUT)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}

// DELETE /api/projects/[id] - Protected endpoint
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
