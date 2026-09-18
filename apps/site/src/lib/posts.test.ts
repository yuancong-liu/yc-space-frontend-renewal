import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPostBySlug, getPosts, getTags } from './posts';

const { getSupabase } = vi.hoisted(() => ({ getSupabase: vi.fn() }));

vi.mock('@/lib/supabase', () => ({ getSupabase }));

type Result = { data: unknown; error: { message: string } | null };

/** Just enough of the query builder for the two shapes posts.ts uses. */
const client = (result: Result) => ({
  from: () => ({
    select: () => ({
      order: () => Promise.resolve(result),
      eq: () => ({ maybeSingle: () => Promise.resolve(result) }),
    }),
  }),
});

const answers = (result: Result) => getSupabase.mockReturnValue(client(result));

const row = {
  id: '1',
  slug: 'hello',
  title: 'Hello',
  language: 'English',
  tags: ['CSS', 'Frontend'],
  published_at: '2026-01-01T00:00:00Z',
};

afterEach(() => {
  vi.restoreAllMocks();
  getSupabase.mockReset();
});

describe('when Supabase is not configured', () => {
  it('is an empty archive, quietly', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    getSupabase.mockReturnValue(null);

    expect(await getPosts()).toEqual([]);
    expect(await getPostBySlug('hello')).toBeNull();
    // Unconfigured is the documented state for CI and a secretless build, not
    // a failure to report.
    expect(logged).not.toHaveBeenCalled();
  });
});

describe('when the query fails', () => {
  const error = {
    message: "Could not find the table 'public.posts' in the schema cache",
  };

  it('degrades to an empty archive rather than throwing', async () => {
    // A throw here would fail `next build`, not just one page — every blog
    // page is prerendered.
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    answers({ data: null, error });

    await expect(getPosts()).resolves.toEqual([]);
    await expect(getTags()).resolves.toEqual([]);
    await expect(getPostBySlug('hello')).resolves.toBeNull();
    expect(logged).toHaveBeenCalledTimes(3);
  });

  it('says what failed, so a build log shows it', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    answers({ data: null, error });

    await getPosts();

    expect(logged.mock.calls[0][0]).toContain('failed to load posts');
    expect(logged.mock.calls[0][0]).toContain(error.message);
  });
});

describe('when the query succeeds', () => {
  it('maps rows to posts', async () => {
    answers({ data: [row], error: null });

    expect(await getPosts()).toMatchObject([
      { slug: 'hello', title: 'Hello', tags: ['CSS', 'Frontend'] },
    ]);
  });

  it('counts tags across the archive', async () => {
    answers({ data: [row, { ...row, id: '2', tags: ['CSS'] }], error: null });

    expect(await getTags()).toEqual([
      { name: 'CSS', slug: 'css', count: 2 },
      { name: 'Frontend', slug: 'frontend', count: 1 },
    ]);
  });
});
