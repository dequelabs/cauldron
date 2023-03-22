/* Note: This file imports esm only packages, so it _has_ to be mjs */
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { remarkMdxToc } from 'remark-mdx-toc'
import remarkGfm from 'remark-gfm'

import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { mdxExpressionFromMarkdown } from 'mdast-util-mdx-expression'

const index = 0

const exampleFromMDX = () => {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      const { meta, lang, value: raw } = node;
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

      // HACKY - using an AST parser to detect functions
      // would be a better (and safer) experience than this
      let func = ''
      let render = ''
      if (raw.startsWith('function')) {
        // Try to parse the name
        const [,name] = raw.match(/^function\s+(\w+)/)
        if (name) {
          func = `\n\nexport ${raw}\n\n`
          render = `<${name} />`
        }
      }

      if (!func) {
        // We want to ensure that any react markup renders pure and does
        // not get rendered using markdown components, so export the code
        // wrapped in a function to ensure components do not get applied
        index++
        func = `\n\nexport function CodeExample${index}() { return <>${raw}</> }\n\n`
        render = `<CodeExample${index} />`
      }

      const exampleMarkdown =  `${func}<Example raw={''}>
{
  <div className="Component__example__react">
  ${render || raw}
  </div>
}
</Example>`

      const updatedNode = fromMarkdown(
        exampleMarkdown,
        options
      );

      // Note: From markdown will strip extra whitespace from raw code, which
      // we want to preserve so manually include it in the mdast
      updatedNode.children[func ? 1 : 0].attributes[0].value = raw

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