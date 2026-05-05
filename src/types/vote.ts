export interface VoteDb {
  id: number;
  userId: number;
  targetId: number;
  targetType: "question" | "answer";
  value: 1 | -1;
  createdAt?: string;
}

export interface Vote extends VoteDb {}
