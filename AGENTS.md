# AGENTS.md - YC Space Frontend Renewal

## Project Overview

Personal portfolio/blog site renewal. Migrating from [portfolio-site](https://github.com/yuancong-liu/portfolio-site) (Next.js 14 + SCSS) to a modern stack.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack default)
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **UI Components:** shadcn/ui (Radix primitives, New York style)
- **Icons:** Lucide React
- **Analytics:** @vercel/analytics
- **Package Manager:** npm (bun.lock exists but npm is primary)
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── layout.tsx          # Root layout (fonts, theme, analytics)
│   ├── page.tsx            # / (home)
│   ├── not-found.tsx       # 404
│   ├── globals.css         # Global styles, CSS variables, Tailwind config
│   ├── blog/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # /blog (listing)
│   │   ├── [slug]/
│   │   │   └── page.tsx    # /blog/:slug (post detail)
│   │   └── tags/
│   │       ├── page.tsx    # /blog/tags (all tags)
│   │       └── [tag]/
│   │           └── page.tsx # /blog/tags/:tag (filtered by tag)
│   ├── portfolio/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # /portfolio
│   │   └── nian-nian/
│   │       └── page.tsx    # /portfolio/nian-nian
│   ├── about-me/
│   │   ├── layout.tsx
│   │   └── page.tsx        # /about-me
│   └── and/
│       ├── layout.tsx
│       └── page.tsx        # /and
├── components/
│   ├── common/             # Shared components (theme-radio, nav, footer)
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
└── hooks/                  # Custom React hooks
```

## Code Conventions

### TypeScript
- Use `type` keyword (not `interface`) for type definitions (`@typescript-eslint/consistent-type-definitions`)
- Use `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`)
- PascalCase for type names
- Unused vars prefixed with `_`

### React / JSX
- **Arrow functions only** for components (`react/function-component-definition`)
- Export components as default export at the bottom of the file
- JSX props sorted alphabetically, callbacks last, shorthand first, reserved first
- Self-closing tags for empty elements
- No `React.` namespace access — use named imports

### Imports
- Ordered by: builtin > external > internal > parent > sibling > index
- Alphabetized within groups (case-insensitive)
- Newline between groups
- `react` imports come first among externals
- No unused imports (`unused-imports/no-unused-imports`)

### Styling
- Use Tailwind CSS utility classes
- Use `cn()` from `@/lib/utils` to merge conditional classes
- Custom colors via CSS variables (not hardcoded hex values)

## Theme System

CSS-driven dark/light/system theme switching using `:has()` selector with radio inputs.

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

## shadcn/ui

Configured via `components.json`. UI components go in `src/components/ui/`.

To add components (when network available):
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check (eslint .)
```

## Path Aliases

- `@/*` → `./src/*` (configured in tsconfig.json)

## Git Workflow

- Develop on `develop` branch
- Push directly to `develop` (no feature branches)
- Commit messages: conventional commits style (`feat:`, `fix:`, `chore:`, etc.)

## Key Files

| File | Purpose |
|---|---|
| `eslint.config.mjs` | ESLint flat config (Airbnb-style + custom rules) |
| `components.json` | shadcn/ui configuration |
| `postcss.config.mjs` | PostCSS with @tailwindcss/postcss |
| `next.config.ts` | Next.js configuration |
| `src/app/globals.css` | Theme variables, Tailwind imports, global styles |
| `src/lib/utils.ts` | `cn()` class merging utility |
