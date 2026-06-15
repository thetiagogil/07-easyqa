import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getDemoUserEnv, getSupabaseEnv } from "@/lib/env";
import { getRequestOrigin, safeRedirectPath } from "@/lib/routing/redirect";
import type { Database } from "@/types/database.types";

export async function POST(request: NextRequest) {
  const requestOrigin = getRequestOrigin(request);
  const formData = await request.formData();
  const next = safeRedirectPath(formData.get("next")?.toString(), "/");
  const failureUrl = new URL("/auth", requestOrigin);
  failureUrl.searchParams.set("next", next);

  try {
    const { email, password } = getDemoUserEnv();
    const continueUrl = new URL("/auth/continue", requestOrigin);
    continueUrl.searchParams.set("next", next);
    const successResponse = NextResponse.redirect(continueUrl, { status: 303 });
    const { url, publishableKey } = getSupabaseEnv();
    const supabase = createServerClient<Database>(url, publishableKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            successResponse.cookies.set(name, value, options);
          });
        },
      },
    });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      failureUrl.searchParams.set("error", "Demo account is unavailable.");
      return NextResponse.redirect(failureUrl, { status: 303 });
    }

    return successResponse;
  } catch {
    failureUrl.searchParams.set("error", "Demo account is not configured.");
    return NextResponse.redirect(failureUrl, { status: 303 });
  }
}
