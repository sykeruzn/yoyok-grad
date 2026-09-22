import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. This uses the Supabase service role key, which bypasses Row
// Level Security — never import this file from a client component, and never
// expose SUPABASE_SERVICE_ROLE_KEY with the NEXT_PUBLIC_ prefix.
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env.local and fill it in.`
    );
  }
  return value;
}

export function getSupabaseAdmin() {
  const url = getEnv("SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export type Recipient = {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  recipient_type: "core" | "general";
  profile_color: string;
  profile_icon: string | null;
  first_met_year: number | null;
  college_year_first_met: string | null;
  puzzle_type: "binary" | "caesar" | "hex" | "morse" | "ascii" | "riddle";
  puzzle_data: Record<string, unknown>;
  puzzle_clue: string | null;
  message: string | null;
  video_url: string | null;
  memories: string | null;
  gratitude: string | null;
  future_message: string | null;
  unlocked: boolean;
  attempt_count: number;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
};
