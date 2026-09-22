import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/requireAdmin";
import { buildPuzzleData, normalizeAnswer, PuzzleType } from "@/lib/puzzle";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const updates: Record<string, unknown> = { ...body };
  delete updates.id;
  delete updates.password_hash;

  // If a new plaintext answer was submitted, re-hash it and regenerate the
  // puzzle rendering data for the (possibly also-updated) puzzle_type.
  if (typeof body.answer === "string" && body.answer.length > 0) {
    updates.password_hash = await bcrypt.hash(normalizeAnswer(body.answer), 10);
    const type = (body.puzzle_type as PuzzleType) ?? undefined;
    if (type) {
      updates.puzzle_data = buildPuzzleData(
        type,
        body.answer,
        typeof body.caesar_shift === "number" ? (body.caesar_shift as number) : 3,
        typeof body.keyword === "string" ? (body.keyword as string) : "grad"
      );
    }
  }
  delete updates.answer;
  delete updates.caesar_shift;
  delete updates.keyword;

  // Allow resetting progress from the admin dashboard.
  if (body.reset_progress === true) {
    updates.unlocked = false;
    updates.unlocked_at = null;
    updates.attempt_count = 0;
  }
  delete updates.reset_progress;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("recipients")
    .update(updates)
    .eq("id", params.id)
    .select("id, name, username")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ recipient: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("recipients").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
