import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteHeader } from '.';

describe('SiteHeader', () => {
  it('renders the shared theme toggle inside a banner', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /theme: system/i })
    ).toBeInTheDocument();
  });

  it('links to every public section in the current site navigation order', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'href',
      '/blog'
    );
    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      '/portfolio'
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'About me' })).toHaveAttribute(
      'href',
      '/about-me'
    );
    expect(screen.getByRole('link', { name: '...And' })).toHaveAttribute(
      'href',
      '/and'
    );
  });

  it('moves the navigation magnet without adding a cursor glow', () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole('navigation', { name: 'Primary' });
    Object.defineProperty(navigation, 'getBoundingClientRect', {
      value: () => new DOMRect(100, 40, 700, 56),
    });

    fireEvent.pointerMove(navigation, {
      clientX: 450,
      clientY: 68,
      pointerType: 'mouse',
    });

    expect(navigation).toHaveStyle('--nav-magnet-x: 0px');
    expect(navigation).toHaveStyle('--nav-magnet-y: 0px');
    expect(navigation.style.getPropertyValue('--nav-cursor-opacity')).toBe('');

    fireEvent.pointerLeave(navigation);
    expect(navigation).toHaveStyle('--nav-magnet-x: 0px');
  });

  it('uses one navigation-level hover background for every link', () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole('navigation', { name: 'Primary' });
    const blog = screen.getByRole('link', { name: 'Blog' });
    const portfolio = screen.getByRole('link', { name: 'Portfolio' });
    Object.defineProperty(navigation, 'getBoundingClientRect', {
      value: () => new DOMRect(100, 40, 700, 56),
    });
    Object.defineProperty(blog, 'getBoundingClientRect', {
      value: () => new DOMRect(110, 49, 130, 38),
    });
    Object.defineProperty(portfolio, 'getBoundingClientRect', {
      value: () => new DOMRect(250, 49, 130, 38),
    });

    fireEvent.mouseEnter(blog);
    expect(
      navigation.querySelectorAll('.site-primary-hover-background')
    ).toHaveLength(1);
    expect(
      navigation.querySelector('.site-primary-hover-background')?.parentElement
    ).toBe(navigation);

    fireEvent.mouseEnter(portfolio);
    expect(
      navigation.querySelectorAll('.site-primary-hover-background')
    ).toHaveLength(1);
  });
});
