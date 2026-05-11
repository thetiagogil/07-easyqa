"use server";

import { revalidatePath } from "next/cache";
import { LIMITS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "../schemas";
import { requireReadyProfile } from "./auth";
import { emptyState, type ActionState } from "./types";

export async function createAnswerAction(
  questionId: number,
  _state: ActionState = emptyState,
  formData: FormData,
): Promise<ActionState> {
  void _state;
  const client = await createClient();
  await requireReadyProfile(client);
  const content = String(formData.get("content") ?? "").trim();

  if (!content || content.length > LIMITS.answerContent) {
    return { error: `Answer must be 1-${LIMITS.answerContent} characters.` };
  }

  const { error } = await easyqa(client).rpc("create_answer", {
    p_question_id: questionId,
    p_content: content,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/question/${questionId}`);
  return { success: "Answer posted." };
}

export async function acceptAnswerAction(answerId: number, questionId: number) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("accept_answer", {
    p_answer_id: answerId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/question/${questionId}`);
}
