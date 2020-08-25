import React from 'react';
import PropTypes from 'prop-types';
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps
} from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', xml);

interface Props extends SyntaxHighlighterProps {
  children: React.ReactNode;
  language?: 'javascript' | 'css' | 'html';
}

const Code: React.ComponentType<Props> = ({ children, ...props }) => (
  <SyntaxHighlighter {...props} useInlineStyles={false}>
    {children}
  </SyntaxHighlighter>
);

Code.displayName = 'Code';

Code.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.oneOf(['javascript', 'css', 'html'])
};

export default Code;
