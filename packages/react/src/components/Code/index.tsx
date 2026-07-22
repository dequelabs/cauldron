import React, { useRef, useState, useEffect } from 'react';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
// Fully-specified (`.js`) cjs subpaths: react-syntax-highlighter has no
// `exports` map, so the ESM build's `{"type":"module"}` marker makes strict
// bundlers (webpack 5) resolve these fully-specified — an extensionless
// specifier fails there. The cjs paths (not esm) are kept deliberately: they
// resolve under Node `require`, Node ESM interop, and bundlers alike, whereas
// the esm subpaths are bare ESM in a non-module package and break under Node.
import SyntaxHighlighterImport from 'react-syntax-highlighter/dist/cjs/light.js';
import classNames from 'classnames';
import jsImport from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript.js';
import cssImport from 'react-syntax-highlighter/dist/cjs/languages/hljs/css.js';
import xmlImport from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml.js';
import yamlImport from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml.js';
import type { ContentNode } from '../../types';
import { useId } from 'react-id-generator';
import CopyButton, { CopyButtonProps } from '../CopyButton';
import interopDefault from '../../utils/interopDefault';

// react-syntax-highlighter ships `__esModule`, so its default imports come back
// double-wrapped under strict ESM; unwrap them (see interopDefault).
const SyntaxHighlighter = interopDefault(SyntaxHighlighterImport);
const js = interopDefault(jsImport);
const css = interopDefault(cssImport);
const xml = interopDefault(xmlImport);
const yaml = interopDefault(yamlImport);

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
  label?: ContentNode;
  allowCopy?: boolean;
  copyButtonProps?: React.ComponentProps<typeof CopyButton>;
} & SyntaxHighlighterProps &
  React.HTMLAttributes<HTMLDivElement>;

const Code: React.ComponentType<React.PropsWithChildren<Props>> = ({
  children,
  className,
  scrollable = false,
  label,
  allowCopy = false,
  copyButtonProps,
  ...props
}: Props) => {
  const ref = useRef<HTMLPreElement>(null);
  const [scrollableRegion, setScrollableRegion] = useState(false);
  const [id] = useId(1, 'code');
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
    <>
      {(label || allowCopy) && (
        <div className="Code__Header">
          {label && <span id={`${id}-label`}>{label}</span>}
          {allowCopy && <CopyButton value={children} {...copyButtonProps} />}
        </div>
      )}
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
    </>
  );
};

Code.displayName = 'Code';

export default Code;
