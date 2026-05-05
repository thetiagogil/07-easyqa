import { apiError } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/messages";
import { supabase } from "@/lib/supabase";
import { NotificationType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { questionId, userId, content } = body;

  // Validate required fields
  if (!questionId || !userId || !content) {
    return apiError(ERROR_MESSAGES.GENERAL.MISSING_FIELDS, 400);
  }

  // Create answer
  const { data: answer, error: createAnswerError } = await supabase
    .from("answers")
    .insert({ user_id: userId, question_id: questionId, content })
    .select("*")
    .single();

  if (createAnswerError) {
    return apiError(createAnswerError);
  }

  // Get answered question owner
  const { data: question } = await supabase
    .from("questions")
    .select("user_id")
    .eq("id", questionId)
    .single();

  // Create notification to question owner
  if (question?.user_id && question.user_id !== userId) {
    await supabase.from("notifications").insert({
      user_id: question.user_id,
      type: "answer_received" as NotificationType,
      related_id: answer.id,
    });
  }

  // Return
  return NextResponse.json(answer, { status: 201 });
}
