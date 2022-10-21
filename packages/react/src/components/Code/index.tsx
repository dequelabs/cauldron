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

// HACK: This is a workaround for a bug in react-syntax-highlighter's types.
const Highlighter = SyntaxHighlighter as React.ComponentType<
  SyntaxHighlighterProps
>;

interface Props extends SyntaxHighlighterProps {
  children: string;
  language?: 'javascript' | 'css' | 'html' | 'yaml';
  className?: string;
  tabIndex?: number;
  ariaLabel?: string;
}

const Code: React.ComponentType<React.PropsWithChildren<Props>> = ({
  children,
  className,
  tabIndex,
  ariaLabel,
  ariaLabelledBy,
  ...props
}) => {
  if (!ariaLabel) ariaLabel = 'Code snippet';

  return (
    <>
      <Highlighter
        {...props}
        useInlineStyles={false}
        className={classNames('Code', className)}
        tabIndex={tabIndex}
        {...(tabIndex === 0 &&
          !ariaLabelledBy && { role: 'region', 'aria-label': ariaLabel })}
        {...(tabIndex === 0 &&
          ariaLabelledBy && {
            role: 'region',
            'aria-labelledby': ariaLabelledBy
          })}
      >
        {children}
      </Highlighter>
    </>
  );
};

Code.displayName = 'Code';

Code.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.oneOf(['javascript', 'css', 'html', 'yaml']),
  className: PropTypes.string,
  tabIndex: PropTypes.number
};

export default Code;
