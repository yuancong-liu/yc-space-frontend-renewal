import { CmsHeader } from '@/components/cms-header';
import { createClient } from '@/lib/supabase/server';

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <CmsHeader email={user?.email ?? ''} />

      <main className="cms-main flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
          <p className="text-sm text-text/70">
            Signed in as {user?.email ?? 'unknown'}.
          </p>
        </div>

        <section className="cms-card flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-text">Posts</h2>
          <p className="text-sm text-text/70">
            Post management is not built yet. The next step wires this app to
            the Supabase <code>posts</code> table and adds the editor with a
            live preview backed by the shared markdown renderer.
          </p>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
