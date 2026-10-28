'use client';

import { useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Link from 'next/link';

import { ThemeRadio } from '@yc/ui';

const magneticOffset = (distance: number) =>
  (Math.sign(distance) * Math.sqrt(Math.abs(distance))) / 2;

type NavHoverPosition = {
  height: number;
  opacity: number;
  width: number;
  x: number;
  y: number;
};

const hiddenHoverPosition: NavHoverPosition = {
  height: 0,
  opacity: 0,
  width: 0,
  x: 0,
  y: 0,
};

export const SiteHeader = () => {
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const [hoverPosition, setHoverPosition] =
    useState<NavHoverPosition>(hiddenHoverPosition);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollPathLength = useSpring(
    useTransform(scrollYProgress, [0, 0.95, 1], [1, 0, 1]),
    { damping: 22, mass: 0.35, stiffness: 180 }
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !navigationRef.current) return;

    const navigation = navigationRef.current;
    const rect = navigation.getBoundingClientRect();
    const distanceX = event.clientX - (rect.left + rect.width / 2);
    const distanceY = event.clientY - (rect.top + rect.height / 2);

    headerRef.current?.style.setProperty(
      '--nav-magnet-x',
      `${magneticOffset(distanceX)}px`
    );
    headerRef.current?.style.setProperty(
      '--nav-magnet-y',
      `${magneticOffset(distanceY)}px`
    );
  };

  const handlePointerLeave = () => {
    if (!navigationRef.current) return;

    headerRef.current?.style.setProperty('--nav-magnet-x', '0px');
    headerRef.current?.style.setProperty('--nav-magnet-y', '0px');
    setHoverPosition(position => ({ ...position, opacity: 0 }));
  };

  const handleLinkMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!navigationRef.current) return;

    const navigationBounds = navigationRef.current.getBoundingClientRect();
    const linkBounds = event.currentTarget.getBoundingClientRect();

    setHoverPosition({
      height: linkBounds.height,
      opacity: 1,
      width: linkBounds.width,
      x:
        linkBounds.left -
        navigationBounds.left -
        navigationRef.current.clientLeft,
      y:
        linkBounds.top - navigationBounds.top - navigationRef.current.clientTop,
    });
  };

  return (
    <header ref={headerRef} className='site-header'>
      <svg aria-hidden className='site-liquid-glass-filter'>
        <filter
          colorInterpolationFilters='sRGB'
          height='140%'
          id='site-primary-liquid-glass'
          width='124%'
          x='-12%'
          y='-20%'
        >
          <feImage
            href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='bulge' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='rgb(128,128,128)'/%3E%3Cstop offset='0.25' stop-color='rgb(128,224,128)'/%3E%3Cstop offset='0.5' stop-color='rgb(128,128,128)'/%3E%3Cstop offset='0.75' stop-color='rgb(128,32,128)'/%3E%3Cstop offset='1' stop-color='rgb(128,128,128)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23bulge)'/%3E%3C/svg%3E"
            preserveAspectRatio='none'
            result='bulge-map'
          />
          <feGaussianBlur
            in='bulge-map'
            result='softened-bulge-map'
            stdDeviation='4'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='softened-bulge-map'
            result='bulged-backdrop'
            scale='18'
            xChannelSelector='R'
            yChannelSelector='G'
          />
          <feTurbulence
            baseFrequency='0.012 0.18'
            numOctaves='1'
            result='surface-ripples'
            seed='8'
            type='fractalNoise'
          />
          <feDisplacementMap
            in='bulged-backdrop'
            in2='surface-ripples'
            scale='2'
            xChannelSelector='R'
            yChannelSelector='G'
          />
        </filter>
      </svg>
      <nav
        ref={navigationRef}
        aria-label='Primary'
        className='site-primary-nav'
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <ul className='site-primary-links'>
          <li>
            <Link
              className='site-primary-link'
              href='/blog'
              onMouseEnter={handleLinkMouseEnter}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              className='site-primary-link'
              href='/portfolio'
              onMouseEnter={handleLinkMouseEnter}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              aria-label='Home'
              className='site-primary-home'
              href='/'
              onMouseEnter={handleLinkMouseEnter}
            >
              <motion.svg
                aria-hidden
                className='site-primary-home-mark'
                fill='none'
                initial={false}
                viewBox='0 0 32 30'
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: 360,
                        scale: 0.84,
                        transition: { duration: 0.6 },
                      }
                }
                xmlns='http://www.w3.org/2000/svg'
              >
                <motion.path
                  d='M9.58568 17.5166L-0.000732422 14.4482L2.27473 7.43875L11.8914 10.5168V0.422546H19.3081V10.4873L28.9582 7.33985L31.2727 14.3367L21.6002 17.4915L27.6016 25.6592L21.6101 30L15.6021 21.8235L9.64406 29.9451L3.64918 25.6089L9.58568 17.5166Z'
                  style={{
                    pathLength: shouldReduceMotion ? 1 : scrollPathLength,
                  }}
                />
              </motion.svg>
            </Link>
          </li>
          <li>
            <Link
              className='site-primary-link'
              href='/about-me'
              onMouseEnter={handleLinkMouseEnter}
            >
              About me
            </Link>
          </li>
          <li>
            <Link
              className='site-primary-link'
              href='/and'
              onMouseEnter={handleLinkMouseEnter}
            >
              ...And
            </Link>
          </li>
        </ul>
        <motion.span
          aria-hidden
          animate={hoverPosition}
          className='site-primary-hover-background'
          initial={false}
          transition={{
            damping: 26,
            mass: 0.45,
            stiffness: 360,
            type: 'spring',
          }}
        />
      </nav>
      <ThemeRadio />
    </header>
  );
};
