/**
 * A post body exercising every construct the renderer supports. Used by the
 * Storybook story, the CMS preview's starting content, and the site's
 * placeholder post — one copy so a rendering regression shows up everywhere.
 */
export const SAMPLE_POST = `Markdown here is plain text, all the way down. Raw HTML is dropped on purpose, and anything richer than CommonMark + GFM comes from a [directive](https://github.com/remarkjs/remark-directive).

## Prose

Body copy sets at a comfortable measure with **weighted emphasis**, *italics*, \`inline code\`, and links that are [internal](/blog) or [external](https://example.com) — the external ones pick up a marker and open in a new tab.

> A blockquote for the aside that does not deserve its own paragraph.
>
> It can run to several of them.

### Lists

- Unordered items take an accent dash
- Nesting works too
  - like this
- [x] task lists come from GFM
- [ ] and stay interactive-looking

1. Ordered lists keep their numbers
2. In the accent colour

## Code

Fenced blocks are highlighted, labelled with their language, and copyable:

\`\`\`ts
type Post = {
  slug: string;
  title: string;
  publishedAt: Date | null;
};

export const isPublished = (post: Post) =>
  post.publishedAt !== null && post.publishedAt <= new Date();
\`\`\`

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: subgrid;
  gap: 1rem;
}
\`\`\`

A fence with no language is left alone:

\`\`\`
$ bun run dev
\`\`\`

## Tables

| Directive | Renders | Status |
| --- | --- | --- |
| \`::frame\` | An embedded demo | Shipped |
| \`::live-demo\` | An editable sandbox | Planned |

## Embedded demos

日本語の本文も同じスタックで組まれます — IBM Plex Sans JP が後ろで支えています。

Ratios like 16:10 and times like 12:30 stay literal — only a colon at the start of a line opens a block.

::frame{src="https://codepen.io/yuancong-liu/embed/oNOyNRd?default-tab=result" title="Subgrid alignment" height=420}

---

That divider is an \`---\`, and this is the last paragraph.
`;
