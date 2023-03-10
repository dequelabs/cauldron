import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Code } from '@deque/cauldron-react';
import CopyToClipboardButton from './CopyToClipboardButton';
import './example.css';

interface ExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  raw: string;
}

export default function Example({ children, raw, ...props }: ExampleProps) {
  return (
    <section className="Component__example" {...props}>
      {children}
      <div className="Component__example__code">
        <Code children={raw} />
        <CopyToClipboardButton value={raw} />
      </div>
    </section>
  );
}
