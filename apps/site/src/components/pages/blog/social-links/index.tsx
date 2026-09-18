import Link from 'next/link';

import { GithubIcon, LinkedinIcon, MailIcon, TwitterIcon } from './icons';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/yuancong-liu',
    Icon: GithubIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yuancong-liu/',
    Icon: LinkedinIcon,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/YUANTSUNG129',
    Icon: TwitterIcon,
  },
  {
    label: 'Mail',
    href: 'mailto:yuanc129.liu@yahoo.com',
    Icon: MailIcon,
  },
];

/**
 * The previous site paired these with an embedded Twitter timeline. The widget
 * is not worth reviving — a third-party script for a feed that mostly no longer
 * loads — so the links stand on their own.
 */
export const SocialLinks = () => (
  <ul className='social-links'>
    {LINKS.map(({ Icon, href, label }) => (
      <li key={label}>
        <Link
          aria-label={label}
          className='social-link'
          href={href}
          rel='noopener noreferrer'
          target='_blank'
        >
          <Icon aria-hidden />
          <span>{label}</span>
        </Link>
      </li>
    ))}
  </ul>
);
