import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { followerId, followingId } = await body;

  // Validate required fields
  if (!followerId || !followingId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  if (followerId === followingId) {
    return apiError("You cannot follow yourself", 400);
  }

  // Check if viewer is already following the target user
  const { count: isFollowingCount, error: isFollowingCountError } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (isFollowingCountError) {
    return apiError(isFollowingCountError);
  }

  if (isFollowingCount && isFollowingCount > 0) {
    return apiError("Already following", 409);
  }

  // Create follow (if not already following)
  const { error: createFollowError } = await supabase.from("follows").insert([
    {
      follower_id: followerId,
      following_id: followingId,
      followed_at: dayjs().toISOString(),
    },
  ]);

  if (createFollowError) {
    return apiError(createFollowError);
  }

  // Create notification to target user
  await supabase.from("notifications").insert({
    user_id: followingId,
    type: "followed",
    related_id: followerId,
  });

  // Return
  return NextResponse.json({ message: SUCCESS_MESSAGES.FOLLOWS.FOLLOW }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const followerId = Number(searchedParams.followerId);
  const followingId = Number(searchedParams.followingId);

  // Validate required fields
  if (!followerId || !followingId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Delete follow
  const { error: deleteFollowError } = await supabase
    .from("follows")
    .delete()
    .match({ follower_id: followerId, following_id: followingId });

  if (deleteFollowError) {
    return apiError(deleteFollowError);
  }

  // Delete notification created by follow on target user
  await supabase.from("notifications").delete().match({
    user_id: followingId,
    type: "followed",
    related_id: followerId,
  });

  // Return
  return NextResponse.json({ message: SUCCESS_MESSAGES.FOLLOWS.UNFOLLOW }, { status: 200 });
}
