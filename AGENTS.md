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
├── apps/
│   ├── site/               # @yc/site — public site, no auth, port 3000
│   │   ├── e2e/            # Playwright specs
│   │   ├── .storybook/     # Storybook (scans apps/site AND packages/ui)
│   │   └── src/
│   │       ├── app/        # / , /blog , /blog/[slug] , /blog/tags , /portfolio , /about-me , /and
│   │       ├── assets/
│   │       ├── components/ # Site-only components (site-header, pages/home)
│   │       └── styles/globals.css
│   └── cms/                # @yc/cms — authenticated back office, port 3001
│       └── src/
│           ├── app/
│           │   ├── page.tsx            # Dashboard (protected)
│           │   ├── actions.ts          # signOut server action
│           │   ├── login/              # Sign-in page, form, server action
│           │   └── auth/confirm/       # Magic-link landing (token_hash or PKCE code)
│           ├── components/
│           ├── lib/
│           │   ├── auth/allowlist.ts   # CMS_ALLOWED_EMAILS gate
│           │   ├── env.ts              # Lazy Supabase env access
│           │   └── supabase/           # client / server / proxy factories
│           ├── proxy.ts                # Next proxy (ex-middleware) — session + route gate
│           └── styles/globals.css
└── packages/
    ├── ui/                 # @yc/ui — cn(), theme.css, shadcn components, ThemeRadio
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
| Variable | Light | Dark | Description |
|---|---|---|---|
| `--color-text` | #150640 | #fdfbf8 | Primary text |
| `--color-bg-1` | #fdfbf8 | #150640 | Page background |
| `--color-bg-2` | #f1e6e0 | #2e2364 | Secondary background |
| `--color-accent-1` | #ff8f97 | #e44458 | Primary accent |
| `--color-accent-2` | #e44458 | #ff8f97 | Secondary accent |
| `--color-surface-1` | #2e2364 | #f1e6e0 | Surface color |
| `--color-surface-2` | #150640 | #fdfbf8 | Surface secondary |

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

### Supabase dashboard setup

1. **Authentication → URL Configuration:** Site URL = the CMS origin; add `<origin>/auth/confirm` to Redirect URLs.
2. **Authentication → Email Templates → Magic Link:** point the link at
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
3. **Authentication → Providers → Email:** enable; disable other providers.

## shadcn/ui

Shared components live in `packages/ui/src/components/ui/` (`components.json` is configured there). Add with `npx shadcn@latest add <name>` from `packages/ui`, then **rewrite the generated `@/lib/utils` import to a relative path** and re-export the component from `packages/ui/src/index.ts`.

## Testing

- **Unit tests:** Vitest + Testing Library — `src/**/*.{test,spec}.{ts,tsx}` in each workspace
- **E2E:** Playwright — `apps/site/e2e/`
- **Stories:** Storybook — `packages/ui/src/**/*.stories.tsx` and `apps/site/src/**/*.stories.tsx`, config in `apps/site/.storybook/`
- **CI:** lint → test → build → e2e on push/PR to `develop` (`.github/workflows/test.yml`)

## Path Aliases

- `@/*` → `<app>/src/*` — inside `apps/site` and `apps/cms` only
- `@yc/ui`, `@yc/eslint-config`, `@yc/tsconfig` — workspace packages

## Deployment (Vercel)

Two projects from the same repository:

| Project | Root Directory | Build | Env |
|---|---|---|---|
| site | `apps/site` | `bun run build` | — |
| cms | `apps/cms` | `bun run build` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CMS_URL`, `CMS_ALLOWED_EMAILS` |

The CMS is served from its own subdomain so the public site never ships auth code.

## Git Workflow

- Develop on `develop` branch
- Push directly to `develop` (no feature branches)
- Commit messages: conventional commits style (`feat:`, `fix:`, `chore:`, etc.)

## Roadmap

1. ~~Monorepo split + CMS authentication~~ (done)
2. `packages/markdown` — shared renderer used by `/blog/[slug]` and the CMS preview pane
3. Supabase `posts` schema + RLS, CMS post CRUD, draft/publish, image uploads to Supabase Storage

## Key Files

| File | Purpose |
|---|---|
| `AGENTS.md` / `CLAUDE.md` | AI agent instructions (must stay in sync) |
| `.cursor/rules/` | Cursor-scoped project rules |
| `turbo.json` | Turborepo task graph and env allowlists |
| `packages/eslint-config/index.mjs` | Shared ESLint flat config factory |
| `packages/tsconfig/*.json` | Shared TypeScript bases |
| `packages/ui/src/styles/theme.css` | Theme variables and Tailwind tokens |
| `packages/ui/src/lib/utils.ts` | `cn()` class merging utility |
| `apps/*/src/styles/globals.css` | Per-app Tailwind entry + chrome |
| `apps/cms/.env.example` | CMS environment variables |
| `.github/workflows/test.yml` | CI pipeline |
