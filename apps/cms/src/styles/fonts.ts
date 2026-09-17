import { BioRhyme, Geologica, JetBrains_Mono } from 'next/font/google';

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

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const fontVariables = [
  geologica.variable,
  bioRhyme.variable,
  jetBrainsMono.variable,
].join(' ');

/**
 * IBM Plex Sans JP is loaded from Google rather than self-hosted, because
 * next/font only offers its latin subsets — the Japanese ranges exist solely in
 * Google's own stylesheet, split by unicode-range so a reader who never hits a
 * Japanese glyph downloads nothing. The previous site loaded it the same way.
 */
export const JAPANESE_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@400;700&display=swap';
