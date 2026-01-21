import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const getJwtSecret = () => process.env.JWT_SECRET;
const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "sb_admin_token";

export interface JwtPayload {
  // For team member login
  memberId?: string;
  fullName?: string;
  category?: "Core" | "Member";
  role?: string;
  // Standard JWT fields
  iat?: number;
  exp?: number;
}

export function signJwt(
  payload: JwtPayload,
  expiresIn: string | number = "7d"
): string {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    throw new Error("Please define JWT_SECRET in .env.local");
  }

  return jwt.sign(payload, jwtSecret, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt(token: string): JwtPayload | null {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return null;
  }

  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // Set to true in production only
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);
  return token?.value || null;
}

export async function verifyAuth(): Promise<JwtPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyJwt(token);
}
