import { Question } from "./question";
import { User } from "./user";

export interface AnswerDb {
  id: number;
  userId: number;
  questionId: number;
  content: string;
  accepted: boolean;
  voteScore: number;
  createdAt?: string;
}

export interface Answer extends AnswerDb {
  user: User;
  question?: Question;
  viewerVoteValue?: 1 | -1;
}
