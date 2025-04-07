import { NextResponse } from "next/server";

export function middleware(request) {
  const authToken = request.cookies.get("auth_token")?.value;

  const protectedRoutes = ["/dashboard"];

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
