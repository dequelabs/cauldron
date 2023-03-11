import React, { useEffect, useRef } from 'react';
import { Offscreen, Link, Icon, Panel } from '@deque/cauldron-react';
import slugify from '../utils/slugify';
import './ComponentLayout.css';

interface Heading {
  depth: number;
  value: string;
  children?: Heading[];
}

interface ComponentLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  source?: string;
  deprecated?: boolean;
  toc: Heading[];
  children: React.ReactNode;
}

function HeadingsToTOC(heading: Heading) {
  const slug = slugify(heading.value);
  return (
    <li key={slug}>
      <a href={`#${slug}`}>{heading.value}</a>
      {!!heading.children?.length && (
        <ul>{heading.children.map(HeadingsToTOC)}</ul>
      )}
    </li>
  );
}

export default function ComponentLayout({
  children,
  title,
  description,
  source,
  toc = [],
  deprecated = false
}: ComponentLayoutProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tocRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = document.querySelector('.Component');
    const headings: Element[] = Array.from(
      document.querySelectorAll('h2,h3,h4,h5,h6')
    ).filter(el => !!el.id && containerRef.current.contains(el));
    const anchors: HTMLLinkElement[] = Array.from(
      tocRef.current.querySelectorAll('a[href]')
    );

    // Set the first element as active
    anchors[0]?.classList.toggle('toc--active');

    const handleIntersection: IntersectionObserverCallback = ([entry]) => {
      const { target, isIntersecting, intersectionRect, rootBounds } = entry;
      const clearActive = () =>
        anchors.forEach(el => el.classList.remove('toc--active'));

      if (
        !isIntersecting &&
        intersectionRect.top <= (rootBounds?.top as number)
      ) {
        clearActive();
        const id = target.getAttribute('id');
        anchors
          .find(el => el.getAttribute('href')?.substr(1) === id)
          ?.classList.toggle('toc--active');
      } else {
        // handle when element scrolls up
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: document.querySelector('.Layout'),
      rootMargin: '0px',
      threshold: 1.0
    });

    headings.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section aria-labelledby="on-this-page">
        <div>
          <h2 id="on-this-page">On This Page</h2>
          <nav>
            <ul className="toc" ref={tocRef}>
              {toc.map(HeadingsToTOC)}
            </ul>
          </nav>
        </div>
      </section>
      <div className="Component" ref={containerRef}>
        <h1 id={slugify(title)}>{title}</h1>
        {description && <p>{description}</p>}

        <ul className="Component__metadata">
          {deprecated && <li className="Pill Pill--deprecated">Deprecated</li>}
          {source && (
            <li>
              <Link href={source} target="_blank" rel="noopener noreferrer">
                Source <Offscreen>link opens in new window</Offscreen>{' '}
                <Icon type="external-link" />
              </Link>
            </li>
          )}
        </ul>
        <Panel>{children}</Panel>
      </div>
    </>
  );
}
