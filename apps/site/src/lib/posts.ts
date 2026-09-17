import { SAMPLE_POST } from '@yc/markdown/sample';

export type Post = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  body: string;
};

/**
 * Placeholder content until the Supabase `posts` table lands.
 *
 * The accessors below are async on purpose: swapping this array for a query is
 * then a change to this file alone, and every page that renders a post already
 * awaits its data.
 */
const POSTS: Post[] = [
  {
    slug: 'hello-markdown',
    title: 'Hello, markdown',
    summary:
      'Every construct the shared renderer supports, rendered by the same package the CMS previews with.',
    publishedAt: '2026-09-17',
    tags: ['Meta', 'Frontend'],
    body: SAMPLE_POST,
  },
];

export const getPosts = async (): Promise<Post[]> =>
  [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const getPostBySlug = async (slug: string): Promise<Post | null> =>
  POSTS.find(post => post.slug === slug) ?? null;
