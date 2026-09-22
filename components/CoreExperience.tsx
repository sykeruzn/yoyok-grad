"use client";

import { useRef, useState } from "react";
import { CornerSprig } from "./Botanical";

function VideoSection({ videoUrl }: { videoUrl: string | null }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  if (!videoUrl) return null;

  return (
    <section className="animate-petal-in">
      <p className="font-display text-sm text-magenta mb-3">A Letter, in My Voice</p>
      <div className="relative rounded-2xl overflow-hidden border-2 border-plum/20 bg-teal-dark aspect-video">
        <video
          ref={ref}
          src={videoUrl}
          controls={playing}
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setPlaying(true)}
        />
        {!playing && (
          <button
            type="button"
            onClick={() => {
              ref.current?.play();
              setPlaying(true);
            }}
            className="absolute inset-0 flex items-center justify-center bg-teal-dark/30 hover:bg-teal-dark/20 transition-colors"
            aria-label="Play video letter"
          >
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-cream/95 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1" fill="#5B1F49">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p className="text-xs text-ink/50 mt-2 italic">
        No sound plays automatically — press play whenever you're ready.
      </p>
    </section>
  );
}

function StorySection({
  title,
  body,
  accent,
}: {
  title: string;
  body: string | null;
  accent: string;
}) {
  if (!body) return null;
  return (
    <section className="relative pl-6 animate-petal-in">
      <span
        className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <span
        className="absolute left-[4px] top-5 bottom-[-1.5rem] w-px"
        style={{ backgroundColor: `${accent}33` }}
      />
      <h2 className="font-display text-2xl text-ink mb-2">{title}</h2>
      <p className="text-ink/85 leading-relaxed whitespace-pre-line max-w-[62ch]">
        {body}
      </p>
    </section>
  );
}

export function CoreExperience({
  videoUrl,
  memories,
  gratitude,
  futureMessage,
}: {
  videoUrl: string | null;
  memories: string | null;
  gratitude: string | null;
  futureMessage: string | null;
}) {
  return (
    <div className="space-y-10">
      <VideoSection videoUrl={videoUrl} />

      <div className="relative rounded-[2px] deckle bg-paper border border-ink/10 px-6 py-10 sm:px-10 sm:py-12">
        <CornerSprig className="absolute -top-3 -left-3 w-14 h-14" />
        <div className="space-y-8">
          <StorySection title="The Moments I Keep" body={memories} accent="#78873A" />
          <StorySection title="What You Mean to Me" body={gratitude} accent="#C3185B" />
          <StorySection title="Wherever Life Takes Us" body={futureMessage} accent="#E2892B" />
        </div>
      </div>
    </div>
  );
}
