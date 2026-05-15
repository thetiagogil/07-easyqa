import { notFound } from "next/navigation";
import { LIMITS } from "@/shared/constants/app";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { easyqa } from "@/lib/database/schemas";
import { getCurrentAuthUser } from "@/shared/server/auth";
import { hydrateAnswers, hydrateQuestions } from "@/shared/server/qa/hydrate";
import type { Answer, Question, QuestionSort } from "@/types/easyqa";

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
