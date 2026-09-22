import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatUnlockDate, getCoreUnlockDate, getGiverName, isCoreStillLocked } from "@/lib/config";

// Recipient unlock status can change at any time (admin reset, new solve),
// so this must never be served from a cached response — always hit the DB.
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username?.trim().toLowerCase();
  if (!username) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("recipients")
    .select(
      "name, username, recipient_type, profile_color, profile_icon, first_met_year, college_year_first_met, puzzle_type, puzzle_data, puzzle_clue, unlocked, message, video_url, memories, gratitude, future_message"
    )
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const coreLocked = data.recipient_type === "core" && isCoreStillLocked();

  // Only include the actual letter content once this recipient has already
  // unlocked it — before that, a visitor only gets identity + puzzle info.
  const base = {
    name: data.name,
    username: data.username,
    recipient_type: data.recipient_type,
    profile_color: data.profile_color,
    profile_icon: data.profile_icon,
    first_met_year: data.first_met_year,
    college_year_first_met: data.college_year_first_met,
    puzzle_type: data.puzzle_type,
    puzzle_data: data.puzzle_data,
    puzzle_clue: data.puzzle_clue,
    unlocked: data.unlocked,
    core_locked: coreLocked,
    core_unlock_at: coreLocked ? formatUnlockDate(getCoreUnlockDate()) : null,
    giver_name: coreLocked ? getGiverName() : null,
  };

  // Before their reveal date, core friends see none of the puzzle or content
  // — just the "come back on [date]" notice built from the fields above.
  if (coreLocked) {
    return NextResponse.json(base);
  }

  if (!data.unlocked) {
    return NextResponse.json(base);
  }

  return NextResponse.json({
    ...base,
    message: data.message,
    video_url: data.video_url,
    memories: data.memories,
    gratitude: data.gratitude,
    future_message: data.future_message,
  });
}