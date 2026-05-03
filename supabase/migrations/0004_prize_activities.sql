create table public.prize_activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  month_label text not null,
  card_description text not null,
  body text not null,
  icon text not null default 'trophy',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prize_activities_slug_key unique (slug)
);

create trigger prize_activities_updated_at
  before update on public.prize_activities
  for each row execute function public.set_updated_at();

alter table public.prize_activities enable row level security;

create policy "Public can read active prize activities"
  on public.prize_activities for select
  using (is_active = true);

create policy "Authenticated users can manage prize activities"
  on public.prize_activities for all
  to authenticated
  using (true)
  with check (true);

insert into public.prize_activities (slug, title, month_label, card_description, body, icon, sort_order, is_active)
values
  (
    'fastelavnsskydning',
    'Fastelavnsskydning',
    'Februar',
    'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    '<p>Fastelavnsskydningen er en af årets faste traditioner på banen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    'trophy',
    10,
    true
  ),
  (
    'hoj-cup',
    'HOJ Cup',
    'April-september',
    'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    '<p>HOJ Cup samler skytter gennem sæsonen. Detaljer, tilmelding og resultater offentliggøres her, når runderne nærmer sig.</p>',
    'trophy',
    20,
    true
  ),
  (
    'skt-hans-midsommer',
    'Skt. Hans / Midsommer',
    'Juni',
    'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    '<p>Skt. Hans / Midsommer er en hyggelig skydning i sommersæsonen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    'trophy',
    30,
    true
  ),
  (
    'maerkeskydning',
    'Mærkeskydning',
    'August',
    'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    '<p>Mærkeskydning afholdes i løbet af sæsonen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    'trophy',
    40,
    true
  ),
  (
    '80-duers-jagtskydning',
    '80 duers jagtskydning',
    'April',
    'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    '<p>80 duers jagtskydning er for dig, der vil have en længere skydedag. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    'claypigeon',
    50,
    true
  ),
  (
    'juleskydning',
    'Juleskydning',
    'December',
    'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    '<p>Juleskydningen runder året af på banen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    'trophy',
    60,
    true
  )
on conflict (slug) do nothing;
