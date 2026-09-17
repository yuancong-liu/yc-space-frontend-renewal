import type { Root } from 'mdast';
import type { ContainerDirective, LeafDirective } from 'mdast-util-directive';
import { SKIP, visit } from 'unist-util-visit';

import {
  DIRECTIVE_NAMES,
  UNKNOWN_DIRECTIVE_TAG,
  directiveTagName,
} from '../directives';

type BlockDirective = ContainerDirective | LeafDirective;

/** Anything unified can stringify back to the original source. */
type SourceFile = { toString: () => string };

/** The shape every mdast parent shares, without their differing child unions. */
type LooseParent = { children: Array<{ type: string; value?: string }> };

const hasChildren = (node: unknown): node is LooseParent =>
  typeof node === 'object' &&
  node !== null &&
  Array.isArray((node as LooseParent).children);

const isBlockDirective = (node: { type: string }): node is BlockDirective =>
  node.type === 'containerDirective' || node.type === 'leafDirective';

/** Directive attributes are `string | null | undefined`; drop the empty ones. */
const cleanAttributes = (attributes: BlockDirective['attributes']) =>
  Object.fromEntries(
    Object.entries(attributes ?? {}).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  );

/**
 * Turns `::name{…}` and `:::name{…}` into `yc-<name>` elements that
 * rehype-react maps to the components in `../directives`. An unrecognised name
 * renders as a visible notice rather than disappearing, so a typo shows up in
 * the CMS preview instead of silently dropping content.
 *
 * Inline directives (`:name`) are deliberately unsupported and restored to
 * their literal source: a single colon followed by a word is ordinary prose —
 * `16:10`, `12:30`, `note:this` — and swallowing it would corrupt post bodies.
 * Block directives need the colon at the start of a line, so they cannot be
 * triggered by accident.
 */
export const remarkYcDirectives =
  () => (tree: Root, file: SourceFile) => {
    const source = String(file);

    visit(tree, (node, index, parent) => {
      if (node.type === 'textDirective') {
        const from = node.position?.start.offset;
        const to = node.position?.end.offset;

        if (parent && index !== undefined && from !== undefined && to !== undefined) {
          parent.children[index] = { type: 'text', value: source.slice(from, to) };
        }

        return SKIP;
      }

      if (!isBlockDirective(node)) return undefined;

      const data = node.data ?? (node.data = {});

      if (!DIRECTIVE_NAMES.includes(node.name)) {
        data.hName = UNKNOWN_DIRECTIVE_TAG;
        data.hProperties = { name: node.name };
        return undefined;
      }

      data.hName = directiveTagName(node.name);
      data.hProperties = cleanAttributes(node.attributes);

      return undefined;
    });

    // Restoring an inline directive leaves a text node next to its neighbours;
    // merging them keeps `16:10` one node instead of three, which is what the
    // rendered HTML expects. mdast's `children` is a union of arrays, so the
    // merge works against the one shape every content node shares.
    visit(tree, node => {
      if (!hasChildren(node)) return;

      for (let i = node.children.length - 1; i > 0; i -= 1) {
        const current = node.children[i];
        const previous = node.children[i - 1];

        if (current.type === 'text' && previous.type === 'text') {
          previous.value = (previous.value ?? '') + (current.value ?? '');
          node.children.splice(i, 1);
        }
      }
    });
  };
