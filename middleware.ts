import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const isAuthPage = request.nextUrl.pathname === "/login" || 
                     request.nextUrl.pathname === "/verify-otp";

  // Always verify token validity
  const isValidToken = authToken ? await verifyToken(authToken.value) : false;

  // If user is on the root path, redirect to login
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is not authenticated and trying to access protected routes
  if (!isValidToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access auth pages
  if (isValidToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};