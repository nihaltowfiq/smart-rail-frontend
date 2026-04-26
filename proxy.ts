import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/signin", "/signup"];
const PRIVATE_ROUTES = ["/", "/bookings", "/trains", "/profile"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isPrivate = PRIVATE_ROUTES.includes(pathname);

  if (!token && isPrivate) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/bookings",
    "/trains",
    "/profile",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
