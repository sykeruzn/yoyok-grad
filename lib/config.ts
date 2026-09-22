// Small site-wide config, read from environment variables so you don't have
// to touch code to change the reveal date or your own name in the copy.

export function getGiverName(): string {
  return process.env.GIVER_NAME?.trim() || "Syke";
}

// Core friends' letters stay locked until this moment, regardless of whether
// they've already solved their puzzle. Accepts any string Date() can parse,
// e.g. "2026-09-25" or "2026-09-25T00:00:00-04:00" (recommended if you care
// about a specific timezone — a bare date is interpreted as UTC midnight).
export function getCoreUnlockDate(): Date {
  const raw = process.env.CORE_UNLOCK_AT?.trim();
  const parsed = raw ? new Date(raw) : null;
  if (parsed && !isNaN(parsed.getTime())) return parsed;
  // Falls back to "already unlocked" if unset/unparseable, so misconfiguring
  // this never permanently locks people out.
  return new Date(0);
}

export function isCoreStillLocked(): boolean {
  return Date.now() < getCoreUnlockDate().getTime();
}

export function formatUnlockDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
