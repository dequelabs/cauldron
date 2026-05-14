import React, { useEffect, useRef, useState } from 'react';
import { Offscreen, Link, Icon, Panel } from '@deque/cauldron-react';
import TableOfContents, { Heading } from './TableOfContents';
import { getEditUrl } from '../repo-metadata';
import './ComponentLayout.css';

interface ComponentLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  source?: string;
  deprecated?: boolean;
  storybook?: boolean;
  toc: Heading[];
  children: React.ReactNode;
  filepath: string;
}

export default function ComponentLayout({
  children,
  title,
  description,
  source,
  toc = [],
  deprecated = false,
  storybook = false,
  filepath
}: ComponentLayoutProps) {
  const storybookSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const storybookUrl = `/storybook/?path=/docs/components-${storybookSlug}--docs`;
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <section aria-labelledby="on-this-page">
        <h2 id="on-this-page">On This Page</h2>
        <TableOfContents
          headings={toc}
          container={containerRef}
          aria-labelledby="on-this-page"
        />
      </section>
      <div className="Component" ref={containerRef}>
        <Panel className="Component__hero">
          <h1 id="main-title">{title}</h1>
          {description && <p>{description}</p>}
          <ul className="Component__metadata">
            {deprecated && (
              <li className="Pill Pill--deprecated">Deprecated</li>
            )}
            {source && (
              <li>
                <Link href={source} target="_blank" rel="noopener noreferrer">
                  Source <Offscreen>link opens in new window</Offscreen>{' '}
                  <Icon type="external-link" />
                </Link>
              </li>
            )}
            {storybook && (
              <li>
                <Link
                  href={storybookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Storybook{' '}
                  <Offscreen>link opens in new window</Offscreen>{' '}
                  <Icon type="external-link" />
                </Link>
              </li>
            )}
          </ul>
        </Panel>
        <Panel>{children}</Panel>
        <div className="Component__history">
          <Link href={getEditUrl(filepath)}>Edit this page on GitHub</Link>
        </div>
      </div>
    </>
  );
}
