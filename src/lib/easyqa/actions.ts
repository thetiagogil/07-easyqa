"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LIMITS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { TargetType, VoteValue } from "@/types/easyqa";
import { core, easyqa } from "./schemas";

export type ActionState = {
  error?: string;
  success?: string;
};

const emptyState: ActionState = {};

export async function updateProfileAction(
  _state: ActionState = emptyState,
  formData: FormData,
): Promise<ActionState> {
  void _state;
  const client = await createClient();
  const user = await requireAuthUser(client);
  const displayName = String(formData.get("displayName") ?? "").trim();
  const usernameInput = String(formData.get("username") ?? "").trim().toLowerCase();
  const bioInput = String(formData.get("bio") ?? "").trim();

  if (!displayName || displayName.length > LIMITS.profileName) {
    return { error: `Display name must be 1-${LIMITS.profileName} characters.` };
  }

  if (usernameInput && !/^[a-z0-9_]{3,30}$/.test(usernameInput)) {
    return { error: "Username must be 3-30 lowercase letters, numbers, or underscores." };
  }

  if (bioInput.length > LIMITS.profileBio) {
    return { error: `Bio must be ${LIMITS.profileBio} characters or fewer.` };
  }

  const { error } = await core(client).from("profiles").upsert(
    {
      id: user.id,
      display_name: displayName,
      username: usernameInput || null,
      bio: bioInput || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) return { error: error.message };

  const { error: settingsError } = await easyqa(client).rpc("ensure_my_settings");
  if (settingsError) return { error: settingsError.message };

  revalidatePath("/");
  revalidatePath(`/profile/${user.id}`);
  redirect(`/profile/${user.id}`);
}

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

export async function submitVoteAction(
  targetType: TargetType,
  targetId: number,
  value: VoteValue,
  returnTo: string,
) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("submit_vote", {
    p_target_type: targetType,
    p_target_id: targetId,
    p_value: value,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(returnTo);
}

export async function followProfileAction(profileId: string, returnTo: string) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("follow_profile", {
    p_profile_id: profileId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(returnTo);
}

export async function unfollowProfileAction(profileId: string, returnTo: string) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("unfollow_profile", {
    p_profile_id: profileId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(returnTo);
}

export async function markNotificationsReadAction() {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("mark_my_notifications_read");

  if (error) throw new Error(error.message);

  revalidatePath("/notifications");
}

async function requireAuthUser(client: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) redirect("/auth");

  return user;
}

async function requireReadyProfile(client: Awaited<ReturnType<typeof createClient>>) {
  const user = await requireAuthUser(client);
  const { data: profile, error } = await core(client)
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile?.display_name) redirect("/setup");

  return { user, profile };
}
