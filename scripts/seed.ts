// Usage: npm run seed
// Inserts a couple of clearly-labeled PLACEHOLDER recipients so you can see
// the full experience end to end before adding your real friends from /admin.
//
// This never touches real recipient data — delete these two from /admin
// once you've seen how everything works.

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { buildPuzzleData, DEFAULT_LAYERED_CLUE, normalizeAnswer } from "../lib/puzzle";

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const supabase = createClient(url, key);

  const demoCoreAnswer = "HI";
  const demoGeneralAnswer = "FRIEND";
  const demoLayeredAnswer = "syke";

  const rows = [
    {
      name: "Maria (demo)",
      username: "demo-maria",
      password_hash: await bcrypt.hash(normalizeAnswer(demoCoreAnswer), 10),
      recipient_type: "core",
      profile_color: "#C3185B",
      first_met_year: 2022,
      college_year_first_met: "Freshman Year",
      puzzle_type: "binary",
      puzzle_data: buildPuzzleData("binary", demoCoreAnswer),
      puzzle_clue: "It's the shortest greeting in the book.",
      video_url: null,
      memories:
        "Placeholder memory text — replace with a real memory once you edit this recipient from /admin.",
      gratitude:
        "Placeholder gratitude text — replace with what you actually appreciate about them.",
      future_message:
        "Placeholder future text — replace with what you hope for them next.",
    },
    {
      name: "Alex (demo)",
      username: "demo-alex",
      password_hash: await bcrypt.hash(normalizeAnswer(demoGeneralAnswer), 10),
      recipient_type: "general",
      profile_color: "#78873A",
      first_met_year: 2023,
      college_year_first_met: "Sophomore Year",
      puzzle_type: "caesar",
      puzzle_data: buildPuzzleData("caesar", demoGeneralAnswer, 3),
      puzzle_clue: "Shift it back by 3.",
      message:
        "This is placeholder letter text so you can see the layout — replace it with your real message from the admin dashboard.",
    },
    {
      name: "Syke (demo)",
      username: "demo-syke",
      password_hash: await bcrypt.hash(normalizeAnswer(demoLayeredAnswer), 10),
      recipient_type: "general",
      profile_color: "#8E44AD",
      first_met_year: 2022,
      college_year_first_met: "Freshman Year",
      puzzle_type: "layered",
      puzzle_data: buildPuzzleData("layered", demoLayeredAnswer, 3, "grad"),
      puzzle_clue: DEFAULT_LAYERED_CLUE,
      message:
        "This is the layered puzzle demo (Morse → binary → Vigenère, keyword \"grad\"). The answer is the recipient's own name — replace this letter with the real one from /admin.",
    },
  ];

  const { error } = await supabase.from("recipients").upsert(rows, { onConflict: "username" });
  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log("Seeded demo recipients:");
  console.log("  /u/demo-maria   → answer: HI");
  console.log("  /u/demo-alex    → answer: FRIEND");
  console.log("  /u/demo-syke    → answer: syke (layered puzzle demo)");
}

main();
