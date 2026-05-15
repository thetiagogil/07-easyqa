"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LIMITS } from "@/shared/constants/app";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "@/lib/database/schemas";
import { emptyState } from "@/shared/server/action-state";
import { requireReadyProfile } from "@/shared/server/auth";
import type { ActionState } from "@/shared/types";
import type { TargetType, VoteValue } from "@/types/easyqa";

export async function createQuestionAction(
  _state: ActionState = emptyState,
  formData: FormData,
): Promise<ActionState> {
  void _state;
  const client = await createClient();
  await requireReadyProfile(client);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || title.length > LIMITS.questionTitle) {
    return { error: `Title must be 1-${LIMITS.questionTitle} characters.` };
  }

  if (!content || content.length > LIMITS.questionContent) {
    return { error: `Question details must be 1-${LIMITS.questionContent} characters.` };
  }

  const { data, error } = await easyqa(client).rpc("create_question", {
    p_title: title,
    p_content: content,
  });

  if (error) return { error: error.message };
  if (!data) return { error: "Question was not created." };

  revalidatePath("/");
  redirect(`/question/${data.id}`);
}

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

export async function submitVoteAction(targetType: TargetType, targetId: number, value: VoteValue) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("submit_vote", {
    p_target_type: targetType,
    p_target_id: targetId,
    p_value: value,
  });

  if (error) throw new Error(error.message);
  // Do not revalidate list/detail routes here. Vote score changes should not
  // resort the visible feed while the user is reading it; fresh ordering is
  // picked up on navigation or the next explicit route fetch.
}
