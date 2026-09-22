type PuzzleType = "layered" | "binary" | "caesar" | "hex" | "morse" | "ascii" | "riddle";

const INSTRUCTIONS: Record<PuzzleType, string> = {
  layered: "More than one code is folded into this one.",
  binary: "It's binary. What does it spell?",
  hex: "That's hexadecimal. Convert it to letters.",
  ascii: "Those are ASCII codes. What do they spell?",
  morse: "Morse code — dust off that one CS elective.",
  caesar: "A Caesar cipher. Shift it back to find the word.",
  riddle: "A little clue, instead of a code.",
};

export function PuzzlePrompt({
  type,
  data,
  clue,
}: {
  type: PuzzleType;
  data: { encoded?: string; shift?: number; keyword?: string };
  clue?: string | null;
}) {
  const instruction =
    type === "caesar" && data.shift
      ? `A Caesar cipher, shifted by ${data.shift}.`
      : INSTRUCTIONS[type] ?? INSTRUCTIONS.riddle;

  const clueLines = (clue ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{instruction}</p>

      {type !== "riddle" && data.encoded && (
        <div className="rounded-lg border border-dashed border-cream/40 bg-teal-dark/40 px-4 py-4 text-center">
          <code className="font-mono text-lg sm:text-xl tracking-widest text-marigold-light break-all">
            {data.encoded}
          </code>
        </div>
      )}

      {clueLines.length > 0 && (
        <div className="text-sm italic text-cream/80 text-center leading-relaxed space-y-0.5">
          {type === "riddle"
            ? clueLines.map((line, i) => <p key={i}>{line}</p>)
            : clueLines.map((line, i) => (
                <p key={i}>{i === 0 ? `Hint: ${line}` : line}</p>
              ))}
        </div>
      )}
    </div>
  );
}
