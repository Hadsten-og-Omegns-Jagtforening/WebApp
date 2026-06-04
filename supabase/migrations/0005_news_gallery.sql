-- Gallery of additional images shown below the article body/results.
-- Stored as an ordered jsonb array of public image URLs (same news-images bucket).
alter table public.news
  add column gallery_urls jsonb not null default '[]'::jsonb;
