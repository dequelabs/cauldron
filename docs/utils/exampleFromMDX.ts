import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { mdxFromMarkdown } from 'mdast-util-mdx';

const transformer = () => {
  return tree => {
    visit(tree, 'code', (node, index, parent) => {
      const { meta, lang, value: code } = node;
      if (!meta || meta !== 'example') {
        return node;
      }

      const options = {
        extensions: [mdxjs()],
        mdastExtensions: [mdxFromMarkdown()]
      };

      const codeFence = fromMarkdown(`\`\`\`${lang}\n${code}\n\`\`\``);
      const updatedNode = fromMarkdown(
        `\`\`\`jsx\n${code}\n\`\`\`
${code}>`,
        options
      );

      Object.assign(node, updatedNode);
    });
  };
};

export default transformer;
