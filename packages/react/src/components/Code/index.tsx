import React from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light';
import classNames from 'classnames';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { Cauldron } from '../../types';

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
  focusable: boolean;
  LabelProps: Cauldron.LabelProps;
}

type AllProps = Props & React.AriaAttributes;

const Code: React.ComponentType<React.PropsWithChildren<AllProps>> = ({
  children,
  className,
  tabIndex,
  focusable,
  LabelProps,
  ...props
}) => {
  // how to add LabelProps?

  return (
    <>
      <Highlighter
        {...props}
        useInlineStyles={false}
        className={classNames('Code', className)}
        {...(focusable
          ? { tabIndex: 0, role: 'region' }
          : { tabIndex: tabIndex })}
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
