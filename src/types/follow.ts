export interface FollowDb {
  followerId: number;
  followingId: number;
  followedAt: string;
}

export interface Follow extends FollowDb {}
