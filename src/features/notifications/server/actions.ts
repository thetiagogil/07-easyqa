"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "@/lib/database/schemas";
import { requireReadyProfile } from "@/shared/server/auth";

export async function markNotificationsReadAction() {
  const client = await createClient();
  await requireReadyProfile(client);

  const { error } = await easyqa(client).rpc("mark_my_notifications_read");

  if (error) throw new Error(error.message);

  revalidatePath("/notifications");
}
