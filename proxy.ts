import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  // Let Server Actions through — they handle their own auth internally
  const isServerAction =
    request.method === "POST" && request.headers.get("next-action") !== null;

  if (isServerAction) {
    return NextResponse.next();
  }

  return auth.middleware({
    loginUrl: "/auth/sign-in",
  })(request);
}

export const config = {
  matcher: [
    "/home",
    "/settings",
    "/group/create",
    "/groups",
    "/group/:path*",
    "/search",
  ],
};
