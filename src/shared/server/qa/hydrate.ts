import type {
  AnswerRow,
  ProfileRow,
  QuestionRow,
  TargetType,
  VoteValue,
} from "@/types/easyqa";
import {
  mapAnswer,
  mapQuestion,
  normalizeVoteValue,
  profileMap,
} from "./mappers";
import { core, easyqa, type AppSupabaseClient } from "@/lib/database/schemas";

export async function hydrateQuestions(
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

export async function hydrateAnswers(
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

export async function getProfilesByIds(client: AppSupabaseClient, ids: string[]) {
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
