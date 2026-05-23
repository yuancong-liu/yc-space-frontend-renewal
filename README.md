# YC Space Frontend Renewal

Personal portfolio and blog site renewal. Migrating from [portfolio-site](https://github.com/yuancong-liu/portfolio-site) (Next.js 14 + SCSS) to Next.js 16, Tailwind CSS v4, and shadcn/ui.

## Prerequisites

- Node.js 24.15.0 ([asdf](https://asdf-vm.com/) — see `.tool-versions`)
- [Bun](https://bun.sh/) package manager

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Dev server (Turbopack) |
| `bun run build` | Production build |
| `bun start` | Production server |
| `bun run lint` | ESLint |
| `bun run test` | Vitest unit tests |
| `bun run e2e` | Playwright E2E tests |
| `bun run storybook` | Storybook dev server |

See [AGENTS.md](./AGENTS.md) for full command list and project conventions.

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

Deployed on [Vercel](https://vercel.com).
