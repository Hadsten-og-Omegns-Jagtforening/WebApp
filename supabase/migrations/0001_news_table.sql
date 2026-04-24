-- Enable UUID generation
create extension if not exists "pgcrypto";

-- news table
create table public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  category      text not null,
  teaser        text not null,
  body          text not null,
  image_url     text,
  has_results   boolean not null default false,
  results       jsonb,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  highlighted   boolean not null default false,
  allow_comments boolean not null default false,
  published_at  timestamptz,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on every edit
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger news_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- Row-level security
alter table public.news enable row level security;

-- Public: read published posts only
create policy "Public can read published news"
  on public.news for select
  using (status = 'published');

-- Authenticated (admin): full access
create policy "Admin full access"
  on public.news for all
  to authenticated
  using (true)
  with check (true);
