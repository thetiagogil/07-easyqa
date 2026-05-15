import { type NextRequest, NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/shared/server/auth";

export async function handleAuthCallback(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeRedirectPath(requestUrl.searchParams.get("next"), "/auth/continue");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

export async function handleAuthContinue(request: NextRequest) {
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
