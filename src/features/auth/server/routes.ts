import { type NextRequest, NextResponse } from "next/server";
import { getRequestOrigin, safeRedirectPath } from "@/lib/routing/redirect";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/shared/server/auth";

export async function handleAuthCallback(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const requestOrigin = getRequestOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const next = safeRedirectPath(
    requestUrl.searchParams.get("next"),
    "/auth/continue",
  );

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestOrigin));
}

export async function handleAuthContinue(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const requestOrigin = getRequestOrigin(request);
  const next = safeRedirectPath(requestUrl.searchParams.get("next"), "/");
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    const authUrl = new URL("/auth", requestOrigin);
    authUrl.searchParams.set("next", next);
    return NextResponse.redirect(authUrl);
  }

  if (!currentUser.profile?.hasDisplayName) {
    return NextResponse.redirect(new URL("/setup", requestOrigin));
  }

  return NextResponse.redirect(new URL(next, requestOrigin));
}
