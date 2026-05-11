"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TargetType, VoteValue } from "@/types/easyqa";
import { easyqa } from "../schemas";
import { requireReadyProfile } from "./auth";

export async function submitVoteAction(
  targetType: TargetType,
  targetId: number,
  value: VoteValue,
  returnTo: string,
) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("submit_vote", {
    p_target_type: targetType,
    p_target_id: targetId,
    p_value: value,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(returnTo);
}
