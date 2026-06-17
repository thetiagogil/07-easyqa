import type {
  AnswerRow,
  ProfileRow,
  QuestionRow,
  TargetType,
  VoteValue,
} from "@/types/easyqa";
import { getProfilesByIds } from "@/features/profiles/server/lookups";
import {
  mapAnswer,
  mapQuestion,
  normalizeVoteValue,
} from "@/features/questions/server/mappers";
import { easyqa, type AppSupabaseClient } from "@/lib/database/schemas";

export const hydrateQuestions = async (
  client: AppSupabaseClient,
  rows: QuestionRow[],
  viewerId: string | null,
) => {
  const { profilesById } = await getProfilesByIds(
    client,
    rows.map((question) => question.user_id),
  );
  const votesByTargetId = await getViewerVotes(
    client,
    viewerId,
    "question",
    rows.map((q) => q.id),
  );

  return rows.map((question) => {
    const author =
      profilesById.get(question.user_id) ??
      createFallbackProfile(question.user_id, question.created_at);
    return mapQuestion(
      question,
      author,
      votesByTargetId.get(question.id) ?? null,
    );
  });
};

export const hydrateAnswers = async (
  client: AppSupabaseClient,
  rows: AnswerRow[],
  viewerId: string | null,
) => {
  const { profilesById } = await getProfilesByIds(
    client,
    rows.map((answer) => answer.user_id),
  );
  const votesByTargetId = await getViewerVotes(
    client,
    viewerId,
    "answer",
    rows.map((a) => a.id),
  );

  return rows.map((answer) => {
    const author =
      profilesById.get(answer.user_id) ??
      createFallbackProfile(answer.user_id, answer.created_at);
    return mapAnswer(answer, author, votesByTargetId.get(answer.id) ?? null);
  });
};

const createFallbackProfile = (
  userId: string,
  timestamp: string,
): ProfileRow => {
  return {
    id: userId,
    display_name: null,
    username: null,
    bio: null,
    avatar_url: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
};

const getViewerVotes = async (
  client: AppSupabaseClient,
  viewerId: string | null,
  targetType: TargetType,
  targetIds: number[],
) => {
  if (!viewerId || !targetIds.length)
    return new Map<number, VoteValue | null>();

  const { data, error } = await easyqa(client)
    .from("votes")
    .select("target_id, value")
    .eq("user_id", viewerId)
    .eq("target_type", targetType)
    .in("target_id", targetIds);

  if (error) throw error;

  return new Map(
    (data ?? []).map((vote) => [
      vote.target_id,
      normalizeVoteValue(vote.value),
    ]),
  );
};
