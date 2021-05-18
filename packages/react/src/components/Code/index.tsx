import React from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light';
import classNames from 'classnames';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('yaml', yaml);

interface Props extends SyntaxHighlighterProps {
  children: React.ReactNode;
  language?: 'javascript' | 'css' | 'html' | 'yaml';
  className?: string;
}

const Code: React.ComponentType<Props> = ({
  children,
  className,
  ...props
}) => (
  <SyntaxHighlighter
    {...props}
    useInlineStyles={false}
    className={classNames('Code', className)}
  >
    {children}
  </SyntaxHighlighter>
);

Code.displayName = 'Code';

Code.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.oneOf(['javascript', 'css', 'html', 'yaml']),
  className: PropTypes.string
};

export default Code;
