"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { PuzzlePrompt } from "./PuzzlePrompt";
import { WaveDivider } from "./Botanical";

type PuzzleType = "layered" | "binary" | "caesar" | "hex" | "morse" | "ascii" | "riddle";

type Content = {
  message: string | null;
  video_url: string | null;
  memories: string | null;
  gratitude: string | null;
  future_message: string | null;
};

export function UnlockFlow({
  username,
  name,
  color,
  icon,
  puzzleType,
  puzzleData,
  puzzleClue,
  onUnlocked,
}: {
  username: string;
  name: string;
  color: string;
  icon?: string | null;
  puzzleType: PuzzleType;
  puzzleData: { encoded?: string; shift?: number; keyword?: string };
  puzzleClue?: string | null;
  onUnlocked: (content: Content) => void;
}) {
  const [stage, setStage] = useState<"intro" | "puzzle" | "revealing">("intro");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, answer }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Hmm... that doesn't seem right. Try again. 🌸");
        setAnswer("");
        setSubmitting(false);
        return;
      }

      setStage("revealing");
      setTimeout(() => {
        onUnlocked({
          message: data.message,
          video_url: data.video_url,
          memories: data.memories,
          gratitude: data.gratitude,
          future_message: data.future_message,
        });
      }, 900);
    } catch {
      setError("Something got tangled on our end. Try again in a moment.");
      setSubmitting(false);
    }
  }

  if (stage === "revealing") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 animate-unlock-bloom">
        <Avatar name={name} color={color} icon={icon} size={72} />
        <p className="font-display text-2xl text-cream mt-6">
          Your letter is waiting.
        </p>
      </div>
    );
  }

  if (stage === "intro") {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-16 animate-petal-in">
        <Avatar name={name} color={color} icon={icon} size={80} />
        <div>
          <p className="font-display text-2xl sm:text-3xl text-cream leading-snug max-w-sm">
            Someone left something here, {name.split(" ")[0]}.
          </p>
          <p className="text-cream/70 mt-3 max-w-xs mx-auto text-sm">
            Before you can read it, there's a little piece of code to figure out.
            You'll know it when you see it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStage("puzzle")}
          className="mt-2 px-8 py-3 rounded-full bg-marigold text-cream font-body font-semibold tracking-wide hover:bg-marigold-light transition-colors"
        >
          Begin
        </button>
      </div>
    );
  }

  return (
    <div className="py-14 animate-petal-in">
      <div className="text-center mb-6">
        <p className="font-display text-xl sm:text-2xl text-cream">
          A little something is hidden here...
        </p>
        <p className="text-cream/70 text-sm mt-2">
          Solve it, and your letter unlocks.
        </p>
      </div>

      <PuzzlePrompt type={puzzleType} data={puzzleData} clue={puzzleClue} />

      <WaveDivider className="w-24 h-4 mx-auto my-6" color="#F0BD4C" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer" className="sr-only">
            Your answer
          </label>
          <input
            id="answer"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type what it says..."
            className="w-full rounded-xl border border-cream/25 bg-cream/10 px-4 py-3.5 text-cream placeholder:text-cream/40 focus:bg-cream/15 focus:border-marigold-light outline-none text-center text-lg tracking-wide"
          />
        </div>

        {error && (
          <p role="alert" className="text-center text-marigold-light text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-full bg-marigold text-cream font-semibold tracking-wide hover:bg-marigold-light transition-colors disabled:opacity-60"
        >
          {submitting ? "Checking..." : "Unlock"}
        </button>
      </form>
    </div>
  );
}
