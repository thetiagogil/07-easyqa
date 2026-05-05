import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const userId = Number(searchedParams.userId);

  // Validate required fields
  if (!userId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get unread notifications count by userId
  const { count: unreadNotificationsCount, error: getUnreadNotificationsCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", Number(userId))
    .eq("is_read", false);

  if (getUnreadNotificationsCount) {
    return apiError(getUnreadNotificationsCount);
  }

  // Return
  return NextResponse.json(unreadNotificationsCount);
}
