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
  TableCell
} from '@deque/cauldron-react';
import Example from './components/Example';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: number;
}

function Heading({ level, children, ...props }: HeadingProps) {
  const HeadingComponent = `h${level}` as 'h1';
  const slug = slugify(children as string);
  return (
    <HeadingComponent id={slug} {...props}>
      <a
        className="Permalink"
        href={`#${slug}`}
        aria-label={`{children} (permalink)`}
      >
        <Icon type="link" />
      </a>
      {children}
    </HeadingComponent>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

function Link({ href, ...props }: LinkProps) {
  // TODO: Check for relative/external links
  return <RouterLink to={href as string} {...props} />;
}

interface MDXComponentProps {
  [key: string]: (props: unknown) => JSX.Element;
}

const mdxComponents = {
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
  h1: <T extends React.HTMLAttributes<HTMLHeadingElement>>(props: T) => (
    <Heading level={1} {...props} />
  ),
  h2: <T extends React.HTMLAttributes<HTMLHeadingElement>>(props: T) => (
    <Heading level={2} {...props} />
  ),
  h3: <T extends React.HTMLAttributes<HTMLHeadingElement>>(props: T) => (
    <Heading level={3} {...props} />
  ),
  h4: <T extends React.HTMLAttributes<HTMLHeadingElement>>(props: T) => (
    <Heading level={4} {...props} />
  ),
  h5: <T extends React.HTMLAttributes<HTMLHeadingElement>>(props: T) => (
    <Heading level={5} {...props} />
  ),
  h6: <T extends React.HTMLAttributes<HTMLHeadingElement>>(props: T) => (
    <Heading level={6} {...props} />
  ),
  Example
};

export default mdxComponents;
