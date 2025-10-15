import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { projectCreateSchema } from "@/lib/zod";
import Project, { generateUniqueSlug } from "@/models/Project";

// GET /api/projects - Public endpoint with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "published";
    const q = searchParams.get("q") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const sort = searchParams.get("sort") || "order";
    const order = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const query: Record<
      string,
      string | { $regex: string; $options: string } | { $in: string[] }
    > = {};

    if (status) {
      query.status = status;
    }

    if (q) {
      query.title = { $regex: q, $options: "i" };
    }

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (categories.length > 0) {
      query.categories = { $in: categories };
    }

    const sortObj: Record<string, 1 | -1> = {};
    if (sort === "order") {
      sortObj.order = order === "desc" ? -1 : 1;
      sortObj.createdAt = -1;
    } else if (sort === "createdAt") {
      sortObj.createdAt = order === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST /api/projects - Protected endpoint
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const validation = projectCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate unique slug
    const slug = await generateUniqueSlug(data.title);

    const project = await Project.create({
      ...data,
      slug,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
