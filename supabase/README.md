# Supabase

Schema and content for the `posts` table. There is no local Supabase stack —
see the environments note in [AGENTS.md](../AGENTS.md) — so these are applied
through the dashboard's SQL editor, or with the CLI once it is set up.

## Applying

1. **Schema** — run `migrations/20260917000000_posts.sql`.
2. **Authorise yourself** — the migration deliberately leaves `authors` empty:

   ```sql
   insert into public.authors (email) values ('you@example.com');
   ```

   Use the same address as `CMS_ALLOWED_EMAILS`. Until this row exists the CMS
   signs in but sees no drafts and cannot save.

3. **Content** — run `seed/posts.sql` to load the archive. It is generated and
   re-runnable: a slug that already exists is updated in place.

## Why `authors` and not just "any signed-in user"

`CMS_ALLOWED_EMAILS` gates who the CMS will send a sign-in link to, but that
check lives in the app. The anon key is public, so someone could call the
Supabase auth API directly and become `authenticated`. Every write policy
therefore goes through `public.is_author()`, which consults this table — the
same gate, at the database, where it holds.

The public site reads with the anon key and is covered by one policy:
`published_at is not null and published_at <= now()`. Drafts are invisible
rather than merely unlinked, and a future date schedules a post.

## Regenerating the seed

```bash
bun run import-posts ../portfolio-site/src/posts
```

`scripts/import-posts.ts` converts the previous site's MDX: `<PostFrame />`
becomes `::frame{…}`, `<br>` becomes a hard break, and every post is rendered
through `@yc/markdown` so anything the pipeline would drop fails the run rather
than the migration.

Front matter dates are bare wall-clock times and are read as JST. YAML resolves
a zoneless timestamp as UTC, which is nine hours out — the previous site
inherited that and formatted through the reader's own timezone, so the day it
showed depended on where you were.
