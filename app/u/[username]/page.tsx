"use client";

import { useEffect, useState } from "react";
import { UnlockFlow } from "@/components/UnlockFlow";
import { RecipientHeader } from "@/components/RecipientHeader";
import { LetterSection } from "@/components/LetterSection";
import { CoreExperience } from "@/components/CoreExperience";
import { CornerSprig } from "@/components/Botanical";
import { FloralCorners } from "@/components/FloralCluster";
import { CoreLockedNotice } from "@/components/CoreLockedNotice";

type RecipientPublic = {
  name: string;
  username: string;
  recipient_type: "core" | "general";
  profile_color: string;
  profile_icon: string | null;
  first_met_year: number | null;
  college_year_first_met: string | null;
  puzzle_type: "layered" | "binary" | "caesar" | "hex" | "morse" | "ascii" | "riddle";
  puzzle_data: { encoded?: string; shift?: number; keyword?: string };
  puzzle_clue: string | null;
  unlocked: boolean;
  core_locked?: boolean;
  core_unlock_at?: string | null;
  giver_name?: string | null;
  message?: string | null;
  video_url?: string | null;
  memories?: string | null;
  gratitude?: string | null;
  future_message?: string | null;
};

export default function RecipientPage({
  params,
}: {
  params: { username: string };
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "not_found">("loading");
  const [recipient, setRecipient] = useState<RecipientPublic | null>(null);
  const [unlockedJustNow, setUnlockedJustNow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/recipient/${encodeURIComponent(params.username)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then((data: RecipientPublic) => {
        if (!cancelled) {
          setRecipient(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("not_found");
      });
    return () => {
      cancelled = true;
    };
  }, [params.username]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-teal">
        <p className="font-display text-cream/70 text-lg animate-pulse">
          Loading a little corner of the garden...
        </p>
      </main>
    );
  }

  if (status === "not_found" || !recipient) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl text-ink mb-3">Hmm...</h1>
          <p className="text-ink/70 max-w-xs mx-auto">
            We couldn't find this little corner of the garden. Double-check the
            link on your bracelet?
          </p>
        </div>
      </main>
    );
  }

  if (recipient.core_locked) {
    return (
      <main className="relative min-h-screen bg-teal overflow-hidden">
        <FloralCorners variant="teal" />
        <CoreLockedNotice
          name={recipient.name}
          color={recipient.profile_color}
          icon={recipient.profile_icon}
          giverName={recipient.giver_name ?? "the graduate"}
          unlockDate={recipient.core_unlock_at ?? "soon"}
        />
      </main>
    );
  }

  const isUnlocked = recipient.unlocked || unlockedJustNow;

  if (!isUnlocked) {
    return (
      <main className="relative min-h-screen bg-teal px-6 flex items-center overflow-hidden">
        <FloralCorners variant="teal" />
        <div className="relative z-10 w-full max-w-sm mx-auto">
          <UnlockFlow
            username={recipient.username}
            name={recipient.name}
            color={recipient.profile_color}
            icon={recipient.profile_icon}
            puzzleType={recipient.puzzle_type}
            puzzleData={recipient.puzzle_data}
            puzzleClue={recipient.puzzle_clue}
            onUnlocked={(content) => {
              setRecipient((prev) => (prev ? { ...prev, ...content } : prev));
              setUnlockedJustNow(true);
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-5 py-14 sm:py-20 overflow-hidden">
      <FloralCorners />
      <div className="relative z-10 max-w-keepsake mx-auto space-y-12">
        <div className="relative">
          <CornerSprig
            className="absolute -top-8 -left-6 w-20 h-20 opacity-70 hidden sm:block"
          />
          <RecipientHeader
            name={recipient.name}
            color={recipient.profile_color}
            icon={recipient.profile_icon}
            firstMetYear={recipient.first_met_year}
            collegeYear={recipient.college_year_first_met}
          />
        </div>

        {recipient.recipient_type === "core" ? (
          <CoreExperience
            videoUrl={recipient.video_url ?? null}
            memories={recipient.memories ?? null}
            gratitude={recipient.gratitude ?? null}
            futureMessage={recipient.future_message ?? null}
          />
        ) : (
          <LetterSection message={recipient.message ?? null} />
        )}

        <p className="text-center text-xs text-ink/40 pt-6">
          made for you, from our college years 🌿
        </p>
      </div>
    </main>
  );
}
