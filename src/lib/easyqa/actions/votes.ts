"use server";

import { createClient } from "@/lib/supabase/server";
import type { TargetType, VoteValue } from "@/types/easyqa";
import { easyqa } from "../schemas";
import { requireReadyProfile } from "./auth";

export async function submitVoteAction(
  targetType: TargetType,
  targetId: number,
  value: VoteValue,
) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("submit_vote", {
    p_target_type: targetType,
    p_target_id: targetId,
    p_value: value,
  });

  if (error) throw new Error(error.message);
  // Do not revalidate list/detail routes here. Vote score changes should not
  // resort the visible feed while the user is reading it; fresh ordering is
  // picked up on navigation or the next explicit route fetch.
}
