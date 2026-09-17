import type { ComponentType } from 'react';

import { PostFrame } from '../components/post-frame';

/**
 * Custom blocks authors can use in a post body, via remark-directive syntax:
 *
 * ```
 * ::frame{src="https://codepen.io/…/embed/abc" height=500 title="Subgrid"}
 * ```
 *
 * Each entry becomes a `yc-<name>` element in the hast tree and is rendered by
 * the component registered here. Directive attributes arrive as string props —
 * the component is responsible for parsing and validating them.
 *
 * To add a block: write the component, register it here, done. Both the site
 * and the CMS preview pick it up, because both render through this package.
 */
export const DIRECTIVE_COMPONENTS: Record<string, ComponentType<any>> = {
  frame: PostFrame,
};

export const DIRECTIVE_NAMES = Object.keys(DIRECTIVE_COMPONENTS);

export const directiveTagName = (name: string) => `yc-${name}`;

export const UNKNOWN_DIRECTIVE_TAG = 'yc-unknown-directive';
