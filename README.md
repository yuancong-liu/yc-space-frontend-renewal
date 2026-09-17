# YC Space Frontend Renewal

Personal portfolio and blog site renewal. Migrating from [portfolio-site](https://github.com/yuancong-liu/portfolio-site) (Next.js 14 + SCSS) to Next.js 16, Tailwind CSS v4, and shadcn/ui.

A bun workspaces + Turborepo monorepo: the public site and the authenticated CMS are separate Next.js apps sharing UI and tooling.

```
apps/site   Public site (no auth)        → :3000
apps/cms    Content management (Supabase Auth) → :3001
packages/ui             cn(), theme tokens, shadcn components, ThemeRadio
packages/markdown       Post renderer shared by the site and the CMS preview
packages/eslint-config  Shared ESLint flat config
packages/tsconfig       Shared TypeScript bases
```

## Prerequisites

- Node.js 24.15.0 ([asdf](https://asdf-vm.com/) — see `.tool-versions`)
- [Bun](https://bun.sh/) package manager

## Getting Started

```bash
bun install
bun run dev        # site on :3000, cms on :3001
bun run dev:site   # site only
bun run dev:cms    # cms only
```

The CMS needs Supabase credentials before it can sign anyone in:

```bash
cp apps/cms/.env.example apps/cms/.env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, CMS_ALLOWED_EMAILS
```

Without them `/login` renders a setup notice instead of the form, and every other CMS route redirects there.

### Supabase setup

1. **Authentication → URL Configuration:** Site URL = the CMS origin (`http://localhost:3001` locally); add `<origin>/auth/confirm` to Redirect URLs.
2. **Authentication → Email Templates → Magic Link:** point the link at
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
3. **Authentication → Providers:** enable Email, disable the rest.

`CMS_ALLOWED_EMAILS` is a comma-separated allowlist and is the actual access gate — an unset value locks everyone out on purpose.

## Scripts

Every root script fans out through Turborepo; add `--filter=@yc/site` or `--filter=@yc/cms` to narrow.

| Command | Description |
|---|---|
| `bun run dev` | Dev servers for both apps |
| `bun run build` | Production builds |
| `bun run lint` | ESLint in every workspace |
| `bun run typecheck` | `tsc --noEmit` in the shared packages |
| `bun run test` | Vitest unit tests |
| `bun run e2e` | Playwright E2E (`apps/site`) |
| `bun run storybook` | Storybook dev server (:6006) |
| `bun run format` | Prettier write |

See [AGENTS.md](./AGENTS.md) for full conventions.

## Writing posts

Post bodies are plain Markdown (CommonMark + GFM). Anything richer comes from a
directive that maps to a React component:

```
::frame{src="https://codepen.io/…/embed/abc" height=500 title="Subgrid"}
```

`/preview` in the CMS renders exactly what the site will. Raw HTML is dropped,
and a single colon in prose (`16:10`, `12:30`) stays literal — only a colon at
the start of a line opens a block.

## AI Development

This repo supports both **Cursor** and **Claude Code**:

| Tool | Reads |
|---|---|
| Cursor | `AGENTS.md`, `.cursor/rules/` |
| Claude Code | `CLAUDE.md`, `.claude/commands/` |

`AGENTS.md` and `CLAUDE.md` must stay in sync — update both in the same change.

## Git Workflow

- Primary branch: `develop`
- Conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- CI runs lint, test, build, and e2e on push/PR to `develop`

## Deploy

Two [Vercel](https://vercel.com) projects from this repository:

| Project | Root Directory | Env |
|---|---|---|
| site | `apps/site` | — |
| cms | `apps/cms` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CMS_URL`, `CMS_ALLOWED_EMAILS` |

The CMS lives on its own subdomain so the public site never ships auth code.
