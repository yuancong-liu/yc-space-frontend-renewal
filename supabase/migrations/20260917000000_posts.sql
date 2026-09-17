-- Posts, and who is allowed to write them.
--
-- The CMS already gates sign-in with CMS_ALLOWED_EMAILS, but that check lives
-- in the app: the Supabase anon key is public, so anyone could call the auth
-- API directly and end up `authenticated`. The authors table is the same gate
-- at the database, where it actually holds.

create extension if not exists pgcrypto;

-- ===== Authors =====

create table public.authors (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.authors enable row level security;

-- No policies: the table is readable and writable only through the service
-- role and the SQL editor. Add yourself with
--   insert into public.authors (email) values ('you@example.com');

/**
 * Security definer so the policies below can consult authors without every
 * caller needing to read it. The empty search_path stops a caller's own
 * search_path from resolving `authors` to something they control.
 */
create function public.is_author()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.authors
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- ===== Posts =====

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text not null default '',
  language text not null default 'English'
    check (language in ('English', '中文', '日本語')),
  tags text[] not null default '{}',
  -- null means draft; a future value means scheduled
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.posts.published_at is
  'Null while a draft. The public policy only exposes rows whose value is in the past, so setting a future date schedules the post.';

create index posts_published_at_idx
  on public.posts (published_at desc)
  where published_at is not null;

create index posts_tags_idx on public.posts using gin (tags);

create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_touch_updated_at
  before update on public.posts
  for each row
  execute function public.touch_updated_at();

-- ===== Row level security =====

alter table public.posts enable row level security;

-- Supabase grants these by default for new tables in `public`, but saying so
-- here means the migration stands on its own: RLS decides which rows a role
-- sees, grants decide whether it may ask at all.
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant execute on function public.is_author() to anon, authenticated;

-- The public site reads with the anon key, so this policy is the whole of its
-- access: drafts and scheduled posts are invisible, not merely unlinked.
create policy posts_public_read
  on public.posts
  for select
  to anon, authenticated
  using (published_at is not null and published_at <= now());

create policy posts_author_read
  on public.posts
  for select
  to authenticated
  using (public.is_author());

create policy posts_author_insert
  on public.posts
  for insert
  to authenticated
  with check (public.is_author());

create policy posts_author_update
  on public.posts
  for update
  to authenticated
  using (public.is_author())
  with check (public.is_author());

create policy posts_author_delete
  on public.posts
  for delete
  to authenticated
  using (public.is_author());
