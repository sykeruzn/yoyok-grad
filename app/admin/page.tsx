"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RecipientRow = {
  id: string;
  name: string;
  username: string;
  recipient_type: "core" | "general";
  profile_color: string;
  unlocked: boolean;
  attempt_count: number;
  unlocked_at: string | null;
  created_at: string;
};

type Stats = {
  total: number;
  unlocked: number;
  notUnlocked: number;
  totalAttempts: number;
};

const DEFAULT_LAYERED_CLUE_PREVIEW =
  "Some words hide first as dashes and dots.\nRead what they spell out in zeroes and ones.\nThen shift each letter back, as Giovan Battista Bellaso once did, by the word that brought you here.";

const PROFILE_COLORS = [
  { label: "Magenta", value: "#C3185B" },
  { label: "Marigold", value: "#E2892B" },
  { label: "Olive", value: "#78873A" },
  { label: "Plum", value: "#5B1F49" },
  { label: "Orchid", value: "#8E44AD" },
  { label: "Turquoise", value: "#2AA9A0" },
  { label: "Teal", value: "#114952" },
];

const emptyForm = {
  name: "",
  username: "",
  answer: "",
  recipient_type: "general",
  puzzle_type: "layered",
  caesar_shift: 3,
  keyword: "grad",
  profile_color: PROFILE_COLORS[0].value,
  first_met_year: "",
  college_year_first_met: "",
  puzzle_clue: DEFAULT_LAYERED_CLUE_PREVIEW,
  message: "",
  video_url: "",
  memories: "",
  gratitude: "",
  future_message: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<RecipientRow[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/recipients");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setRows(data.recipients);
    setStats(data.stats);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleReset(id: string) {
    if (!confirm("Reset this person's puzzle progress and attempts?")) return;
    await fetch(`/api/admin/recipients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset_progress: true }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipient permanently?")) return;
    await fetch(`/api/admin/recipients/${id}`, { method: "DELETE" });
    load();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    const res = await fetch("/api/admin/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        first_met_year: form.first_met_year ? Number(form.first_met_year) : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(data.error ?? "Something went wrong.");
      return;
    }
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  if (!rows || !stats) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-ink/60">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-8 py-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Recipients</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-ink/50 hover:text-ink underline"
        >
          Log out
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Unlocked" value={stats.unlocked} accent="#78873A" />
        <StatCard label="Not yet" value={stats.notUnlocked} accent="#C3185B" />
        <StatCard label="Attempts" value={stats.totalAttempts} accent="#E2892B" />
      </div>

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mb-6 px-5 py-2.5 rounded-full bg-teal text-cream text-sm font-semibold hover:bg-teal-dark transition-colors"
      >
        {showForm ? "Cancel" : "+ Add recipient"}
      </button>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-10 bg-paper border border-ink/10 rounded-xl p-5 grid sm:grid-cols-2 gap-3"
        >
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => {
              const derived = v.trim().toLowerCase();
              setForm({ ...form, name: v, username: derived, answer: derived });
            }}
            required
          />
          <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-ink/70">Puzzle answer</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.answer}
                required
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="flex-1 rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-marigold bg-white"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, answer: form.username.trim().toLowerCase() })}
                className="px-3 rounded-lg border border-ink/15 text-xs text-ink/60 hover:border-marigold hover:text-ink whitespace-nowrap"
                title="Copy the username field into the answer — recipients unlock with their own username"
              >
                Use username
              </button>
            </div>
          </div>
          <Select
            label="Recipient type"
            value={form.recipient_type}
            onChange={(v) => setForm({ ...form, recipient_type: v })}
            options={["general", "core"]}
          />
          <Select
            label="Puzzle type"
            value={form.puzzle_type}
            onChange={(v) => {
              const next: typeof form = { ...form, puzzle_type: v };
              if (v === "layered" && !form.puzzle_clue) {
                next.puzzle_clue = DEFAULT_LAYERED_CLUE_PREVIEW;
              }
              setForm(next);
            }}
            options={["layered"]}
          />
          {form.puzzle_type === "layered" && (
            <Field
              label="Vigenère keyword"
              value={form.keyword}
              onChange={(v) => setForm({ ...form, keyword: v })}
            />
          )}
          <ColorPicker value={form.profile_color} onChange={(v) => setForm({ ...form, profile_color: v })} />
          <Field label="Year first met" value={form.first_met_year} onChange={(v) => setForm({ ...form, first_met_year: v })} />
          <Field
            label="College year met"
            value={form.college_year_first_met}
            onChange={(v) => setForm({ ...form, college_year_first_met: v })}
          />
          <TextArea
            label={form.puzzle_type === "layered" ? "Clue poem (one line per layer)" : "Puzzle clue / riddle text"}
            value={form.puzzle_clue}
            onChange={(v) => setForm({ ...form, puzzle_clue: v })}
            full
          />
          {form.puzzle_type === "layered" && (
            <p className="sm:col-span-2 text-xs text-ink/40 -mt-2">
              Defaults to a poem describing each layer without naming the ciphers.
              The answer is decrypted with the keyword above, so most people can
              just leave "Use name" as the answer.
            </p>
          )}

          {form.recipient_type === "general" ? (
            <TextArea label="Letter" value={form.message} onChange={(v) => setForm({ ...form, message: v })} full />
          ) : (
            <>
              <Field label="Video URL" value={form.video_url} onChange={(v) => setForm({ ...form, video_url: v })} full />
              <TextArea label="The Moments I Keep (memories)" value={form.memories} onChange={(v) => setForm({ ...form, memories: v })} full />
              <TextArea label="What You Mean to Me (gratitude)" value={form.gratitude} onChange={(v) => setForm({ ...form, gratitude: v })} full />
              <TextArea label="Wherever Life Takes Us (future)" value={form.future_message} onChange={(v) => setForm({ ...form, future_message: v })} full />
            </>
          )}

          {formError && <p className="text-magenta text-sm sm:col-span-2">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 mt-2 py-2.5 rounded-full bg-marigold text-cream font-semibold hover:bg-marigold-light transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save recipient"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left text-ink/60">
            <tr>
              <th className="px-4 py-3 font-medium">Recipient</th>
              <th className="px-4 py-3 font-medium">Attempts</th>
              <th className="px-4 py-3 font-medium">Unlocked</th>
              <th className="px-4 py-3 font-medium">Unlocked at</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{r.name}</div>
                  <div className="text-ink/40">@{r.username} · {r.recipient_type}</div>
                </td>
                <td className="px-4 py-3 text-ink/70">{r.attempt_count}</td>
                <td className="px-4 py-3">
                  {r.unlocked ? (
                    <span className="text-olive font-medium">Yes</span>
                  ) : (
                    <span className="text-ink/40">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink/60">
                  {r.unlocked_at ? new Date(r.unlocked_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleReset(r.id)}
                    className="text-marigold hover:underline mr-3"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-magenta hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent = "#2B1B24" }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-paper px-4 py-3">
      <p className="text-2xl font-display" style={{ color: accent }}>{value}</p>
      <p className="text-xs text-ink/50">{label}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  full,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  full?: boolean;
  type?: string;
}) {
  return (
    <label className={`text-sm text-ink/70 flex flex-col gap-1 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-marigold bg-white"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
}) {
  return (
    <label className={`text-sm text-ink/70 flex flex-col gap-1 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-marigold bg-white"
      />
    </label>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-ink/70">Profile color</span>
      <div className="flex gap-2 flex-wrap">
        {PROFILE_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            title={c.label}
            aria-label={c.label}
            className={`h-8 w-8 rounded-full border-2 transition-transform ${
              value === c.value ? "border-ink scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="text-sm text-ink/70 flex flex-col gap-1">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-marigold bg-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
