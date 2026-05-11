import { notFound } from "next/navigation";
import { LIMITS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Question, QuestionSort } from "@/types/easyqa";
import { easyqa } from "../schemas";
import { getCurrentAuthUser } from "./auth";
import { hydrateQuestions } from "./hydrate";

export async function getQuestions(sort: QuestionSort = "new"): Promise<Question[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);
  const orderColumn = sort === "top" ? "vote_score" : "created_at";

  const { data, error } = await easyqa(client)
    .from("questions")
    .select("*")
    .order(orderColumn, { ascending: false })
    .order("created_at", { ascending: false })
    .limit(LIMITS.pageSize);

  if (error) throw error;
  if (!data?.length) return [];

  return hydrateQuestions(client, data, viewer?.id ?? null);
}

export async function getQuestionById(id: number): Promise<Question> {
  if (!isSupabaseConfigured()) notFound();

  const client = await createClient();
  const viewer = await getCurrentAuthUser(client);

  const { data, error } = await easyqa(client)
    .from("questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const [question] = await hydrateQuestions(client, [data], viewer?.id ?? null);
  if (!question) notFound();

  return question;
}
