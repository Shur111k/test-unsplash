create table public.saved_photos (
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_id text not null check (photo_id ~ '^[A-Za-z0-9_-]{1,128}$'),
  alt text not null check (length(btrim(alt)) between 1 and 500),
  image_url text not null check (
    length(image_url) between 1 and 5000
    and (image_url ~ '^https://(images|plus)\.unsplash\.com/' or image_url ~ '^data:image/svg\+xml,')
  ),
  photo_url text not null check (
    length(photo_url) between 1 and 2048
    and photo_url ~ '^https://(www\.)?unsplash\.com/'
  ),
  author_name text not null check (length(btrim(author_name)) between 1 and 200),
  author_profile_url text not null check (
    length(author_profile_url) between 1 and 2048
    and author_profile_url ~ '^https://(www\.)?unsplash\.com/'
  ),
  width integer not null check (width between 1 and 100000),
  height integer not null check (height between 1 and 100000),
  color text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  saved_at timestamptz not null default now(),
  primary key (user_id, photo_id)
);

create index saved_photos_recent_idx
  on public.saved_photos (user_id, saved_at desc, photo_id);

alter table public.saved_photos enable row level security;

revoke all on public.saved_photos from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, delete on public.saved_photos to authenticated;

create policy "Users can read their saved photos"
  on public.saved_photos for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can save their own photos"
  on public.saved_photos for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own photos"
  on public.saved_photos for delete to authenticated
  using ((select auth.uid()) = user_id);
