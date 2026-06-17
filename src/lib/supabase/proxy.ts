import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import { isStaleAuthSessionError } from "@/lib/supabase/auth-errors";
import type { Database } from "@/types/database.types";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const { error } = await supabase.auth.getClaims();
    if (isStaleAuthSessionError(error)) {
      clearSupabaseAuthCookies(request, response);
    }
  } catch (error) {
    if (isStaleAuthSessionError(error)) {
      clearSupabaseAuthCookies(request, response);
    }
  }

  return response;
};

function clearSupabaseAuthCookies(
  request: NextRequest,
  response: NextResponse,
) {
  request.cookies.getAll().forEach(({ name }) => {
    if (!isSupabaseAuthCookie(name)) return;

    request.cookies.delete(name);
    response.cookies.delete(name);
  });
}

function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-") && name.includes("-auth-token");
}
