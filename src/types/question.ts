import { User } from "./user";

export interface QuestionDb {
  id: number;
  userId: number;
  title: string;
  content?: string;
  status: "open" | "closed" | "answered";
  voteScore: number;
  createdAt?: string;
}

export interface Question extends QuestionDb {
  user: User;
  viewerVoteValue?: 1 | -1;
  answerCount?: number;
}
