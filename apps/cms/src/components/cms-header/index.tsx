import Link from 'next/link';

import { Button, ThemeRadio } from '@yc/ui';

import { signOut } from '@/app/actions';

type CmsHeaderProps = {
  email: string;
};

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/preview', label: 'Preview' },
];

export const CmsHeader = ({ email }: CmsHeaderProps) => (
  <header className="cms-header">
    <div className="flex items-center gap-6">
      <span className="font-mono text-sm text-text">YC Space CMS</span>
      <nav className="flex items-center gap-4">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            className="text-sm text-text/70 transition-colors hover:text-accent-2"
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>

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
