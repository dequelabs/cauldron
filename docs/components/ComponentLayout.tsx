import React from 'react';
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
  return (
    <>
      <section aria-labelledby="on-this-page">
        <div>
          <h2 id="on-this-page">On This Page</h2>
          <nav>
            <ul className="toc">{toc.map(HeadingsToTOC)}</ul>
          </nav>
        </div>
      </section>
      <div className="Component">
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
