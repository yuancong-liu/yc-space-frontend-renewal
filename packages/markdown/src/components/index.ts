import type { ComponentType } from 'react';

import {
  DIRECTIVE_COMPONENTS,
  UNKNOWN_DIRECTIVE_TAG,
  directiveTagName,
} from '../directives';

import { PostImage } from './post-image';
import { PostLink } from './post-link';
import { PostPre } from './post-pre';
import { UnknownDirective } from './unknown-directive';

/**
 * Only elements that need structure or behaviour get a component. Everything
 * else (headings, paragraphs, lists, tables, blockquotes, inline code) is
 * styled from `../styles/markdown.css` — there is no way to put utility classes
 * on nodes the pipeline generates without a component per element, and the
 * stylesheet keeps the site and the CMS preview identical by construction.
 */
export const MARKDOWN_COMPONENTS: Record<string, ComponentType<any>> = {
  a: PostLink,
  img: PostImage,
  pre: PostPre,
  [UNKNOWN_DIRECTIVE_TAG]: UnknownDirective,
  ...Object.fromEntries(
    Object.entries(DIRECTIVE_COMPONENTS).map(([name, component]) => [
      directiveTagName(name),
      component,
    ])
  ),
};
