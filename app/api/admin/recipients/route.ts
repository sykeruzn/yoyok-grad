import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/requireAdmin";
import { buildPuzzleData, DEFAULT_LAYERED_CLUE, normalizeAnswer, PuzzleType } from "@/lib/puzzle";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("recipients")
    .select(
      "id, name, username, recipient_type, profile_color, unlocked, attempt_count, unlocked_at, created_at"
    )
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const recipients = data ?? [];
  const stats = {
    total: recipients.length,
    unlocked: recipients.filter((r) => r.unlocked).length,
    notUnlocked: recipients.filter((r) => !r.unlocked).length,
    totalAttempts: recipients.reduce((sum, r) => sum + (r.attempt_count ?? 0), 0),
  };

  return NextResponse.json({ recipients, stats });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    username,
    answer,
    recipient_type = "general",
    profile_color = "#C3185B",
    profile_icon,
    first_met_year,
    college_year_first_met,
    puzzle_type = "layered",
    puzzle_clue,
    caesar_shift,
    keyword = "grad",
    message,
    video_url,
    memories,
    gratitude,
    future_message,
  } = body as Record<string, unknown>;

  if (!name || !username || !answer) {
    return NextResponse.json(
      { error: "name, username, and answer are required." },
      { status: 400 }
    );
  }

  const password_hash = await bcrypt.hash(normalizeAnswer(String(answer)), 10);
  const puzzle_data = buildPuzzleData(
    puzzle_type as PuzzleType,
    String(answer),
    typeof caesar_shift === "number" ? caesar_shift : 3,
    typeof keyword === "string" ? keyword : "grad"
  );
  const finalClue =
    puzzle_type === "layered" && !puzzle_clue ? DEFAULT_LAYERED_CLUE : puzzle_clue;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("recipients")
    .insert({
      name,
      username: String(username).trim().toLowerCase(),
      password_hash,
      recipient_type,
      profile_color,
      profile_icon,
      first_met_year,
      college_year_first_met,
      puzzle_type,
      puzzle_data,
      puzzle_clue: finalClue,
      message,
      video_url,
      memories,
      gratitude,
      future_message,
    })
    .select("id, name, username")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ recipient: data });
}
