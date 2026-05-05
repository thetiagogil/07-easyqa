import { PostgrestError } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const apiError = (
  error: PostgrestError | string = "An unexpected error occurred",
  status: number = 500,
) => {
  const errorObj = typeof error === "string" ? { message: error } : error;
  return NextResponse.json({ error: errorObj }, { status });
};
