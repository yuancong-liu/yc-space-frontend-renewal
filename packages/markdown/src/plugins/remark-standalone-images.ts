import type { Image, Paragraph, PhrasingContent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

export const STANDALONE_IMAGE_ATTRIBUTE = 'data-standalone';

const isBlank = (node: PhrasingContent) =>
  node.type === 'text' && node.value.trim() === '';

const isImage = (node: PhrasingContent): node is Image => node.type === 'image';

const markStandalone = (image: Image) => {
  const data = image.data ?? (image.data = {});
  data.hProperties = {
    ...data.hProperties,
    [STANDALONE_IMAGE_ATTRIBUTE]: 'true',
  };
};

/**
 * Finds images that make up a paragraph on their own and flags them for the
 * image component, turning the paragraph into a plain wrapper.
 *
 * Both halves matter for valid HTML: the component renders a `<figure>` with a
 * caption for a standalone image, and a browser refuses to keep a `<figure>`
 * inside a `<p>` — the server markup and the hydrated DOM would disagree. An
 * image sitting inside a sentence is left alone and renders as a bare `<img>`.
 */
export const remarkStandaloneImages = () => (tree: Root) => {
  visit(tree, 'paragraph', (node: Paragraph) => {
    const meaningful = node.children.filter(child => !isBlank(child));

    if (meaningful.length === 0 || !meaningful.every(isImage)) return;

    const data = node.data ?? (node.data = {});
    data.hName = 'div';
    data.hProperties = { className: ['yc-figure-block'] };

    meaningful.forEach(markStandalone);
  });
};
