import type { ReactNode } from 'react';

import { CmsHeader } from '@/components/cms-header';
import { createClient } from '@/lib/supabase/server';

type AppLayoutProps = {
  children: ReactNode;
};

/**
 * Chrome for the signed-in area. Every route under this group is already gated
 * by the proxy, so the user is guaranteed to exist by the time this renders.
 */
const AppLayout = async ({ children }: AppLayoutProps) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <CmsHeader email={user?.email ?? ''} />
      {children}
    </>
  );
};

export default AppLayout;
