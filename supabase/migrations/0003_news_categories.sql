create table public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index news_categories_lower_name_idx
  on public.news_categories (lower(name));

alter table public.news_categories enable row level security;

create policy "Anyone can read news categories"
  on public.news_categories for select
  using (true);

create policy "Authenticated users can create news categories"
  on public.news_categories for insert
  to authenticated
  with check (length(trim(name)) > 0);

insert into public.news_categories (name, sort_order)
values
  ('Nyhed', 10),
  ('Jagt', 20),
  ('Præmieskydning', 30),
  ('Klubaften', 40),
  ('Praktisk info', 50)
on conflict do nothing;
