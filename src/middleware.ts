import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Hardcode cookie name to ensure consistency
const ADMIN_COOKIE_NAME = "sb_admin_token";
// Edge runtime needs inline JWT_SECRET
const JWT_SECRET = new TextEncoder().encode("supersecretjwt");

async function verifyJwtMiddleware(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    // Debug log
    console.log("Middleware check for:", pathname);
    console.log("Cookie name:", ADMIN_COOKIE_NAME);
    console.log("Token exists:", !!token);
    console.log("All cookies:", request.cookies.getAll());

    if (!token || !(await verifyJwtMiddleware(token))) {
      console.log("Redirecting to login - no valid token");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    console.log("Token valid, allowing access");
  }

  // Protect API mutations
  const isProjectMutation =
    pathname.match(/^\/api\/projects/) &&
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH" ||
      request.method === "DELETE");

  const isUpload = pathname === "/api/uploads" && request.method === "POST";

  if (isProjectMutation || isUpload) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !(await verifyJwtMiddleware(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/uploads"],
};
