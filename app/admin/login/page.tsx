"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Incorrect password.");
      setSubmitting(false);
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-4 bg-paper border border-ink/10 rounded-xl px-6 py-8"
      >
        <h1 className="font-display text-2xl text-ink text-center">
          Admin
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          autoFocus
          className="w-full rounded-lg border border-ink/15 px-4 py-2.5 outline-none focus:border-marigold"
        />
        {error && <p className="text-magenta text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-full bg-teal text-cream font-semibold hover:bg-teal-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}
