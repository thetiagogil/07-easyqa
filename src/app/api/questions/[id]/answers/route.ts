import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import camelcaseKeys from "camelcase-keys";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const questionId = Number(id);
  const { searchParams } = req.nextUrl;
  const searchedParams = Object.fromEntries(searchParams.entries());
  const viewerId = Number(searchedParams.viewerId);
  const pageSize = Number(searchedParams.pageSize || 10);
  const page = Number(searchedParams.page || 1);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Validate required fields
  if (!questionId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get answers for question
  const { data: answers, error } = await supabase
    .from("answers")
    .select("*, user:user_id(*)")
    .eq("question_id", questionId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return apiError(error);

  // Get viewerId vote on answers
  let viewerVotes: { target_id: number; value: number }[] = [];

  if (viewerId) {
    const answersIds = answers.map((q) => q.id);
    if (answersIds.length) {
      const { data: voteRows, error: getVotesError } = await supabase
        .from("votes")
        .select("target_id, value")
        .eq("user_id", viewerId)
        .eq("target_type", "answer")
        .in("target_id", answersIds);

      if (getVotesError) {
        return apiError(getVotesError);
      }
      viewerVotes = voteRows ?? [];
    }
  }

  // Return
  const response = answers.map((answer) => ({
    ...answer,
    viewerVoteValue: viewerVotes.find((vote) => vote.target_id === answer.id)?.value ?? null,
  }));

  return NextResponse.json(camelcaseKeys(response, { deep: true }));
}
