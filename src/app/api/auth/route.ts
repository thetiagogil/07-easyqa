import { ENV_VARS, ENV_VARS_SERVER } from "@/lib/constants";
import { apiError } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest, NextResponse } from "next/server";

const privy = new PrivyClient(ENV_VARS.PRIVY_APP_ID!, ENV_VARS_SERVER.PRIVY_APP_SECRET!);

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization");

  // Validate required fields
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  // Get privy user id
  const token = auth.replace("Bearer ", "");
  const claims = await privy.verifyAuthToken(token);
  const { userId: userPrivyId } = claims;

  // Get user
  const { data: user, error: getUserError } = await supabase
    .from("users")
    .select("*")
    .eq("privy_id", userPrivyId)
    .maybeSingle();

  if (getUserError) {
    return apiError(getUserError);
  }

  if (user) {
    return NextResponse.json(user);
  }

  // Create user (if user doesn't exist)
  const { data: newUser, error: createUserError } = await supabase
    .from("users")
    .insert({ privy_id: userPrivyId })
    .select()
    .single();

  if (createUserError) {
    return apiError(createUserError);
  }

  // Return
  return NextResponse.json(newUser);
}
