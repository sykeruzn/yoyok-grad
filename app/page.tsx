"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WaveDivider } from "@/components/Botanical";
import { FloralCorners } from "@/components/FloralCluster";

function HomeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState("");

  const queryUsername = params.get("u");
  if (queryUsername) {
    router.replace(`/u/${encodeURIComponent(queryUsername.trim().toLowerCase())}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/u/${encodeURIComponent(value.trim().toLowerCase())}`);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16">
      <FloralCorners />
      <div className="relative z-10 w-full max-w-sm text-center bg-cream/70 backdrop-blur-[2px] rounded-3xl py-8">
        <p className="font-display text-2xl sm:text-3xl text-ink leading-snug">
          A little piece of our college story
        </p>
        <p className="text-ink/60 mt-4 text-sm leading-relaxed">
          Some memories are meant to be kept.
          <br />
          Some letters are meant to be found.
        </p>

        <WaveDivider className="w-24 h-4 mx-auto my-8" />

        <p className="text-ink/70 text-sm mb-4">
          Someone left something here for you. If you have your own link, open
          that instead — otherwise, enter your name below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="your username"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-center text-ink placeholder:text-ink/35 focus:border-marigold outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-marigold text-cream font-semibold tracking-wide hover:bg-marigold-light transition-colors"
          >
            Begin
          </button>
        </form>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
