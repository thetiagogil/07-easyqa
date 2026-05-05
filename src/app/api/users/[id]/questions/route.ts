import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import camelcaseKeys from "camelcase-keys";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);

  const { searchParams } = new URL(req.url);
  const searchedParams = Object.fromEntries(searchParams.entries());
  const viewerId = Number(searchedParams.viewerId);

  // Validate required fields
  if (!userId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get user questions
  const { data: questions, error: getQuestionsError } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (getQuestionsError) {
    return apiError(getQuestionsError);
  }

  if (!questions?.length) {
    return NextResponse.json([]);
  }

  // Get viwerId vote on questions
  let viewerVotes: { target_id: number; value: number }[] = [];

  if (viewerId) {
    const questionIds = questions.map((q) => q.id);
    if (questionIds.length) {
      const { data: voteRows, error: getVotesError } = await supabase
        .from("votes")
        .select("target_id, value")
        .eq("user_id", viewerId)
        .eq("target_type", "question")
        .in("target_id", questionIds);

      if (getVotesError) {
        return apiError(getVotesError);
      }
      viewerVotes = voteRows ?? [];
    }
  }

  // Return
  const response = questions.map((question) => ({
    ...question,
    viewerVoteValue: viewerVotes.find((vote) => vote.target_id === question.id)?.value ?? null,
  }));

  return NextResponse.json(camelcaseKeys(response, { deep: true }));
}
