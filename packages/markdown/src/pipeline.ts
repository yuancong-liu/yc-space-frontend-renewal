import type { ReactElement } from 'react';

import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeHighlight from 'rehype-highlight';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { MARKDOWN_COMPONENTS } from './components';
import { rehypeCodeLanguage } from './plugins/rehype-code-language';
import { remarkStandaloneImages } from './plugins/remark-standalone-images';
import { remarkYcDirectives } from './plugins/remark-yc-directives';

/**
 * One processor, shared by the site and the CMS preview — that shared instance
 * is the whole point of this package. Every plugin in the chain is synchronous,
 * so `processSync` works, which keeps the renderer usable from a Server
 * Component and from a keystroke-by-keystroke preview alike.
 *
 * Raw HTML in the source is dropped: `remark-rehype` leaves it out unless
 * `allowDangerousHtml` is set, and post bodies come from the database. Authors
 * reach for directives instead — see `./directives`.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkYcDirectives)
  .use(remarkStandaloneImages)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight, { detect: false, ignoreMissing: true })
  .use(rehypeCodeLanguage)
  .use(rehypeReact, {
    Fragment,
    jsx,
    jsxs,
    components: MARKDOWN_COMPONENTS,
  })
  .freeze();

export const renderMarkdown = (source: string): ReactElement =>
  processor.processSync(source).result as ReactElement;
