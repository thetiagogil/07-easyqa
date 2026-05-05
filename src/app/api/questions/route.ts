import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import camelcaseKeys from "camelcase-keys";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const searchedParams = Object.fromEntries(searchParams.entries());
  const sort = searchedParams.sort || "new";
  const limit = Number(searchedParams.limit || 10);
  const offset = Number(searchedParams.offset || 0);
  const viewerId = Number(searchedParams.viewerId);

  const sortMap: Record<string, string> = {
    new: "created_at",
    top: "vote_score",
  };
  const orderBy = sortMap[sort] ?? "created_at";

  // Get questions
  const { data: questions, error: getQuestionsError } = await supabase
    .from("questions")
    .select("*, user:user_id(*)")
    .order(orderBy, { ascending: false })
    .range(offset, offset + limit - 1);

  if (getQuestionsError) {
    return apiError(getQuestionsError);
  }

  if (!questions?.length) return NextResponse.json([]);

  // Get answers by question_id
  const questionIds = questions.map((question) => question.id);

  const { data: answers, error: getAnswersError } = await supabase
    .from("answers")
    .select("question_id")
    .in("question_id", questionIds);

  if (getAnswersError) {
    return apiError(getAnswersError);
  }

  // Get answers count
  const answerCountMap = new Map<number, number>();
  answers?.forEach((answer) => {
    answerCountMap.set(answer.question_id, (answerCountMap.get(answer.question_id) || 0) + 1);
  });

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
    answerCount: answerCountMap.get(question.id) ?? 0,
  }));

  return NextResponse.json(camelcaseKeys(response, { deep: true }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, title, content } = body;

  // Validate required fields
  if (!userId || !title || !content) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Create question
  const { data: question, error: createQuestionError } = await supabase
    .from("questions")
    .insert([{ user_id: userId, title, content }])
    .select()
    .single();

  if (createQuestionError) {
    return apiError(createQuestionError);
  }

  // Return
  return NextResponse.json(question, { status: 201 });
}
