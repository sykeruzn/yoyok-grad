"use client";

import Link from "next/link";
import { Avatar } from "./Avatar";
import { WaveDivider } from "./Botanical";

export function CoreLockedNotice({
  name,
  color,
  icon,
  giverName,
  unlockDate,
}: {
  name: string;
  color: string;
  icon?: string | null;
  giverName: string;
  unlockDate: string;
}) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center px-6 bg-teal-dark/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="core-locked-title"
    >
      <div className="relative w-full max-w-xs bg-paper rounded-2xl px-6 py-8 text-center shadow-2xl animate-petal-in">
        <div className="flex justify-center mb-4">
          <Avatar name={name} color={color} icon={icon} size={64} />
        </div>

        <h2 id="core-locked-title" className="font-display text-xl text-ink mb-2">
          Oops! Sorry, {name.split(" ")[0]}.
        </h2>

        <WaveDivider className="w-16 h-3 mx-auto mb-3" color="#C3185B" />

        <p className="text-ink/75 text-sm leading-relaxed">
          This means you&apos;re part of{" "}
          <span className="font-semibold text-magenta">{giverName}&apos;s</span>{" "}
          core people — and those letters unlock together, a little later.
        </p>

        <p className="font-display text-lg text-ink mt-4">{unlockDate}</p>

        <p className="text-ink/50 text-xs mt-5">
          Come back on that day and your code will be waiting. 🌸
        </p>

        <Link
          href="/"
          className="inline-block mt-6 text-sm text-ink/50 hover:text-ink underline"
        >
          Okay, I&apos;ll come back then
        </Link>
      </div>
    </div>
  );
}
