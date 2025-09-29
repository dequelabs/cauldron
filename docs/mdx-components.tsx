import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import slugify from './utils/slugify';
import {
  Icon,
  Code,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Link as CauldronLink
} from '@deque/cauldron-react';
import Example from './components/Example';
import ComponentProps from './components/ComponentProps';
import Note from './components/Note';
import CssParamsTable from './components/CssParamsTable';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: number;
  children: string;
}

function Heading({ level, children, ...props }: HeadingProps) {
  const HeadingComponent = `h${level}` as 'h1';
  const slug = slugify(children as string);
  return (
    <HeadingComponent id={slug} {...props}>
      {children}
      <a
        className="Permalink"
        href={`#${slug}`}
        aria-label={`${children} (permalink)`}
      >
        #
      </a>
    </HeadingComponent>
  );
}

function Link({
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) {
    return <CauldronLink {...props} />;
  }

  const external = href.indexOf('://') > 0 || href.indexOf('//') === 0;
  if (external) {
    return <CauldronLink href={href} {...props} />;
  }

  // This works around an inconsistency between normal <a href> behavior
  // vs react-router's Link behavior. react-router resolves relative paths
  // relative to the *current* location, not the *parent* of the current
  // location. This fix means that if /components/Foo.mdx has
  // a link like [Bar](./Bar), it will be resolved as "/components/Bar" rather
  // than "/components/Foo/Bar".
  const relative = !href.startsWith('/'); // Could be "bar" or "./bar", as opposed to "/bar"
  const fixedHref = relative ? '../' + href : href;

  return (
    <RouterLink
      to={fixedHref}
      // relative="path" makes react-router resolve ".." in relative paths by skipping
      // path components, as opposed to its normal behavior of skipping <Route>s (which
      // might use a multi-segment path like "/components/Foo").
      relative="path"
      {...props}
    />
  );
}

interface MDXComponentProps {
  [key: string]: (props: unknown) => React.JSX.Element;
}

const mdxComponents = {
  ul: <T extends React.AnchorHTMLAttributes<HTMLUListElement>>(props: T) => (
    <ul className="Component__list" {...props} />
  ),
  ol: <T extends React.AnchorHTMLAttributes<HTMLUListElement>>(props: T) => (
    <ol className="Component__list" {...props} />
  ),
  a: <T extends React.AnchorHTMLAttributes<HTMLAnchorElement>>(props: T) => (
    <Link {...props} />
  ),
  pre: <T extends React.HTMLAttributes<HTMLPreElement>>({
    children,
    ...props
  }: T) => <Code children={`${(children as any)?.props?.children}`} />,
  table: <T extends React.HTMLAttributes<HTMLTableElement>>(props: T) => (
    <Table {...props} />
  ),
  thead: <T extends React.HTMLAttributes<HTMLTableSectionElement>>(
    props: T
  ) => <TableHead {...props} />,
  tbody: <T extends React.HTMLAttributes<HTMLTableSectionElement>>(
    props: T
  ) => <TableBody {...props} />,
  tr: <T extends React.HTMLAttributes<HTMLTableRowElement>>(props: T) => (
    <TableRow {...props} />
  ),
  th: <T extends React.HTMLAttributes<HTMLTableCellElement>>(props: T) => (
    <TableHeader {...props} />
  ),
  td: <T extends React.HTMLAttributes<HTMLTableCellElement>>(props: T) => (
    <TableCell {...props} />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={1} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={2} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={3} {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={4} {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={5} {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={6} {...props} />
  ),
  Example,
  ComponentProps,
  Note,
  CssParamsTable
};

export default mdxComponents;
