import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/projects-by-slug/[slug] - Public endpoint
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { slug } = await params;
    const project = await Project.findOne({ slug, status: "published" }).lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET project by slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
