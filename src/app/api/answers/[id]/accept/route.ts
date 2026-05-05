import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const answerId = Number(id);

  const body = await req.json();
  const { userId } = body;

  // Validate required fields
  if (!answerId || !userId) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Get answer with associated question
  const { data: answer, error: getAnswerError } = await supabase
    .from("answers")
    .select("id, question_id")
    .eq("id", answerId)
    .single();

  if (getAnswerError) {
    return apiError(getAnswerError);
  }

  const { data: question, error: getQuestionError } = await supabase
    .from("questions")
    .select("id, user_id")
    .eq("id", answer.question_id)
    .single();

  if (getQuestionError) {
    return apiError(getQuestionError);
  }

  // Validate if the viewer is the question owner
  if (question.user_id !== userId) {
    return apiError("Unauthorized", 401);
  }

  // Accept the answer and close the question
  const { error: updateAnswerError } = await supabase
    .from("answers")
    .update({ accepted: true })
    .eq("id", answerId);

  if (updateAnswerError) {
    return apiError(updateAnswerError);
  }

  const { error: updateQuestionError } = await supabase
    .from("questions")
    .update({ status: "closed" })
    .eq("id", answer.question_id)
    .select()
    .single();

  if (updateQuestionError) {
    return apiError(updateQuestionError);
  }

  // Get question owner
  const { data: acceptedAnswer } = await supabase
    .from("answers")
    .select("user_id")
    .eq("id", answerId)
    .single();

  // Create notification to question owner
  if (acceptedAnswer?.user_id && acceptedAnswer.user_id !== userId) {
    await supabase.from("notifications").insert({
      user_id: acceptedAnswer.user_id,
      type: "answer_accepted",
      related_id: answer.question_id,
    });
  }

  // Return
  return NextResponse.json({ success: true }, { status: 200 });
}
