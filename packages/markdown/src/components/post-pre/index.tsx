'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

type PostPreProps = {
  children?: ReactNode;
  'data-language'?: string;
};

const RESET_DELAY_MS = 1600;

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
      setTimeout(() => setCopied(false), RESET_DELAY_MS);
    } catch {
      // Clipboard is unavailable (insecure origin, denied permission). The code
      // is still selectable, so there is nothing useful to tell the reader.
    }
  };

  return (
    <div className="yc-code-block">
      <div className="yc-code-block-bar">
        <span className="yc-code-block-language">{language ?? 'text'}</span>
        <button
          className="yc-code-block-copy"
          type="button"
          onClick={copy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
};
