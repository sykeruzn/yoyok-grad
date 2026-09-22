# college-years

A small, personal graduation-gift website. Friends scan a QR code on a
bracelet, land on their own page, solve a tiny personalized code, and unlock
a letter written just for them.

Stack: **Next.js 14** (App Router) + **Supabase** (Postgres) + **Tailwind**.
Both have generous free tiers, which is why they're used here.

---

## 1. Set up Supabase (the database)

1. Go to [supabase.com](https://supabase.com), create a free account and a new project.
2. Once it's ready, open **SQL Editor → New query**, paste in the contents of
   `supabase/schema.sql`, and run it. This creates the one `recipients` table
   everything else reads and writes.
3. Open **Project Settings → API**. You'll need two values in a moment:
   - **Project URL**
   - **service_role key** (not the `anon` key — this one bypasses Row Level
     Security, and is the whole reason the recipients table can stay locked
     down while your server still reads/writes it)

## 2. Configure the app

```bash
cp .env.example .env.local
```

Fill in:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from step 1.
- `ADMIN_SESSION_SECRET` — any long random string, e.g. `openssl rand -hex 32`.
- `ADMIN_PASSWORD_HASH` — run this and paste the output:

  ```bash
  npm install
  npm run hash -- "the-password-you-want-for-/admin"
  ```
- `GIVER_NAME` and `CORE_UNLOCK_AT` — see **Core-friend reveal date** below.

## 3. Core-friend reveal date

Your 13 closest friends (`recipient_type = core`) can be held back from
unlocking their letter until a specific day, so all of them get their video +
story sections at the same moment instead of trickling in as people scan
their bracelets. Set this in `.env.local` (and in Vercel once deployed):

```
GIVER_NAME=Syke
CORE_UNLOCK_AT=2026-09-25
```

Until that date, a core recipient who opens their link sees a popup instead
of their puzzle:

> **Oops! Sorry, {name}.**
> This means you're part of Syke's core people — and those letters unlock
> together, a little later.
> **September 25, 2026**

`general` recipients are never affected by this — they unlock the moment
they solve their puzzle, any time. Leave `CORE_UNLOCK_AT` blank if you don't
want this gate at all.

## 4. Try it locally

```bash
npm run dev
```

Optionally seed two placeholder recipients so you can see the full flow
before adding real people:

```bash
npm run seed
```

This prints two links, e.g. `/u/demo-maria` (answer: `HI`) and `/u/demo-alex`
(answer: `FRIEND`). Open one, solve the puzzle, and you'll land on a
personalized page. Delete both from `/admin` once you're happy — they're
clearly named `(demo)` so you never confuse them with real recipients.

Visit `/admin`, log in with the password you hashed above, and you're in the
dashboard: stats, the recipient table, and an "Add recipient" form.

## 5. Add your real friends

From `/admin`, click **Add recipient** for each person. You'll fill in:

- **Name**, **username** (this becomes their URL: `/u/whatever-you-pick`)
- **Puzzle answer** — click **Use name** to default it to their name (which
  is also usually their username), or type something else for a nickname.
  It's hashed immediately; the plaintext is never stored.
- **Puzzle type** — defaults to **layered**: their name is Vigenère-encrypted
  with a keyword (default `grad`), the result is converted to binary, and
  the binary is converted to Morse — so what they actually see is one string
  of dots and dashes, and solving it takes three small steps. A three-line
  clue poem is pre-filled (one line per layer, without naming any cipher by
  type) — edit it if you want your own wording. The older single-layer types
  (`binary`, `hex`, `ascii`, `morse`, `caesar`, `riddle`) are still available
  if you'd rather mix in a few simpler ones.
- **Recipient type** — `core` (the 13 closest friends: video + the
  Past/Present/Future sections) or `general` (a single letter).
- Their content: the letter, or the video URL + three story sections.

You don't need to touch any code to add, edit, or remove a person — it's all
data-driven from the one `recipients` table.

> **Already ran `schema.sql` once before this update?** Open the SQL editor
> again and run just the migration block at the bottom of `supabase/schema.sql`
> — it adds the `layered` puzzle type to the existing table without touching
> any data you've already entered.

## 6. Deploy

The easiest path is [Vercel](https://vercel.com) (free tier is plenty for
this):

1. Push this folder to a GitHub repo.
2. Import it in Vercel.
3. Add the same four environment variables from `.env.local` in the Vercel
   project's **Settings → Environment Variables**.
4. Deploy. You'll get a URL like `https://your-project.vercel.app`.
5. (Optional) Point a custom domain at it from Vercel's Domains tab.

## 7. Generate the QR codes

Each recipient's URL is `https://your-domain.com/u/their-username` — that's
all the QR code needs to encode. Any free QR generator (e.g.
[qr-code-generator.com](https://www.qr-code-generator.com/)) works; just
paste in each URL. The QR never contains a password/answer — only the
Supabase-side puzzle does.

## 8. Hosting the video (core friends)

The `video_url` field just needs a direct link to a playable `.mp4` file. The
simplest free options: upload to Supabase Storage and use its public URL, or
Cloudflare R2 / a Google Drive direct-download link. Keep files reasonably
compressed (a phone screen doesn't need 4K) so it loads quickly over mobile
data.

## How the pieces fit together

```
app/
  page.tsx                    → generic homepage (fallback if someone
                                 opens the bare domain instead of their link)
  u/[username]/page.tsx       → the whole recipient experience: fetch →
                                 intro → puzzle → unlock → letter/story
  admin/                      → password-protected dashboard
  api/
    recipient/[username]      → public: identity + puzzle (never the answer)
    verify                    → checks the answer, tracks attempts/unlocks
    admin/*                   → recipient CRUD, gated by requireAdmin

lib/
  supabase.ts    → server-only Supabase client (service role key)
  puzzle.ts      → binary/hex/ascii/morse/caesar encoders + answer normalizer
  adminAuth.ts   → signed admin session cookie (no auth library needed)

components/      → Avatar, botanical ornaments, puzzle display, letter/story
                   layouts — all data-driven, no per-person files
```

## Security notes

- Puzzle answers are bcrypt-hashed; the plaintext only ever exists in your
  browser while you're typing it into `/admin`, and in the recipient's head.
- All recipient data access goes through server API routes using the
  Supabase **service role** key — the key never reaches the browser, and
  Row Level Security on the table denies direct access entirely.
- A recipient's page only exposes their own letter, and only after they've
  unlocked it — visiting `/u/someone-elses-username` shows nothing but their
  puzzle.
- `/admin` is protected by a single shared password (hashed, never stored in
  plaintext) and a signed, httpOnly session cookie. That's appropriate for a
  small personal project with one admin (you) — it is not built for a
  multi-admin team tool.

## What's intentionally out of scope

This is a real, deployable app, but a few things are left for you to finish
with your own content rather than guessed on your behalf:
- The actual letters, memories, and video files — obviously personal.
- Exact color/puzzle assignment per friend — the admin form makes this fast,
  but the creative choices (who gets which puzzle type, which accent color)
  are yours.
- Final on-device QR testing — test each printed/attached QR code with an
  actual phone camera before the bracelets go out.
