import Link from 'next/link';

const DashboardPage = () => (
  <main className="cms-main flex flex-col gap-6">
    <h1 className="text-2xl font-semibold text-text">Dashboard</h1>

    <section className="cms-card flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-text">Markdown preview</h2>
      <p className="text-sm text-text/70">
        Write markdown and see it rendered by the same package the public site
        uses. Directives like <code>::frame</code> work here exactly as they
        will in a published post.
      </p>
      <Link className="text-sm text-accent-2 underline" href="/preview">
        Open the preview workbench →
      </Link>
    </section>

    <section className="cms-card flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-text">Posts</h2>
      <p className="text-sm text-text/70">
        Post management is not built yet. The next step adds the Supabase{' '}
        <code>posts</code> table and turns the workbench into a real editor with
        drafts and publishing.
      </p>
    </section>
  </main>
);

export default DashboardPage;
