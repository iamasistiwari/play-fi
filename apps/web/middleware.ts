import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    // If no token, redirect to sign in
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/signout")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const { pathname } = request.nextUrl;
    if (pathname === "/" && payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/signout"],
};
