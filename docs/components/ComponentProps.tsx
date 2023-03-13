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
      }
    | boolean;
  ref?: string;
  props: ComponentProps[];
}

function TableProps({ children, ref, props }: Props) {
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
                <Tag>Required</Tag>
              )}
            </TableCell>
            <TableCell>
              {children === true || !children?.type
                ? 'React.ReactNode'
                : Array.isArray(children.type)
                ? children.type.join('| ')
                : children.type}
            </TableCell>
            <TableCell></TableCell>
            <TableCell>Child content.</TableCell>
          </TableRow>
        )}
        {props.map(
          (
            { name, type, required, deprecated, defaultValue, description },
            index
          ) => (
            <TableRow key={name}>
              <TableCell>
                {name} {required && <Tag>Required</Tag>}{' '}
                {deprecated && <Tag>deprecated</Tag>}
              </TableCell>
              <TableCell>
                {Array.isArray(type) ? type.join(' | ') : type}
              </TableCell>
              <TableCell>{defaultValue}</TableCell>
              <TableCell>{description}</TableCell>
            </TableRow>
          )
        )}
        {ref && (
          <TableRow>
            <TableCell>Ref</TableCell>
            <TableCell>{ref}</TableCell>
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
  props,
  ref,
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
                  <Tag>Required</Tag>
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
                  {name} {required && <Tag>Required</Tag>}{' '}
                  {deprecated && <Tag>deprecated</Tag>}
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
      {children && (
        <li>
          <DescriptionList collapsed={collapsed}>
            <DescriptionListItem>
              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>ref</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Type</DescriptionTerm>
              <DescriptionDetails>{ref}</DescriptionDetails>
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

export default function ComponentProps({ children, props }: Props) {
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
      props={props}
      collapsed={collapsed}
    />
  ) : (
    <TableProps children={children} props={props} />
  );
}
