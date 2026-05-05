import { createClient } from "@supabase/supabase-js";
import { ENV_VARS, ENV_VARS_SERVER } from "./constants";

const SUPABASE_URL = ENV_VARS.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = ENV_VARS_SERVER.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: {
    schema: "06-easyqa",
  },
});
