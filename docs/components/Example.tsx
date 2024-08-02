import React, { useEffect, useState, useRef } from 'react';
import { Code, CopyButton } from '@deque/cauldron-react';
import './example.css';

interface ExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  raw: string;
}

export default function Example({ children, raw, ...props }: ExampleProps) {
  const label = 'copy code example to clipboard';
  const [accessibleName, setAccessibleName] = useState(label);
  const ref = useRef<HTMLButtonElement>();

  useEffect(() => {
    // We don't know what context this button will be included in, so providing
    // a minimal accessible name of "example, x of y"
    const elements = Array.from(
      document.querySelectorAll('[data-copy-example]')
    );
    const index = elements.findIndex((element) => element === ref.current);
    if (index !== -1 && elements.length) {
      setAccessibleName(`${label}, ${index + 1} of ${elements.length}`);
    }
  }, [raw]);

  return (
    <section className="Component__example" {...props}>
      {children}
      <div className="Component__example__code">
        <Code children={raw} scrollable />
        <CopyButton
          ref={ref}
          data-copy-example
          value={raw}
          notificationLabel="copied"
          hideVisibleLabel
          thin
        >
          {accessibleName}
        </CopyButton>
      </div>
    </section>
  );
}
