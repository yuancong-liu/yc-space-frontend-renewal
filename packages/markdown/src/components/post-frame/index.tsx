import type { CSSProperties } from 'react';

/**
 * `::frame{src=… }` — an embedded demo (CodePen, a self-hosted playground, …).
 *
 * Only https URLs are rendered. Post bodies are stored as plain text, but they
 * still arrive from the database, so a `javascript:` or `data:` src must never
 * reach the DOM.
 */
type PostFrameProps = {
  src?: string;
  title?: string;
  height?: string;
  allowfullscreen?: string;
};

const isEmbeddableUrl = (src: string | undefined): src is string => {
  if (!src) return false;

  try {
    return new URL(src).protocol === 'https:';
  } catch {
    return false;
  }
};

export const PostFrame = ({
  allowfullscreen,
  height,
  src,
  title,
}: PostFrameProps) => {
  if (!isEmbeddableUrl(src)) {
    return (
      <p className="yc-markdown-error">
        Embed skipped: <code>src</code> must be an https URL.
      </p>
    );
  }

  return (
    <div
      className="yc-frame"
      style={
        height
          ? ({ '--frame-height': `${height}px` } as CSSProperties)
          : undefined
      }
    >
      <iframe
        allowFullScreen={allowfullscreen !== 'false'}
        loading="lazy"
        src={src}
        title={title ?? 'Embedded demo'}
      />
    </div>
  );
};
