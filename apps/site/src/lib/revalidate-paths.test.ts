import { describe, expect, it } from 'vitest';

import { revalidateTargets } from './revalidate-paths';

const paths = (request: Parameters<typeof revalidateTargets>[0]) =>
  revalidateTargets(request).map(target => target.path);

describe('revalidateTargets()', () => {
  it('always refreshes the index and every tag page', () => {
    expect(paths({})).toEqual(['/blog', '/blog/tags', '/blog/tags/[tag]']);
  });

  it('marks the tag route as a pattern so all of its pages rebuild', () => {
    const tagRoute = revalidateTargets({}).find(
      target => target.path === '/blog/tags/[tag]'
    );

    expect(tagRoute?.type).toBe('page');
  });

  it('adds the post itself', () => {
    expect(paths({ slug: 'hello' })).toContain('/blog/hello');
  });

  it('refreshes the old URL too when a post was renamed', () => {
    const result = paths({ slug: 'new-name', previousSlug: 'old-name' });

    expect(result).toContain('/blog/new-name');
    expect(result).toContain('/blog/old-name');
  });

  it('does not list the same page twice when the slug is unchanged', () => {
    const result = paths({ slug: 'same', previousSlug: 'same' });

    expect(result.filter(path => path === '/blog/same')).toHaveLength(1);
  });
});
