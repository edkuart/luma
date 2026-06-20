import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminLoginRoute = pathname.startsWith("/admin/login");
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isProtectedAdminRoute || isAdminLoginRoute) {
    return NextResponse.next();
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const sessionToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (
    sessionSecret &&
    sessionToken &&
    (await verifyAdminSessionToken(sessionToken, sessionSecret))
  ) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", `${pathname}${req.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin(.*)", "/api/admin(.*)"],
};
