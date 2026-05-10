import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { getCurrentUser } from "@/lib/easyqa/data";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = safeRedirectPath(requestUrl.searchParams.get("next"), "/");
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    const authUrl = new URL("/auth", requestUrl.origin);
    authUrl.searchParams.set("next", next);
    return NextResponse.redirect(authUrl);
  }

  if (!currentUser.profile?.hasDisplayName) {
    return NextResponse.redirect(new URL("/setup", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
