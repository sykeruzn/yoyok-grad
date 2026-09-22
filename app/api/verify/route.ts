import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { normalizeAnswer } from "@/lib/puzzle";
import { formatUnlockDate, getCoreUnlockDate, getGiverName, isCoreStillLocked } from "@/lib/config";

const GENERIC_ERROR = "Hmm... that doesn't seem right. Try again. 🌸";

export async function POST(req: NextRequest) {
  let body: { username?: string; answer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  const answer = body.answer ?? "";

  if (!username || !answer) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: recipient, error } = await supabase
    .from("recipients")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error || !recipient) {
    // Same generic message whether the username or answer is wrong.
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  if (recipient.recipient_type === "core" && isCoreStillLocked()) {
    return NextResponse.json(
      {
        error: `Oops! Sorry, this means you're part of ${getGiverName()}'s core people, and your message unlocks on ${formatUnlockDate(
          getCoreUnlockDate()
        )}.`,
      },
      { status: 403 }
    );
  }

  // Already unlocked — no need to check anything, just hand back the content.
  if (recipient.unlocked) {
    return NextResponse.json({ success: true, ...publicContent(recipient) });
  }

  const isCorrect = await bcrypt.compare(
    normalizeAnswer(answer),
    recipient.password_hash
  );

  if (!isCorrect) {
    await supabase
      .from("recipients")
      .update({ attempt_count: recipient.attempt_count + 1 })
      .eq("id", recipient.id);

    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("recipients")
    .update({ unlocked: true, unlocked_at: new Date().toISOString() })
    .eq("id", recipient.id)
    .select("*")
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  return NextResponse.json({ success: true, ...publicContent(updated) });
}

function publicContent(recipient: Record<string, unknown>) {
  return {
    message: recipient.message,
    video_url: recipient.video_url,
    memories: recipient.memories,
    gratitude: recipient.gratitude,
    future_message: recipient.future_message,
  };
}
