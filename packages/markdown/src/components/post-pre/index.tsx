'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

type PostPreProps = {
  children?: ReactNode;
  'data-language'?: string;
};

/** The copy glyph carried over from the previous site (Font Awesome 6 Free). */
const COPY_PATH =
  'M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z';

/** Matches the toast animation in markdown.css. */
const TOAST_DURATION_MS = 1500;

export const PostPre = ({
  children,
  'data-language': language,
}: PostPreProps) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const code = preRef.current?.textContent;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), TOAST_DURATION_MS);
    } catch {
      // Clipboard is unavailable (insecure origin, denied permission). The code
      // is still selectable, so there is nothing useful to tell the reader.
    }
  };

  return (
    <div className='yc-code-block'>
      <div className='yc-code-block-bar'>
        <span className='yc-code-block-language'>{language ?? 'text'}</span>
        <span
          aria-live='polite'
          className='yc-code-block-toast'
          data-visible={copied || undefined}
        >
          {copied ? 'Copied!' : ''}
        </span>
        <button
          aria-label='Copy code'
          className='yc-code-block-copy'
          type='button'
          onClick={copy}
        >
          <svg aria-hidden viewBox='0 0 448 512'>
            <path d={COPY_PATH} />
          </svg>
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
};
