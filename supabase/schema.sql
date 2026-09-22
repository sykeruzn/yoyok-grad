-- College Years — database schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create extension if not exists pgcrypto;

create table if not exists recipients (
  id uuid primary key default gen_random_uuid(),

  -- identity
  name text not null,
  username text not null unique,
  password_hash text not null,          -- bcrypt hash of the puzzle answer, lowercased + trimmed before hashing

  -- personalization
  recipient_type text not null default 'general' check (recipient_type in ('core', 'general')),
  profile_color text not null default '#C3185B',
  profile_icon text,                     -- optional override; defaults to first initial of name
  first_met_year int,
  college_year_first_met text,           -- e.g. "Freshman Year"

  -- the puzzle (never store the plaintext answer — only password_hash above does)
  puzzle_type text not null default 'layered' check (puzzle_type in ('layered', 'binary', 'caesar', 'hex', 'morse', 'ascii', 'riddle')),
  puzzle_data jsonb not null default '{}'::jsonb,   -- what the puzzle needs to RENDER (e.g. {"cipher":"...","shift":3}); never the answer
  puzzle_clue text,                      -- optional extra hint line shown under the puzzle

  -- content
  message text,                          -- general recipients: the letter
  video_url text,                        -- core recipients: self-hosted/embed URL
  memories text,                         -- core: "The Moments I Keep"
  gratitude text,                        -- core: "What You Mean to Me"
  future_message text,                   -- core: "Wherever Life Takes Us"

  -- tracking
  unlocked boolean not null default false,
  attempt_count int not null default 0,
  unlocked_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipients_username_idx on recipients (username);

-- Keep updated_at current on every write.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists recipients_set_updated_at on recipients;
create trigger recipients_set_updated_at
  before update on recipients
  for each row execute function set_updated_at();

-- Row Level Security: deny all direct access. Every read/write goes through the
-- Next.js API routes using the Supabase SERVICE ROLE key on the server only —
-- the anon/public key is never used, so no policies need to be opened up.
alter table recipients enable row level security;

-- ── Migration: adds the "layered" puzzle type ──────────────────────────────
-- Already ran the schema above once and just pulled a newer copy of this
-- file? Run this block too — it's safe to re-run and only changes the
-- puzzle_type constraint/default, nothing else.
do $$
begin
  alter table recipients drop constraint if exists recipients_puzzle_type_check;
  alter table recipients add constraint recipients_puzzle_type_check
    check (puzzle_type in ('layered', 'binary', 'caesar', 'hex', 'morse', 'ascii', 'riddle'));
  alter table recipients alter column puzzle_type set default 'layered';
end $$;
