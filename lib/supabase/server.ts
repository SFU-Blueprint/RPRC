import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const createServerClient = () => {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseAnonKey = getRequiredEnv("SUPABASE_ANON_KEY");

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
