import { notFound } from "next/navigation";
import { LIMITS } from "@/shared/constants/app";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Question } from "@/types/easyqa";
import { core, easyqa } from "@/lib/database/schemas";
import { getCurrentAuthUser } from "@/shared/server/auth";
import { hydrateQuestions } from "@/features/questions/server/hydration";
import { mapProfile } from "@/shared/server/mappers";

export const getProfileById = async (id: string): Promise<Profile> => {
  if (!isSupabaseConfigured()) notFound();

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data, error } = await core(client)
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const profile = mapProfile(data);

  if (viewer && viewer.id !== id) {
    const { count, error: followError } = await easyqa(client)
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", viewer.id)
      .eq("following_id", id);

    if (followError) throw followError;
    profile.isViewerFollowing = (count ?? 0) > 0;
  }

  return profile;
};

export const getQuestionsByProfile = async (
  profileId: string,
): Promise<Question[]> => {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data, error } = await easyqa(client)
    .from("questions")
    .select("*")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(LIMITS.pageSize);

  if (error) throw error;
  if (!data?.length) return [];

  return hydrateQuestions(client, data, viewer?.id ?? null);
};

export const getAnsweredQuestionsByProfile = async (
  profileId: string,
): Promise<Question[]> => {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data: answers, error: answersError } = await easyqa(client)
    .from("answers")
    .select("question_id")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(LIMITS.pageSize);

  if (answersError) throw answersError;

  const questionIds = Array.from(
    new Set((answers ?? []).map((answer) => answer.question_id)),
  );
  if (!questionIds.length) return [];

  const { data: questions, error: questionsError } = await easyqa(client)
    .from("questions")
    .select("*")
    .in("id", questionIds);

  if (questionsError) throw questionsError;

  const questionOrder = new Map(
    questionIds.map((questionId, index) => [questionId, index]),
  );
  const orderedQuestions = [...(questions ?? [])].sort(
    (first, second) =>
      (questionOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
      (questionOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER),
  );

  return hydrateQuestions(client, orderedQuestions, viewer?.id ?? null);
};
