'use client';

import { useDeferredValue, useState } from 'react';

import { Markdown } from '@yc/markdown';

type PreviewWorkbenchProps = {
  initialSource: string;
};

export const PreviewWorkbench = ({ initialSource }: PreviewWorkbenchProps) => {
  const [source, setSource] = useState(initialSource);

  // Rendering is synchronous; deferring it keeps typing smooth on long posts
  // while the preview catches up a frame later.
  const deferredSource = useDeferredValue(source);
  const isStale = source !== deferredSource;

  return (
    <div className="cms-workbench-grid">
      <section className="cms-workbench-pane">
        <header className="cms-workbench-bar">
          <span>Source</span>
          <span className="text-text/50">{source.length} chars</span>
        </header>
        <textarea
          aria-label="Post markdown"
          className="cms-workbench-editor"
          spellCheck={false}
          value={source}
          onChange={event => setSource(event.target.value)}
        />
      </section>

      <section className="cms-workbench-pane">
        <header className="cms-workbench-bar">
          <span>Preview</span>
          {isStale && <span className="text-text/50">rendering…</span>}
        </header>
        <div className="cms-workbench-preview">
          <Markdown source={deferredSource} />
        </div>
      </section>
    </div>
  );
};
