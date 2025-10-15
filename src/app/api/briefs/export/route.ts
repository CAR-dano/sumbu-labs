import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BriefSubmission from "@/models/BriefSubmission";
import { verifyAuth } from "@/lib/auth";
import { formatBudgetRange, formatTimeline } from "@/lib/helpers";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const budgetRange = searchParams.get("budgetRange") || "";
    const starred = searchParams.get("starred") === "true";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build query (same as list)
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (budgetRange) {
      query.budgetRange = budgetRange;
    }

    if (starred) {
      query.starred = true;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {} as Record<string, Date>;
      if (dateFrom) {
        (query.createdAt as Record<string, Date>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        (query.createdAt as Record<string, Date>).$lte = new Date(dateTo);
      }
    }

    const briefs = await BriefSubmission.find(query).sort("-createdAt").lean();

    // Generate CSV
    const headers = [
      "ID",
      "Full Name",
      "Company",
      "Email",
      "Phone",
      "Project Title",
      "Project Types",
      "Budget Range",
      "Timeline",
      "Start Date",
      "Goals",
      "Problems",
      "Features",
      "Platforms",
      "Status",
      "Starred",
      "NDA Required",
      "Submitted At",
      "Internal Notes",
    ];

    const csvRows = [headers.join(",")];

    briefs.forEach((brief) => {
      const row = [
        brief._id.toString(),
        `"${brief.fullName || ""}"`,
        `"${brief.company || ""}"`,
        brief.email || "",
        brief.phone || "",
        `"${brief.projectTitle || ""}"`,
        `"${(brief.projectType || []).join(", ")}"`,
        brief.budgetRange ? formatBudgetRange(brief.budgetRange) : "",
        brief.timeline ? formatTimeline(brief.timeline) : "",
        brief.startDateTarget
          ? new Date(brief.startDateTarget).toLocaleDateString()
          : "",
        `"${(brief.goals || "").replace(/"/g, '""')}"`,
        `"${(brief.problems || "").replace(/"/g, '""')}"`,
        `"${(brief.scopeFeatures || []).join(", ")}"`,
        `"${(brief.platforms || []).join(", ")}"`,
        brief.status || "",
        brief.starred ? "Yes" : "No",
        brief.ndaRequired ? "Yes" : "No",
        new Date(brief.createdAt).toLocaleString(),
        `"${(brief.internalNotes || "").replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csv = csvRows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="brief-submissions-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
