import { cn } from '@yc/ui';

import { renderMarkdown } from './pipeline';

export type MarkdownProps = {
  className?: string;
  source: string;
};

/**
 * Renders a post body. Deliberately hook-free so the same component works in a
 * Server Component and in the CMS preview; callers that re-render on every
 * keystroke memoise on their side.
 */
export const Markdown = ({ className, source }: MarkdownProps) => (
  <div className={cn('yc-markdown', className)}>{renderMarkdown(source)}</div>
);
