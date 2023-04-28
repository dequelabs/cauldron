import React, { useState, useRef, useEffect } from 'react';
import slugify from '../utils/slugify';

export interface Heading {
  depth: number;
  value: string;
  children?: Heading[];
}

interface TableOfContentsProps extends React.HTMLAttributes<HTMLDivElement> {
  headings: Heading[];
  container: React.RefObject<HTMLElement>;
}

const elementSelector = '[id]:is(h2,h3)';

export default function TableOfContents({
  headings = [],
  container,
  ...props
}: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState<string | null>();

  useEffect(() => {
    const observingElements = new Map<Element, boolean>(
      Array.from(
        container.current?.querySelectorAll(elementSelector) || []
      ).map(element => [element, false])
    );

    const handleIntersection: IntersectionObserverCallback = entries => {
      for (const entry of entries) {
        observingElements.set(entry.target, entry.isIntersecting);
      }

      const visibleElements = Array.from(observingElements.entries())
        .filter(([, visible]) => visible)
        .map(([element]) => element);

      setActiveHeading(visibleElements[0].getAttribute('id') ?? null);
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: document.querySelector('.Layout'),
      rootMargin: '0px',
      threshold: [0.0, 1.0]
    });

    observingElements.forEach((value, element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  const headingToTOC = (heading: Heading) => {
    const slug = slugify(heading.value);
    const active = slug === activeHeading;
    const props = active
      ? {
          className: 'toc--active',
          'aria-current': 'true'
        }
      : {};

    if (heading.depth > 3) {
      // Only display heading levels 2-3
      return null;
    }

    return (
      <li key={slug}>
        <a href={`#${slug}`} {...props}>
          {heading.value}
        </a>
        {!!heading.children?.length && (
          <ul>{heading.children.map(headingToTOC)}</ul>
        )}
      </li>
    );
  };

  return (
    <nav {...props}>
      <ul className="toc">{headings.map(headingToTOC)}</ul>
    </nav>
  );
}
