import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import classNames from 'classnames';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/cjs/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('yaml', yaml);

// HACK: This is a workaround for a bug in react-syntax-highlighter's types.
const Highlighter =
  SyntaxHighlighter as React.ComponentType<SyntaxHighlighterProps>;

type Props = {
  children: string;
  language?: 'javascript' | 'css' | 'html' | 'yaml';
  className?: string;
  scrollable?: boolean;
} & SyntaxHighlighterProps &
  React.HTMLAttributes<HTMLDivElement>;

const Code: React.ComponentType<React.PropsWithChildren<Props>> = ({
  children,
  className,
  scrollable = false,
  ...props
}) => {
  const ref = useRef<HTMLPreElement>(null);
  const [scrollableRegion, setScrollableRegion] = useState(false);
  // react-syntax-highlighter does not provide direct access to its dom elements
  // via refs, but we can specify the wrapping tags to bypass this limitation
  // see: https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/335
  const PreWithRef = (preProps: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...preProps} ref={ref} />
  );

  useEffect(() => {
    let observer: ResizeObserver;

    // Track the containing element because resize observer will not
    // trigger once an element becomes scrollable
    if (scrollable && ref.current?.parentElement) {
      const listener: ResizeObserverCallback = () => {
        if (!ref.current) {
          return;
        }

        const element = ref.current;
        setScrollableRegion(element.clientWidth < element.scrollWidth);
      };
      const observer = new ResizeObserver(listener);
      observer.observe(ref.current.parentElement);
    }

    return () => {
      setScrollableRegion(false);
      observer?.disconnect();
    };
  }, [scrollable]);

  return (
    <Highlighter
      {...props}
      PreTag={PreWithRef}
      useInlineStyles={false}
      className={classNames('Code', className, {
        'Code--scrollable': scrollable
      })}
      tabIndex={scrollableRegion ? 0 : undefined}
    >
      {children}
    </Highlighter>
  );
};

Code.displayName = 'Code';

Code.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.oneOf(['javascript', 'css', 'html', 'yaml']),
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  scrollable: PropTypes.bool
};

export default Code;
