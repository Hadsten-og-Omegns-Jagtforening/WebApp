-- Storage bucket for admin news uploads
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

-- Public can read uploaded news images
create policy "Public can read news images"
  on storage.objects for select
  using (bucket_id = 'news-images');

-- Authenticated admins can manage uploaded news images
create policy "Authenticated users can upload news images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'news-images');

create policy "Authenticated users can update news images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'news-images')
  with check (bucket_id = 'news-images');

create policy "Authenticated users can delete news images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'news-images');
