import {
  BioRhyme,
  Geologica,
  IBM_Plex_Sans_JP,
  JetBrains_Mono,
} from 'next/font/google';

/**
 * The families carried over from the previous site: Geologica for body copy,
 * BioRhyme for display type (headings, links, the quote mark), JetBrains Mono
 * for code, IBM Plex Sans JP behind all three for Japanese.
 *
 * next/font has to be called from an app, so this mirrors the site's copy; the
 * stacks themselves live once, in @yc/ui's theme.css.
 */
const geologica = Geologica({
  variable: '--font-geologica',
  subsets: ['latin'],
});

const bioRhyme = BioRhyme({
  variable: '--font-biorhyme',
  subsets: ['latin'],
});

/**
 * `subsets` reads wrong here and is not: next/font types this family as
 * latin-only, but Google returns the Japanese coverage as ~123 numbered
 * unicode-range chunks that are not a named subset, and next/font self-hosts
 * them all regardless. The build emits 246 @font-face rules and the browser
 * fetches a chunk only when a glyph in its range appears, so asking for
 * 'latin' costs nothing and still renders 日本語. Do not "fix" this by loading
 * the family from Google's CDN instead.
 */
const ibmPlexSansJp = IBM_Plex_Sans_JP({
  variable: '--font-ibm-plex-sans-jp',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const fontVariables = [
  geologica.variable,
  bioRhyme.variable,
  ibmPlexSansJp.variable,
  jetBrainsMono.variable,
].join(' ');
