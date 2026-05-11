"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LIMITS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "../schemas";
import { requireReadyProfile } from "./auth";
import { emptyState, type ActionState } from "./types";

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
