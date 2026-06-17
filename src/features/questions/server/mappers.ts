import { mapProfile } from "@/shared/server/mappers";
import type {
  Answer,
  AnswerRow,
  ProfileRow,
  Question,
  QuestionRow,
  QuestionStatus,
  VoteValue,
} from "@/types/easyqa";

export const mapQuestion = (
  row: QuestionRow,
  author: ProfileRow,
  viewerVoteValue: VoteValue | null,
): Question => {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    status: normalizeQuestionStatus(row.status),
    voteScore: row.vote_score,
    answerCount: row.answer_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: mapProfile(author),
    viewerVoteValue,
  };
};

export const mapAnswer = (
  row: AnswerRow,
  author: ProfileRow,
  viewerVoteValue: VoteValue | null,
): Answer => {
  return {
    id: row.id,
    questionId: row.question_id,
    userId: row.user_id,
    content: row.content,
    accepted: row.accepted,
    voteScore: row.vote_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: mapProfile(author),
    viewerVoteValue,
  };
};

export const normalizeVoteValue = (
  value: number | null | undefined,
): VoteValue | null => {
  if (value === 1 || value === -1) return value;
  return null;
};

const normalizeQuestionStatus = (value: string): QuestionStatus => {
  return value === "closed" ? "closed" : "open";
};
