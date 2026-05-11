"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "../schemas";
import { requireReadyProfile } from "./auth";

export async function followProfileAction(profileId: string, returnTo: string) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("follow_profile", {
    p_profile_id: profileId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(returnTo);
}

export async function unfollowProfileAction(profileId: string, returnTo: string) {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("unfollow_profile", {
    p_profile_id: profileId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(returnTo);
}
