import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BriefSubmission from "@/models/BriefSubmission";
import { briefSubmissionSchema } from "@/lib/zod";
import { hashIP, sanitizeString } from "@/lib/helpers";
import { verifyAuth } from "@/lib/auth";

// Rate limiting store (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ipHash: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ipHash);

  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ipHash, {
      count: 1,
      resetAt: now + 30 * 60 * 1000, // 30 minutes
    });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

// POST - Public submission
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    // Validate with Zod
    const validation = briefSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Get IP and User Agent
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIP(ip);
    const ua = req.headers.get("user-agent") || "unknown";

    // Rate limit check
    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Sanitize strings
    const sanitized = {
      ...data,
      fullName: sanitizeString(data.fullName),
      company: data.company ? sanitizeString(data.company) : undefined,
      projectTitle: data.projectTitle
        ? sanitizeString(data.projectTitle)
        : undefined,
      goals: data.goals ? sanitizeString(data.goals) : undefined,
      problems: data.problems ? sanitizeString(data.problems) : undefined,
      locationTimezone: data.locationTimezone
        ? sanitizeString(data.locationTimezone)
        : undefined,
    };

    // Create submission
    const submission = await BriefSubmission.create({
      ...sanitized,
      ipHash,
      ua,
      status: "new",
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return NextResponse.json(
      {
        ok: true,
        id: (submission._id as { toString: () => string }).toString(),
        message: "Brief submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Brief submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit brief" },
      { status: 500 }
    );
  }
}

// GET - Admin list (protected)
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const budgetRange = searchParams.get("budgetRange") || "";
    const starred = searchParams.get("starred") === "true";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "-createdAt";

    // Build query
    const query: Record<string, unknown> = {};

    if (q) {
      query.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { projectTitle: { $regex: q, $options: "i" } },
      ];
    }

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

    // Execute query
    const [briefs, total] = await Promise.all([
      BriefSubmission.find(query)
        .select(
          "fullName company email projectType budgetRange timeline status starred createdAt"
        )
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BriefSubmission.countDocuments(query),
    ]);

    return NextResponse.json({
      briefs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get briefs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch briefs" },
      { status: 500 }
    );
  }
}
