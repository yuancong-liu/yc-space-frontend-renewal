> **Sync requirement:** Keep this file in sync with `CLAUDE.md`. Any modification to either file must be applied to the other in the same change.

# AGENTS.md - YC Space Frontend Renewal

## Project Overview

Personal portfolio/blog site renewal. Migrating from [portfolio-site](https://github.com/yuancong-liu/portfolio-site) (Next.js 14 + SCSS) to a modern stack.

The repository is a **bun workspaces + Turborepo monorepo**: the public site and the CMS are separate Next.js apps that share UI, tooling and (soon) the markdown renderer that powers both post rendering and CMS preview.

## Tech Stack

- **Monorepo:** bun workspaces + Turborepo
- **Framework:** Next.js 16 (App Router, Turbopack default)
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **UI Components:** shadcn/ui (Radix primitives, New York style)
- **Icons:** Lucide React
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Analytics:** @vercel/analytics (site only)
- **Node.js:** 24.15.0 (managed via asdf)
- **Package Manager:** bun
- **Deployment:** Vercel — one project per app

## Project Structure

```
.
├── turbo.json              # Task graph (build, lint, test, e2e, storybook)
├── package.json            # Workspaces + root scripts (everything runs through turbo)
├── scripts/import-posts.ts # MDX archive → seed SQL, verified through the renderer
├── supabase/               # Schema migration, generated seed, apply instructions
├── apps/
│   ├── site/               # @yc/site — public site, no auth, port 3000
│   │   ├── e2e/            # Playwright specs
│   │   ├── .storybook/     # Storybook (scans apps/site AND packages/ui)
│   │   └── src/
│   │       ├── app/        # / , /blog , /blog/[slug] , /blog/tags , /portfolio , /about-me , /and
│   │       │               #   plus robots.ts, sitemap.ts, api/revalidate/
│   │       ├── assets/
│   │       ├── components/ # Site-only components (site-header, env-banner, pages/home)
│   │       ├── lib/
│   │       │   ├── env.ts            # Which deployment this is, and its origin
│   │       │   └── revalidate-paths.ts # Which paths a post change invalidates
│   │       └── styles/globals.css
│   └── cms/                # @yc/cms — authenticated back office, port 3001
│       └── src/
│           ├── app/
│           │   ├── (app)/              # Signed-in area: dashboard, posts, preview
│           │   ├── actions.ts          # signOut server action
│           │   ├── login/              # Sign-in page, form, server action
│           │   └── auth/confirm/       # Magic-link landing (token_hash or PKCE code)
│           ├── components/
│           ├── lib/
│           │   ├── auth/allowlist.ts   # CMS_ALLOWED_EMAILS gate
│           │   ├── env.ts              # Lazy Supabase env access
│           │   ├── revalidate.ts       # Tells every site deployment a post changed
│           │   └── supabase/           # client / server / proxy factories
│           ├── proxy.ts                # Next proxy (ex-middleware) — session + route gate
│           └── styles/globals.css
└── packages/
    ├── ui/                 # @yc/ui — cn(), theme.css, shadcn components, ThemeRadio
    ├── markdown/           # @yc/markdown — post renderer shared by site and CMS
    ├── content/            # @yc/content — Post type, row mapper, excerpt, tag slugs
    ├── eslint-config/      # @yc/eslint-config — shared flat config factory
    └── tsconfig/           # @yc/tsconfig — base / nextjs / react-library
```

### Adding a workspace

New app → `apps/<name>`, new shared package → `packages/<name>`. Name it `@yc/<name>`, depend on shared config with `"@yc/eslint-config": "workspace:*"` / `"@yc/tsconfig": "workspace:*"`, then `bun install` to link it.

## Commands

All root commands fan out through Turborepo. Use `--filter=@yc/site` / `--filter=@yc/cms` to narrow, or `cd` into the workspace.

```bash
bun install               # Install every workspace
bun run dev               # Dev servers: site :3000, cms :3001
bun run dev:site          # Site only
bun run dev:cms           # CMS only
bun run build             # Production build (both apps)
bun run lint              # ESLint in every workspace
bun run typecheck         # tsc --noEmit in the shared packages
bun run test              # Vitest unit tests
bun run test:coverage     # Vitest with coverage
bun run e2e               # Playwright E2E (apps/site)
bun run storybook         # Storybook dev server (apps/site, :6006)
bun run storybook:build   # Storybook static build
bun run format            # Prettier write
```

## Code Conventions

### TypeScript

- Use `type` keyword (not `interface`) for type definitions (`@typescript-eslint/consistent-type-definitions`)
- Use `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`)
- PascalCase for type names
- Unused vars prefixed with `_`

### React / JSX

- **Arrow functions only** for components (`react/function-component-definition`)
- Export components as named exports on the component (e.g. `export const Foo = () => {}`). No default exports in `src/components/` or in `packages/ui`
- Import components with named imports only (e.g. `import { Foo } from '@yc/ui'`)
- JSX props sorted alphabetically, callbacks last, shorthand first, reserved first
- Self-closing tags for empty elements
- No `React.` namespace access — use named imports
- Lucide icon imports must use `XxxxIcon` suffix (e.g., `SunIcon`, `MonitorIcon`, not `Sun`, `Monitor`)

### Imports

- Ordered by: builtin > external (`react` first, `@yc/*` last) > internal (`@/*`) > parent > sibling > index
- Alphabetized within groups (case-insensitive)
- Newline between groups
- No unused imports (`unused-imports/no-unused-imports`)
- **Inside `packages/ui`, use relative imports** — never `@/`. The alias belongs to the consuming app, so `@/lib/utils` inside the package resolves to the app's `src/` and breaks the build.

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` from `@yc/ui` to merge conditional classes
- Custom colors via CSS variables (not hardcoded hex values)

## Theme System

CSS-driven dark/light/system theme switching using `:has()` selector with radio inputs. Tokens live in `packages/ui/src/styles/theme.css` and are shared by both apps.

### Color Palette (CSS Variables)

| Variable            | Light   | Dark    | Description          |
| ------------------- | ------- | ------- | -------------------- |
| `--color-text`      | #150640 | #fdfbf8 | Primary text         |
| `--color-bg-1`      | #fdfbf8 | #150640 | Page background      |
| `--color-bg-2`      | #f1e6e0 | #2e2364 | Secondary background |
| `--color-accent-1`  | #ff8f97 | #e44458 | Primary accent       |
| `--color-accent-2`  | #e44458 | #ff8f97 | Secondary accent     |
| `--color-surface-1` | #2e2364 | #f1e6e0 | Surface color        |
| `--color-surface-2` | #150640 | #fdfbf8 | Surface secondary    |

### Tailwind Usage

Variables are registered as Tailwind tokens — use `text-text`, `bg-bg-1`, `bg-accent-1`, etc.

### Mechanism

- Hidden radio inputs (`#theme-system`, `#theme-light`, `#theme-dark`) control theme
- CSS `:has(#theme-light:checked)` activates light mode variables
- `@media (prefers-color-scheme)` + `:has(#theme-system:checked)` for system mode
- 0.3s transitions on color/background changes

### Per-app CSS entry

Each app owns `src/styles/globals.css`, which must do all three:

```css
@import 'tailwindcss';
@import '@yc/ui/styles/theme.css';
@source '../../../../packages/ui/src'; /* Tailwind v4 only scans the app by default */
```

App-specific chrome (`.site-header`, `.cms-header`, …) stays in that file, not in the shared package.

## CMS Authentication

Supabase Auth with a passwordless e-mail link, gated by a hard allowlist.

- `src/proxy.ts` runs on every non-asset request: refreshes the session cookie, re-validates with `getUser()`, and redirects. `/login` and `/auth/*` are the only public paths.
- `CMS_ALLOWED_EMAILS` (comma-separated) decides who may sign in. **Unset means nobody** — the gate fails closed. It is enforced in three places: before sending the link, in the callback, and on every request. The proxy runs on the edge, so Next inlines the value at build time — changing it on Vercel needs a redeploy.
- `/auth/confirm` accepts both `?token_hash=…&type=…` (the recommended e-mail template) and `?code=…` (PKCE), and only honours `/`-relative `next` values.
- Never hoist a Supabase client to a module constant, and never put an `await` between `createServerClient()` and `getUser()` — that is the classic cause of randomly logged-out users.
- Env vars are read lazily via `src/lib/env.ts` so `next build` and CI work without secrets; `/login` renders a setup notice when Supabase is unconfigured.

### Environments

There is one Supabase project, so local and preview deployments talk to the live
database. `EnvBanner` says so on every non-production deployment rather than
relying on memory — keep it that way until a separate development project or a
local Supabase stack exists.

### Supabase dashboard setup

1. **Authentication → URL Configuration:** Site URL = the CMS origin; add `<origin>/auth/confirm` to Redirect URLs.
2. **Authentication → Email Templates → Magic Link:** point the link at
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
3. **Authentication → Providers → Email:** enable; disable other providers.

## Content

`posts` lives in Supabase; `@yc/content` holds the shape both apps agree on
(`Post`, `toPost`, `postStatus`, `tagSlug`, `excerpt`). Neither the type nor the
excerpt logic should be restated in an app.

- **The site reads with the anon key.** `posts_public_read` limits it to rows
  whose `published_at` has passed, so drafts are invisible rather than merely
  unlinked and a future date schedules a post. The site's queries add ordering,
  nothing more — never a `published_at` filter, which would imply the policy is
  optional.
- **The CMS reads as an author**, which adds drafts through `posts_author_read`.
  Every write goes through `public.is_author()`; see `supabase/README.md` for
  why that gate has to exist in the database and not only in the app.
- **Both data layers degrade to empty when Supabase is unconfigured**, which is
  what lets `next build` and CI run without secrets. Keep it that way.
- **Dates are formatted in the author's timezone** (`apps/site/src/lib/dates.ts`),
  not the reader's. A post belongs to the day its author put on it.

Post form parsing lives in `apps/cms/src/lib/post-form.ts`, apart from the
server action, so validation and the publish/unpublish rules are testable
without a database.

### Blog presentation

The blog pages are carried over from the previous site: the index is a tab
switcher whose selected label is the page's title, cards lift on hover with a
hard offset shadow, a post published in the last 30 days gets a fry behind its
card (`isRecent`), and a post page is a large serif title over a tags/date rule.

Its root font-size was 10px, so every rem in the original SCSS is a tenth of
what it looks like — the 10rem selected tab was 100px. The ported CSS in
`apps/site/src/styles/globals.css` is already converted; convert anything
further you bring across.

## Markdown rendering

`@yc/markdown` owns the whole post pipeline. The site renders published posts
with it and the CMS previews with the same processor, so the two cannot drift.

```tsx
import { Markdown } from '@yc/markdown';

<Markdown source={post.body} />;
```

- **Plain Markdown, not MDX.** Post bodies are text in Postgres, never
  executable code, so previews are instant and the database holds nothing that
  runs.
- **Raw HTML is dropped.** `remark-rehype` leaves it out; authors use directives.
- **The pipeline is synchronous** (`processSync`), which is what lets one
  component serve a Server Component and a keystroke-by-keystroke preview.
  `Markdown` is deliberately hook-free; callers memoise on their side.

### Directives

Custom blocks use [remark-directive](https://github.com/remarkjs/remark-directive)
syntax and map to React components:

```
::frame{src="https://codepen.io/…/embed/abc" height=500 title="Subgrid"}
```

To add one: write the component, register it in
`packages/markdown/src/directives/index.ts`, done — both apps pick it up. An
unregistered name renders a visible notice instead of vanishing. Attributes
arrive as strings, so the component parses and validates them (`::frame` rejects
any src that is not https).

**Inline directives (`:name`) are unsupported on purpose.** A single colon
followed by a word is ordinary prose — `16:10`, `12:30`, `note:this` — so the
plugin restores those to their literal source. Only a colon at the start of a
line opens a block.

### Styling

Post typography lives in `packages/markdown/src/styles/markdown.css`, as plain
CSS scoped to `.yc-markdown`. The elements are generated by the pipeline, so
there is nothing to hang utility classes on, and one stylesheet keeps the site
and the preview identical. The syntax palette uses `light-dark()`, which
resolves against the `color-scheme` set in `@yc/ui`'s theme.css.

Watch for invalid nesting when adding components: markdown wraps block-level
constructs in `<p>`, and a browser will not keep a `<figure>` there — the server
HTML and the hydrated DOM would then disagree. `remark-standalone-images`
handles that case by demoting the paragraph; do the same for anything similar.

## shadcn/ui

Shared components live in `packages/ui/src/components/ui/` (`components.json` is configured there). Add with `npx shadcn@latest add <name>` from `packages/ui`, then **rewrite the generated `@/lib/utils` import to a relative path** and re-export the component from `packages/ui/src/index.ts`.

## Testing

- **Types:** `bun run typecheck` runs `tsc --noEmit` in `packages/*`. The apps are covered by `next build`, but a package type error would otherwise only surface there — run it before pushing.
- **Unit tests:** Vitest + Testing Library — `src/**/*.{test,spec}.{ts,tsx}` in each workspace
- **E2E:** Playwright — `apps/site/e2e/`
- **Stories:** Storybook — `packages/*/src/**/*.stories.tsx` and `apps/site/src/**/*.stories.tsx`, config in `apps/site/.storybook/`
- **CI:** lint → typecheck → test → build → e2e on push/PR to `develop` (`.github/workflows/test.yml`)

## Path Aliases

- `@/*` → `<app>/src/*` — inside `apps/site` and `apps/cms` only
- `@yc/ui`, `@yc/eslint-config`, `@yc/tsconfig` — workspace packages

## Deployment (Vercel)

Two projects from the same repository, both built with `bun run build`:

| Project | Root Directory | Domain               | Env                                                                                                                   |
| ------- | -------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| site    | `apps/site`    | `yuancong.space`     | `NEXT_PUBLIC_SUPABASE_*`, `SITE_URL`, `REVALIDATE_SECRET`                                                             |
| cms     | `apps/cms`     | `cms.yuancong.space` | `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_CMS_URL`, `CMS_ALLOWED_EMAILS`, `SITE_REVALIDATE_ORIGINS`, `REVALIDATE_SECRET` |

A second site project — a staging subdomain — is a matter of adding it with
`SITE_ENV=staging`, its own `SITE_URL`, and its origin appended to the CMS's
`SITE_REVALIDATE_ORIGINS`. Nothing in the code assumes there is only one.

The CMS is served from its own subdomain so the public site never ships auth code.

`apps/*/.env.example` is the list of record for each app; keep it in step with
the code that reads `process.env`.

### Site environments

`SITE_ENV` (`production` | `staging` | `development`) is the site's own idea of
which deployment it is. One Vercel project serves the site, so it can be left
unset: `VERCEL_ENV` says it correctly there, the production deployment is
indexed without anyone configuring it, and every branch preview is marked
without anyone remembering to.

Set it the day a second project serves the site. A staging project has its own
production branch, so `VERCEL_ENV` reads `production` there too, and inferring
would either de-index the real site or index the copy. `SITE_ENV` outranks
`VERCEL_ENV` for exactly that case. Anything else on Vercel falls back to
`staging`, which is the safe way to be wrong about a deployment nobody declared.

Only `production` is indexed. Everything else gets `Disallow: /` from
`robots.ts`, `noindex` from the root layout's metadata, and an `EnvBanner`
naming the environment. Staging serves the same content from the same Supabase
project, so without that marker the two are indistinguishable in a screenshot.

`SITE_URL` is the deployment's canonical origin — `metadataBase`,
the canonicals and the sitemap all resolve against it, so staging never claims
to be the production URL. It falls back to `https://$VERCEL_URL`, then
`http://localhost:3000`.

Both are server-only, hence no `NEXT_PUBLIC_` prefix: nothing in the browser
reads them and they stay out of the client bundle. They are read while pages
prerender, so changing one on Vercel still needs a redeploy.

### On-demand revalidation

Blog pages carry `revalidate = 300`; publishing does not wait it out.

- **The CMS pushes.** `apps/cms/src/lib/revalidate.ts` posts the changed slug to
  `<origin>/api/revalidate` for every origin in `SITE_REVALIDATE_ORIGINS`, with
  `REVALIDATE_SECRET` in the `x-revalidate-secret` header. It is a list because
  production and staging serve the same content from different origins.
- **It never throws.** A site that is down, slow or unconfigured must not turn a
  successful save into a failed one; the editor reports which origins did not
  refresh and those pages catch up on their own window. Unset origins or an
  unset secret mean nothing is sent, rather than sending unauthenticated.
- **Every write, not only a publish.** Unpublishing has to take a page down, and
  an edit has to reach a live post. A rename passes `previousSlug` as well —
  read off the row _before_ the update — because the old URL is cached under a
  path nothing else would invalidate.
- **The site decides which paths.** `apps/site/src/lib/revalidate-paths.ts` owns
  that mapping (`/blog`, `/blog/tags`, the `/blog/tags/[tag]` page type, and
  each affected post URL), so the CMS never has to know the site's routes.
- **The secret is per deployment.** `/api/revalidate` only ever speaks for the
  deployment it belongs to, compares hashes with `timingSafeEqual`, and answers
  503 when it holds no secret at all.

## Git Workflow

- Develop on `develop` branch
- Push directly to `develop` (no feature branches)
- Commit messages: conventional commits style (`feat:`, `fix:`, `chore:`, etc.)

## Roadmap

1. ~~Monorepo split + CMS authentication~~ (done)
2. ~~`packages/markdown` — shared renderer used by `/blog/[slug]` and the CMS preview~~ (done)
3. ~~Supabase `posts` schema + RLS, CMS post CRUD, draft/publish~~ (done)
4. ~~On-demand revalidation so publishing updates the site without waiting out
   the 5-minute ISR window~~ (done) — image uploads to Supabase Storage still
   to do
5. `::live-demo` — a self-hosted editable sandbox to replace the CodePen embeds

## Key Files

| File                                        | Purpose                                                 |
| ------------------------------------------- | ------------------------------------------------------- |
| `AGENTS.md` / `CLAUDE.md`                   | AI agent instructions (must stay in sync)               |
| `.cursor/rules/`                            | Cursor-scoped project rules                             |
| `turbo.json`                                | Turborepo task graph and env allowlists                 |
| `packages/eslint-config/index.mjs`          | Shared ESLint flat config factory                       |
| `packages/tsconfig/*.json`                  | Shared TypeScript bases                                 |
| `packages/ui/src/styles/theme.css`          | Theme variables, `color-scheme`, Tailwind tokens        |
| `packages/markdown/src/pipeline.ts`         | The unified processor both apps render with             |
| `packages/markdown/src/directives/index.ts` | Directive registry (`::frame`, …)                       |
| `packages/markdown/src/styles/markdown.css` | Post typography                                         |
| `apps/site/src/lib/posts.ts`                | Public post queries (anon key)                          |
| `apps/site/src/lib/env.ts`                  | Deployment identity: site env, canonical origin, secret |
| `apps/site/src/lib/revalidate-paths.ts`     | Which paths a post change invalidates                   |
| `apps/site/src/app/api/revalidate/route.ts` | Authenticated revalidation endpoint                     |
| `apps/cms/src/lib/posts.ts`                 | Author post queries (drafts included)                   |
| `apps/cms/src/lib/post-form.ts`             | Post form parsing and publish rules                     |
| `apps/cms/src/lib/revalidate.ts`            | Fan-out to every configured site origin                 |
| `supabase/migrations/`                      | Schema and row level security                           |
| `scripts/import-posts.ts`                   | MDX archive importer                                    |
| `packages/ui/src/lib/utils.ts`              | `cn()` class merging utility                            |
| `apps/*/src/styles/globals.css`             | Per-app Tailwind entry + chrome                         |
| `apps/site/.env.example`                    | Site environment variables                              |
| `apps/cms/.env.example`                     | CMS environment variables                               |
| `.github/workflows/test.yml`                | CI pipeline                                             |
