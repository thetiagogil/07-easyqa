import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, targetId, targetType, type } = body;

  // Validate required fields
  if (!userId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get vote
  const { data: vote, error: getVoteError } = await supabase
    .from("votes")
    .select("id, value")
    .eq("user_id", userId)
    .eq("target_id", targetId)
    .eq("target_type", targetType)
    .maybeSingle();

  if (getVoteError) {
    return apiError(getVoteError);
  }

  // CRUD
  const voteValue = type === "upvote" ? 1 : -1;

  if (vote) {
    if (vote.value === voteValue) {
      // Delete vote
      const { error: deleteVoteError } = await supabase.from("votes").delete().eq("id", vote.id);

      if (deleteVoteError) {
        return apiError(deleteVoteError);
      }

      return NextResponse.json({ message: SUCCESS_MESSAGES.VOTES.DELETE });
    } else {
      // Update vote
      const { error: updateVoteError } = await supabase
        .from("votes")
        .update({ value: voteValue })
        .eq("id", vote.id);

      if (updateVoteError) {
        return apiError(updateVoteError);
      }

      return NextResponse.json({ message: SUCCESS_MESSAGES.VOTES.UPDATE });
    }
  } else {
    // Create vote
    const { error: createVoteError } = await supabase.from("votes").insert({
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      value: voteValue,
    });

    if (createVoteError) {
      return apiError(createVoteError);
    }

    // Return
    return NextResponse.json({ message: SUCCESS_MESSAGES.VOTES.SUBMIT });
  }
}
