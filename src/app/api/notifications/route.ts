import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import camelcaseKeys from "camelcase-keys";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const userId = Number(searchedParams.userId);
  const limit = Number(searchedParams.limit || 10);
  const offset = Number(searchedParams.offset || 0);

  // Validate required fields
  if (!userId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get notifications by userId
  const { data: notifications, error: getNotificationsError } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", Number(userId))
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (getNotificationsError) {
    return apiError(getNotificationsError);
  }

  // Return
  return NextResponse.json(camelcaseKeys(notifications, { deep: true }));
}
