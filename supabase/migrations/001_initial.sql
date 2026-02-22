-- Wedding Invite Database Schema

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Invitees table
create table if not exists invitees (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_ar text not null default '',
  slug text unique not null,
  email text,
  phone text,
  max_guests integer not null default 2,
  language_preference text not null default 'en' check (language_preference in ('en', 'ar')),
  created_at timestamptz not null default now()
);

-- RSVP responses table (group model: multiple responses per invitee)
create table if not exists rsvp_responses (
  id uuid primary key default uuid_generate_v4(),
  invitee_id uuid references invitees(id) on delete set null,
  name text not null,
  email text not null default '',
  attending text not null check (attending in ('accept', 'decline')),
  message text not null default '',
  submitted_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_invitees_slug on invitees(slug);
create index if not exists idx_rsvp_invitee_id on rsvp_responses(invitee_id);
create index if not exists idx_rsvp_email on rsvp_responses(email);

-- Row Level Security
alter table invitees enable row level security;
alter table rsvp_responses enable row level security;

-- Policies: allow service role full access (API routes use service role key)
create policy "Service role full access to invitees"
  on invitees for all
  using (true)
  with check (true);

create policy "Service role full access to rsvp_responses"
  on rsvp_responses for all
  using (true)
  with check (true);
