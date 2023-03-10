/* Note: This file imports esm only packages, so it _has_ to be mjs */
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { remarkMdxToc } from 'remark-mdx-toc'
import remarkGfm from 'remark-gfm'

import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { mdxFromMarkdown, } from 'mdast-util-mdx';
import { mdxExpressionFromMarkdown } from 'mdast-util-mdx-expression'

const exampleFromMDX = () => {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      const { meta, lang, value: code } = node;
      if (!meta || meta !== 'example') {
        return node;
      }

      const options = {
        extensions: [mdxjs()],
        mdastExtensions: [
          mdxFromMarkdown(),
          mdxExpressionFromMarkdown
        ]
      };

      const exampleMarkdown =  `<Example raw={''}>
{
  <div className="Component__example__react">
  ${code}
  </div>
}
</Example>`
      const updatedNode = fromMarkdown(
        exampleMarkdown,
        options
      );

      // Note: From markdown will strip extra whitespace from raw code, which
      // we want to preserve so manually include it in the mdast
      updatedNode.children[0].attributes[0].value = code

      Object.assign(node, updatedNode);
    });
  };
};

export default [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm,
  remarkMdxToc,
  exampleFromMDX
]