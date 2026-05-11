"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LIMITS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { core, easyqa } from "../schemas";
import { requireAuthUser } from "./auth";
import { emptyState, type ActionState } from "./types";

export async function updateProfileAction(
  _state: ActionState = emptyState,
  formData: FormData,
): Promise<ActionState> {
  void _state;
  const client = await createClient();
  const user = await requireAuthUser(client);
  const displayName = String(formData.get("displayName") ?? "").trim();
  const usernameInput = String(formData.get("username") ?? "").trim().toLowerCase();
  const bioInput = String(formData.get("bio") ?? "").trim();

  if (!displayName || displayName.length > LIMITS.profileName) {
    return { error: `Display name must be 1-${LIMITS.profileName} characters.` };
  }

  if (usernameInput && !/^[a-z0-9_]{3,30}$/.test(usernameInput)) {
    return { error: "Username must be 3-30 lowercase letters, numbers, or underscores." };
  }

  if (bioInput.length > LIMITS.profileBio) {
    return { error: `Bio must be ${LIMITS.profileBio} characters or fewer.` };
  }

  const { error } = await core(client).from("profiles").upsert(
    {
      id: user.id,
      display_name: displayName,
      username: usernameInput || null,
      bio: bioInput || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) return { error: error.message };

  const { error: settingsError } = await easyqa(client).rpc("ensure_my_settings");
  if (settingsError) return { error: settingsError.message };

  revalidatePath("/");
  revalidatePath(`/profile/${user.id}`);
  redirect(`/profile/${user.id}`);
}
