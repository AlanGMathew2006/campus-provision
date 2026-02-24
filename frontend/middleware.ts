import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "cp_auth";
const PROTECTED_PATHS = ["/dashboard", "/meals", "/spending"];
const PUBLIC_AUTH_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuth = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (PUBLIC_AUTH_PATHS.includes(pathname) && hasAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!hasAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meals/:path*",
    "/spending/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
