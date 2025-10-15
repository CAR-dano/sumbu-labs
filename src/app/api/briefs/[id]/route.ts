import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BriefSubmission from "@/models/BriefSubmission";
import { briefUpdateSchema } from "@/lib/zod";
import { verifyAuth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Detail (admin protected)
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await verifyAuth();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const brief = await BriefSubmission.findById(id).lean();

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    return NextResponse.json(brief);
  } catch (error) {
    console.error("Get brief error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brief" },
      { status: 500 }
    );
  }
}

// PATCH - Update (admin protected)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await verifyAuth();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Validate update data
    const validation = briefUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const brief = await BriefSubmission.findByIdAndUpdate(
      id,
      { $set: validation.data },
      { new: true, runValidators: true }
    );

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      brief,
      message: "Brief updated successfully",
    });
  } catch (error) {
    console.error("Update brief error:", error);
    return NextResponse.json(
      { error: "Failed to update brief" },
      { status: 500 }
    );
  }
}

// DELETE - Hard delete (admin protected)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await verifyAuth();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const brief = await BriefSubmission.findByIdAndDelete(id);

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    // TODO: Delete associated files from public/uploads/briefs/<id>/

    return NextResponse.json({
      ok: true,
      message: "Brief deleted successfully",
    });
  } catch (error) {
    console.error("Delete brief error:", error);
    return NextResponse.json(
      { error: "Failed to delete brief" },
      { status: 500 }
    );
  }
}
