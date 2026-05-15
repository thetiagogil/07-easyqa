import type { NextRequest } from "next/server";
import { handleAuthContinue } from "@/features/auth/server/routes";

export async function GET(request: NextRequest) {
  return handleAuthContinue(request);
}
