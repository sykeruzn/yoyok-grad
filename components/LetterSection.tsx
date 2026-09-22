import { CornerSprig } from "./Botanical";

export function LetterSection({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="relative rounded-[2px] deckle bg-paper border border-ink/10 px-6 py-10 sm:px-10 sm:py-12 shadow-[0_1px_0_rgba(43,27,36,0.06)] animate-petal-in">
      <CornerSprig className="absolute -top-3 -left-3 w-14 h-14" />
      <CornerSprig
        className="absolute -bottom-3 -right-3 w-14 h-14 rotate-180"
        color="#C3185B"
        accent="#78873A"
      />

      <p className="font-display text-sm text-magenta mb-4">A Letter for You</p>

      <div className="font-body text-[1.05rem] leading-relaxed text-ink/90 whitespace-pre-line max-w-[65ch]">
        {message}
      </div>
    </div>
  );
}
