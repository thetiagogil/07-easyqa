import type { NextRequest } from "next/server";
import { handleAuthCallback } from "@/features/auth/server/routes";

export async function GET(request: NextRequest) {
  return handleAuthCallback(request);
}
