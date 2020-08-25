import React from 'react';
import PropTypes from 'prop-types';
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps
} from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/languages/hljs/javascript';
import bash from 'react-syntax-highlighter/dist/languages/hljs/bash';
import css from 'react-syntax-highlighter/dist/languages/hljs/css';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);

interface Props extends SyntaxHighlighterProps {
  children: React.ReactNode;
}

const Code: React.ComponentType<Props> = ({ children, ...props }) => (
  <div>
    <SyntaxHighlighter {...props} useInlineStyles={false}>
      {children}
    </SyntaxHighlighter>
  </div>
);

Code.displayName = 'Code';

Code.defaultProps = { language: 'javascript' };

Code.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.string
};

export default Code;
