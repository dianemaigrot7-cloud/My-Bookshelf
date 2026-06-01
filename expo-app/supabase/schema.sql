-- My Bookshelf — Supabase schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ── Extensions ────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles (extends auth.users) ────────────────────────────────────
create table if not exists profiles (
  id               uuid primary key references auth.users on delete cascade,
  name             text not null default '',
  photo_url        text,
  bio              text default '',
  district         text default '',
  city             text default '',
  country          text default '',
  created_at       timestamptz not null default now()
);

-- Auto-create profile row when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Books ─────────────────────────────────────────────────────────────
create table if not exists books (
  id              uuid primary key default uuid_generate_v4(),
  isbn            text,
  title           text not null,
  author          text,
  cover_image_url text,
  current_owner   uuid references profiles(id) on delete set null,
  is_available    boolean not null default true,
  price           numeric(6,2) not null default 0,
  is_free         boolean not null default false,
  condition       text check (condition in ('As New','Used','Quite Old')) default 'Used',
  genre           text,
  created_at      timestamptz not null default now()
);

-- ── Ownership / Book Passport ─────────────────────────────────────────
-- One row per (book, owner) pair — this IS the passport backbone.
create table if not exists ownership (
  id            uuid primary key default uuid_generate_v4(),
  book_id       uuid not null references books(id) on delete cascade,
  owner_id      uuid not null references profiles(id) on delete cascade,
  city          text,
  country       text,
  date_received date not null default current_date,
  condition     text,
  rating        smallint check (rating between 1 and 5),
  review_text   text,
  created_at    timestamptz not null default now()
);

-- ── Messages ──────────────────────────────────────────────────────────
create table if not exists messages (
  id          uuid primary key default uuid_generate_v4(),
  sender_id   uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  book_id     uuid references books(id) on delete set null,
  content     text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ── Consents (GDPR) ───────────────────────────────────────────────────
create table if not exists consents (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references profiles(id) on delete cascade,
  analytics      boolean not null default false,
  personalise    boolean not null default false,
  location       boolean not null default true,
  policy_version text not null default '1.0',
  created_at     timestamptz not null default now(),
  unique (user_id, policy_version)
);

-- ── Row-Level Security ────────────────────────────────────────────────
alter table profiles  enable row level security;
alter table books     enable row level security;
alter table ownership enable row level security;
alter table messages  enable row level security;
alter table consents  enable row level security;

-- Profiles: anyone can read; only you can update yours
create policy "Profiles are publicly readable"
  on profiles for select using (true);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Books: anyone can read available books; only owner can insert/update
create policy "Books are publicly readable"
  on books for select using (true);
create policy "Owners can insert books"
  on books for insert with check (auth.uid() = current_owner);
create policy "Owners can update their books"
  on books for update using (auth.uid() = current_owner);

-- Ownership: anyone can read (passport is public); only owner can insert
create policy "Ownership history is publicly readable"
  on ownership for select using (true);
create policy "Owners can add ownership records"
  on ownership for insert with check (auth.uid() = owner_id);

-- Messages: only sender or receiver can read/write
create policy "Users can read their own messages"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send messages"
  on messages for insert with check (auth.uid() = sender_id);

-- Consents: only the user
create policy "Users manage own consents"
  on consents for all using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────
create index if not exists idx_books_owner     on books(current_owner);
create index if not exists idx_books_available on books(is_available);
create index if not exists idx_ownership_book  on ownership(book_id);
create index if not exists idx_ownership_owner on ownership(owner_id);
create index if not exists idx_messages_sender on messages(sender_id);
create index if not exists idx_messages_recv   on messages(receiver_id);

-- ── Realtime ─────────────────────────────────────────────────────────
-- Enable realtime for messages (live chat)
alter publication supabase_realtime add table messages;
