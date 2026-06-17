import type { Profile, ProfileRow } from "@/types/easyqa";

export const mapProfile = (row: ProfileRow): Profile => {
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
};

export const profileMap = (rows: ProfileRow[]) => {
  return new Map(rows.map((row) => [row.id, row]));
};
