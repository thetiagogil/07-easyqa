import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Answer } from "@/types/easyqa";
import { easyqa } from "../schemas";
import { getCurrentAuthUser } from "./auth";
import { hydrateAnswers } from "./hydrate";

export async function getAnswersForQuestion(questionId: number): Promise<Answer[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data, error } = await easyqa(client)
    .from("answers")
    .select("*")
    .eq("question_id", questionId)
    .order("accepted", { ascending: false })
    .order("vote_score", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data?.length) return [];

  return hydrateAnswers(client, data, viewer?.id ?? null);
}
