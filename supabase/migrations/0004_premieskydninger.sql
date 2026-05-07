-- Præmieskydninger events table
CREATE TABLE public.premieskydninger (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         text        NOT NULL UNIQUE,
  title        text        NOT NULL,
  month_label  text        NOT NULL,
  icon         text        NOT NULL DEFAULT 'trophy',
  description  text        NOT NULL DEFAULT '',
  reglement    text        NOT NULL DEFAULT '',
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.premieskydninger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read premieskydninger"
  ON public.premieskydninger FOR SELECT USING (true);

CREATE POLICY "Authenticated write premieskydninger"
  ON public.premieskydninger FOR ALL USING (auth.role() = 'authenticated');

-- Seed with existing static data
INSERT INTO public.premieskydninger (slug, title, month_label, icon, description, reglement, sort_order)
VALUES
  ('fastelavnsskydning',   'Fastelavnsskydning',     'Feb',     'trophy',      'Årets første præmieskydning med rundstykker i klubhuset fra kl. 09.00.', '', 1),
  ('hoj-cup',              'HOJ Cup',                'Apr-Sep', 'trophy',      'Seks runder henover sæsonen. Samlet vinder kåres til juleskydningen.',   '', 2),
  ('skt-hans-midsommer',   'Skt. Hans / Midsommer',  'Jun',     'trophy',      'Midsommerskydning med grill og fællesspisning efter skydningen.',        '', 3),
  ('maerkeskydning',       'Mærkeskydning',          'Aug',     'trophy',      'Foreningsmesterskab med guld-, sølv- og bronzemærker.',                  '', 4),
  ('80-duers-jagtskydning','80 duers jagtskydning',  'Apr',     'claypigeon',  '20 duer i streg på hver af de fire standpladser.',                      '', 5),
  ('juleskydning',         'Juleskydning',           'Dec',     'trophy',      'Sæsonens sidste skydning med præmier, gløgg og æbleskiver.',             '', 6);
