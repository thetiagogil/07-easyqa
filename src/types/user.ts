export interface UserDb {
  id: number;
  privyId: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends UserDb {
  email?: string;
  wallet?: string;
  isViewerFollowing?: boolean;
}
