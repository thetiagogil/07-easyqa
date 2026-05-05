import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import camelcaseKeys from "camelcase-keys";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questionId = Number(id);

  const { searchParams } = req.nextUrl;
  const searchedParams = Object.fromEntries(searchParams.entries());
  const viewerId = Number(searchedParams.viewerId);

  // Validate required fields
  if (!questionId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get question by id
  const { data: question, error: getQuestionError } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("id", questionId)
    .single();

  if (getQuestionError) {
    return apiError(getQuestionError);
  }

  // Get viewerId vote on question
  let viewerVoteValue: 1 | -1 | null = null;

  if (viewerId) {
    const { data: vote, error: getVoteError } = await supabase
      .from("votes")
      .select("value")
      .eq("user_id", viewerId)
      .eq("target_type", "question")
      .eq("target_id", questionId)
      .maybeSingle();

    if (getVoteError) {
      return apiError(getVoteError);
    }

    viewerVoteValue = vote?.value ?? null;
  }

  // Return
  const response = {
    ...question,
    viewerVoteValue,
  };

  return NextResponse.json(camelcaseKeys(response, { deep: true }));
}
