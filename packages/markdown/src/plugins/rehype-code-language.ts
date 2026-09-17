import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

const LANGUAGE_CLASS = /^language-(.+)$/;

const codeLanguage = (element: Element): string | undefined => {
  const className = element.properties?.className;
  if (!Array.isArray(className)) return undefined;

  return className
    .map(value => LANGUAGE_CLASS.exec(String(value))?.[1])
    .find(Boolean);
};

/**
 * Lifts the fenced-block language from `<code class="language-x">` onto its
 * parent `<pre>`, so the pre component can label the block without walking its
 * own children. Runs after rehype-highlight, which is what adds the class.
 */
export const rehypeCodeLanguage = () => (tree: Root) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'pre') return;

    const code = node.children.find(
      (child): child is Element =>
        child.type === 'element' && child.tagName === 'code'
    );
    if (!code) return;

    const language = codeLanguage(code);
    if (!language) return;

    node.properties = { ...node.properties, 'data-language': language };
  });
};
