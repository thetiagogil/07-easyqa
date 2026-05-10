import { notFound, redirect } from "next/navigation";
import { LIMITS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type {
  Answer,
  AnswerRow,
  CurrentUser,
  Notification,
  Profile,
  ProfileRow,
  Question,
  QuestionRow,
  QuestionSort,
  TargetType,
  VoteValue,
} from "@/types/easyqa";
import { core, easyqa, type AppSupabaseClient } from "./schemas";
import {
  mapAnswer,
  mapNotification,
  mapProfile,
  mapQuestion,
  normalizeVoteValue,
  profileMap,
} from "./mappers";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await core(client)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return {
    id: user.id,
    email: user.email ?? null,
    profile: profile ? mapProfile(profile) : null,
  };
}

export async function requireUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth");

  return currentUser;
}

export async function requireProfile() {
  const currentUser = await requireUser();
  if (!currentUser.profile?.hasDisplayName) {
    redirect("/setup");
  }

  return currentUser as CurrentUser & { profile: Profile };
}

export async function getQuestions(sort: QuestionSort = "new"): Promise<Question[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);
  const orderColumn = sort === "top" ? "vote_score" : "created_at";

  const { data, error } = await easyqa(client)
    .from("questions")
    .select("*")
    .order(orderColumn, { ascending: false })
    .order("created_at", { ascending: false })
    .limit(LIMITS.pageSize);

  if (error) throw error;
  if (!data?.length) return [];

  return hydrateQuestions(client, data, viewer?.id ?? null);
}

export async function getQuestionById(id: number): Promise<Question> {
  if (!isSupabaseConfigured()) notFound();

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data, error } = await easyqa(client)
    .from("questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const [question] = await hydrateQuestions(client, [data], viewer?.id ?? null);
  if (!question) notFound();

  return question;
}

export async function getAnswersForQuestion(questionId: number): Promise<Answer[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data, error } = await easyqa(client)
    .from("answers")
    .select("*")
    .eq("question_id", questionId)
    .order("accepted", { ascending: false })
    .order("vote_score", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data?.length) return [];

  return hydrateAnswers(client, data, viewer?.id ?? null);
}

export async function getProfileById(id: string): Promise<Profile> {
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
}

export async function searchProfiles(search?: string): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const searchTerm = search?.trim();

  let query = core(client)
    .from("profiles")
    .select("*")
    .order("display_name", { ascending: true })
    .limit(LIMITS.pageSize);

  if (searchTerm) {
    query = query.or(`display_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapProfile);
}

export async function getQuestionsByProfile(profileId: string): Promise<Question[]> {
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
}

export async function getAnsweredQuestionsByProfile(profileId: string): Promise<Question[]> {
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

  const questionIds = Array.from(new Set((answers ?? []).map((answer) => answer.question_id)));
  if (!questionIds.length) return [];

  const { data: questions, error: questionsError } = await easyqa(client)
    .from("questions")
    .select("*")
    .in("id", questionIds);

  if (questionsError) throw questionsError;

  return hydrateQuestions(client, questions ?? [], viewer?.id ?? null);
}

export async function getNotifications(): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const currentUser = await requireProfile();
  const client = await createClient();

  const { data, error } = await easyqa(client)
    .from("notifications")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false })
    .limit(LIMITS.pageSize);

  if (error) throw error;
  if (!data?.length) return [];

  const { profilesById } = await getProfilesByIds(
    client,
    data.map((notification) => notification.actor_id).filter(Boolean) as string[],
  );

  return data.map((notification) =>
    mapNotification(
      notification,
      notification.actor_id ? profilesById.get(notification.actor_id) ?? null : null,
    ),
  );
}

export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const resolvedUserId = userId ?? (await getCurrentUser())?.id;
  if (!resolvedUserId) return 0;

  const client = await createClient();
  const { count, error } = await easyqa(client)
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", resolvedUserId)
    .eq("is_read", false);

  if (error) throw error;

  return count ?? 0;
}

async function hydrateQuestions(
  client: AppSupabaseClient,
  rows: QuestionRow[],
  viewerId: string | null,
) {
  const { profilesById } = await getProfilesByIds(
    client,
    rows.map((question) => question.user_id),
  );
  const votesByTargetId = await getViewerVotes(client, viewerId, "question", rows.map((q) => q.id));

  return rows.flatMap((question) => {
    const author = profilesById.get(question.user_id);
    if (!author) return [];
    return mapQuestion(question, author, votesByTargetId.get(question.id) ?? null);
  });
}

async function hydrateAnswers(
  client: AppSupabaseClient,
  rows: AnswerRow[],
  viewerId: string | null,
) {
  const { profilesById } = await getProfilesByIds(
    client,
    rows.map((answer) => answer.user_id),
  );
  const votesByTargetId = await getViewerVotes(client, viewerId, "answer", rows.map((a) => a.id));

  return rows.flatMap((answer) => {
    const author = profilesById.get(answer.user_id);
    if (!author) return [];
    return mapAnswer(answer, author, votesByTargetId.get(answer.id) ?? null);
  });
}

async function getProfilesByIds(client: AppSupabaseClient, ids: string[]) {
  const uniqueIds = Array.from(new Set(ids));
  if (!uniqueIds.length) {
    return { profilesById: new Map<string, ProfileRow>() };
  }

  const { data, error } = await core(client).from("profiles").select("*").in("id", uniqueIds);
  if (error) throw error;

  return { profilesById: profileMap(data ?? []) };
}

async function getViewerVotes(
  client: AppSupabaseClient,
  viewerId: string | null,
  targetType: TargetType,
  targetIds: number[],
) {
  if (!viewerId || !targetIds.length) return new Map<number, VoteValue | null>();

  const { data, error } = await easyqa(client)
    .from("votes")
    .select("target_id, value")
    .eq("user_id", viewerId)
    .eq("target_type", targetType)
    .in("target_id", targetIds);

  if (error) throw error;

  return new Map((data ?? []).map((vote) => [vote.target_id, normalizeVoteValue(vote.value)]));
}

async function getCurrentAuthUser(client: AppSupabaseClient) {
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}
