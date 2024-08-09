import React, { useLayoutEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails,
  Tag
} from '@deque/cauldron-react';

export interface ComponentProps {
  name: string;
  type: string | string[];
  required?: boolean;
  deprecated?: boolean;
  defaultValue?: string;
  description: string;
}

interface Props {
  children:
    | {
        required?: boolean;
        type?: string | string[];
        description?: string;
      }
    | boolean;
  className?: boolean;
  refType?: string;
  props: ComponentProps[];
}

function TableProps({ children, className, refType, props }: Props) {
  return (
    <Table className="Component__Props">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Default</TableHeader>
          <TableHeader>Description</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {children && (
          <TableRow>
            <TableCell>
              children{' '}
              {(children as Record<string, unknown>)?.required && (
                <Tag size="small">Required</Tag>
              )}
            </TableCell>
            <TableCell>
              {children === true || !children?.type
                ? 'React.ReactNode'
                : Array.isArray(children.type)
                ? children.type.join(' | ')
                : children.type}
            </TableCell>
            <TableCell></TableCell>
            <TableCell>{children?.description || 'Child content.'}</TableCell>
          </TableRow>
        )}
        {className && (
          <TableRow>
            <TableCell>className</TableCell>
            <TableCell>string</TableCell>
            <TableCell></TableCell>
            <TableCell>Class name string.</TableCell>
          </TableRow>
        )}
        {props.map(
          (
            { name, type, required, deprecated, defaultValue, description },
            index
          ) => (
            <TableRow key={name}>
              <TableCell>
                {name} {required && <Tag size="small">Required</Tag>}{' '}
                {deprecated && <Tag size="small">deprecated</Tag>}
              </TableCell>
              <TableCell>
                {Array.isArray(type) ? type.join(' | ') : type}
              </TableCell>
              <TableCell>{defaultValue}</TableCell>
              <TableCell>{description}</TableCell>
            </TableRow>
          )
        )}
        {refType && (
          <TableRow>
            <TableCell>ref</TableCell>
            <TableCell>React.RefObject&lt;{refType}&gt;</TableCell>
            <TableCell></TableCell>
            <TableCell>
              A ref pointed to the element rendered by this component.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function DescriptionListProps({
  children,
  className,
  props,
  refType,
  collapsed
}: Props & { collapsed?: boolean }) {
  return (
    <ul className="Component__Props">
      {children && (
        <li>
          <DescriptionList collapsed={collapsed}>
            <DescriptionListItem>
              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>
                children{' '}
                {(children as Record<string, unknown>)?.required && (
                  <Tag size="small">Required</Tag>
                )}
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Type</DescriptionTerm>
              <DescriptionDetails>
                {children === true || !children?.type
                  ? 'React.ReactNode'
                  : Array.isArray(children.type)
                  ? children.type.join('| ')
                  : children.type}
              </DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails>Child content.</DescriptionDetails>
            </DescriptionListItem>
          </DescriptionList>
        </li>
      )}
      {className && (
        <li>
          <DescriptionList collapsed={collapsed}>
            <DescriptionListItem>
              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>className</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Type</DescriptionTerm>
              <DescriptionDetails>string</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails>Class name string.</DescriptionDetails>
            </DescriptionListItem>
          </DescriptionList>
        </li>
      )}
      {props.map(
        (
          { name, type, required, deprecated, defaultValue, description },
          index
        ) => (
          <li key={name}>
            <DescriptionList collapsed={collapsed}>
              <DescriptionListItem>
                <DescriptionTerm>Name</DescriptionTerm>
                <DescriptionDetails>
                  {name} {required && <Tag size="small">Required</Tag>}{' '}
                  {deprecated && <Tag size="small">deprecated</Tag>}
                </DescriptionDetails>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionTerm>Type</DescriptionTerm>
                <DescriptionDetails>
                  {Array.isArray(type) ? type.join(' | ') : type}
                </DescriptionDetails>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionTerm>Default</DescriptionTerm>
                <DescriptionDetails>{defaultValue}</DescriptionDetails>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionTerm>Description</DescriptionTerm>
                <DescriptionDetails>{description}</DescriptionDetails>
              </DescriptionListItem>
            </DescriptionList>
          </li>
        )
      )}
      {refType && (
        <li>
          <DescriptionList collapsed={collapsed}>
            <DescriptionListItem>
              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>ref</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Type</DescriptionTerm>
              <DescriptionDetails>{refType}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails>
                A ref pointed to the element rendered by this component.
              </DescriptionDetails>
            </DescriptionListItem>
          </DescriptionList>
        </li>
      )}
    </ul>
  );
}

export default function ComponentProps({
  children,
  className,
  refType,
  props = []
}: Props) {
  const [narrow, setNarrow] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useLayoutEffect(() => {
    const narrowList = matchMedia('(max-width: 50rem)');
    const collapsedList = matchMedia('(max-width: 32rem)');

    const narrowListener = ({ matches }: { matches: boolean }) => {
      setNarrow(matches);
    };

    const collapsedListener = ({ matches }: { matches: boolean }) => {
      setCollapsed(matches);
    };

    // Match the initial state
    narrowListener({ matches: narrowList.matches });
    collapsedListener({ matches: collapsedList.matches });

    narrowList.addEventListener('change', narrowListener);
    collapsedList.addEventListener('change', collapsedListener);

    return () => {
      narrowList.removeEventListener('change', narrowListener);
      collapsedList.removeEventListener('change', collapsedListener);
    };
  }, []);

  return narrow ? (
    <DescriptionListProps
      children={children}
      className={className}
      props={props}
      refType={refType}
      collapsed={collapsed}
    />
  ) : (
    <TableProps
      children={children}
      className={className}
      refType={refType}
      props={props}
    />
  );
}
