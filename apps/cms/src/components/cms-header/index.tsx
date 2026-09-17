import { Button, ThemeRadio } from '@yc/ui';

import { signOut } from '@/app/actions';

type CmsHeaderProps = {
  email: string;
};

export const CmsHeader = ({ email }: CmsHeaderProps) => (
  <header className="cms-header">
    <span className="font-mono text-sm text-text">YC Space CMS</span>

    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-text/70 sm:inline">{email}</span>
      <ThemeRadio />
      <form action={signOut}>
        <Button size="sm" type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  </header>
);
