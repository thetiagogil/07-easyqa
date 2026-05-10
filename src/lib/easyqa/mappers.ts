import type {
  Answer,
  AnswerRow,
  Notification,
  NotificationRow,
  NotificationType,
  Profile,
  ProfileRow,
  Question,
  QuestionRow,
  QuestionStatus,
  VoteValue,
} from "@/types/easyqa";

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name ?? row.username ?? "Anonymous",
    hasDisplayName: !!row.display_name,
    username: row.username,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapQuestion(
  row: QuestionRow,
  author: ProfileRow,
  viewerVoteValue: VoteValue | null,
): Question {
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
}

export function mapAnswer(
  row: AnswerRow,
  author: ProfileRow,
  viewerVoteValue: VoteValue | null,
): Answer {
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
}

export function mapNotification(
  row: NotificationRow,
  actor: ProfileRow | null,
): Notification {
  return {
    id: row.id,
    type: normalizeNotificationType(row.type),
    actorId: row.actor_id,
    actor: actor ? mapProfile(actor) : null,
    questionId: row.question_id,
    answerId: row.answer_id,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export function profileMap(rows: ProfileRow[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

export function normalizeVoteValue(value: number | null | undefined): VoteValue | null {
  if (value === 1 || value === -1) return value;
  return null;
}

function normalizeQuestionStatus(value: string): QuestionStatus {
  return value === "closed" ? "closed" : "open";
}

function normalizeNotificationType(value: string): NotificationType {
  if (value === "answer_accepted" || value === "followed") return value;
  return "answer_received";
}
