import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId } = body;

  // Validate required fields
  if (!userId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Update is_read status on notifications by userId
  const { error: updateNotificationsError } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (updateNotificationsError) {
    return apiError(updateNotificationsError);
  }

  // Return
  return NextResponse.json({ success: true });
}
