const FENCED_CODE = /```[\s\S]*?```/g;
const BLOCK_DIRECTIVE = /^:{2,}[^\n]*$/gm;
// Whole line: the title is shown beside the excerpt, not inside it.
const HEADING = /^#{1,6}\s+.*$/gm;
const BLOCKQUOTE = /^>\s?/gm;
const LIST_MARKER = /^\s*(?:[-*+]|\d+\.)\s+(?:\[[ x]\]\s+)?/gm;
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g;
const LINK = /\[([^\]]*)\]\([^)]*\)/g;
const INLINE_CODE = /`([^`]*)`/g;
const EMPHASIS = /(\*{1,3}|_{1,3}|~~)(.*?)\1/g;
const TABLE_ROW = /^\|.*\|$/gm;
const THEMATIC_BREAK = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm;
const HARD_BREAK = /\\$/gm;

/**
 * Plain-text opening of a post, for cards and meta descriptions.
 *
 * Deliberately a text transform rather than a trip through the renderer: this
 * runs for every card in a listing, and the markup would only be thrown away.
 * It is lossy by design — a post with a hand-written summary should use that.
 */
export const excerpt = (body: string, maxLength = 160) => {
  const plain = body
    .replace(FENCED_CODE, '')
    .replace(BLOCK_DIRECTIVE, '')
    .replace(TABLE_ROW, '')
    .replace(THEMATIC_BREAK, '')
    .replace(IMAGE, '')
    .replace(LINK, '$1')
    .replace(INLINE_CODE, '$1')
    .replace(EMPHASIS, '$2')
    .replace(HEADING, '')
    .replace(BLOCKQUOTE, '')
    .replace(LIST_MARKER, '')
    .replace(HARD_BREAK, '')
    .split(/\n{2,}/)
    .map(block => block.replace(/\s+/g, ' ').trim())
    .find(block => block.length > 0);

  if (!plain) return '';
  if (plain.length <= maxLength) return plain;

  const clipped = plain.slice(0, maxLength);
  // Only break on a space when there is one to break on; CJK runs have none.
  const lastSpace = clipped.lastIndexOf(' ');
  const cut = lastSpace > maxLength * 0.6 ? clipped.slice(0, lastSpace) : clipped;

  return `${cut.trimEnd()}…`;
};
