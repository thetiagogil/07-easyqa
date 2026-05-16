import type { Tables } from "@thetiagogil/shared-db-types";

export type ProfileRow = Tables<{ schema: "core" }, "profiles">;
export type QuestionRow = Tables<{ schema: "easyqa" }, "questions">;
export type AnswerRow = Tables<{ schema: "easyqa" }, "answers">;
export type VoteRow = Tables<{ schema: "easyqa" }, "votes">;
export type FollowRow = Tables<{ schema: "easyqa" }, "follows">;
export type NotificationRow = Tables<{ schema: "easyqa" }, "notifications">;
export type UserSettingsRow = Tables<{ schema: "easyqa" }, "user_settings">;

export type QuestionStatus = "open" | "closed";
export type TargetType = "question" | "answer";
export type VoteValue = 1 | -1;
export type NotificationType = "answer_received" | "answer_accepted" | "followed";

export type Profile = {
  id: string;
  displayName: string;
  hasDisplayName: boolean;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isViewerFollowing?: boolean;
};

export type CurrentUser = {
  id: string;
  email: string | null;
  profile: Profile | null;
};

export type Question = {
  id: number;
  userId: string;
  title: string;
  content: string;
  status: QuestionStatus;
  voteScore: number;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
  author: Profile;
  viewerVoteValue: VoteValue | null;
};

export type Answer = {
  id: number;
  questionId: number;
  userId: string;
  content: string;
  accepted: boolean;
  voteScore: number;
  createdAt: string;
  updatedAt: string;
  author: Profile;
  viewerVoteValue: VoteValue | null;
};

export type Notification = {
  id: number;
  type: NotificationType;
  actorId: string | null;
  actor: Profile | null;
  questionId: number | null;
  answerId: number | null;
  isRead: boolean;
  createdAt: string;
};

export type QuestionSort = "new" | "top";
