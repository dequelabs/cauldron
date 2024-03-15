import * as React from 'react';

type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

export type PolymorphicProps<
  Props = {},
  ElementType extends React.ElementType = React.ElementType
> = Props & { as?: ElementType };

export type PolymorphicComponentProps<
  Props = {},
  ElementType extends React.ElementType = React.ElementType
> = Merge<
  ElementType extends keyof JSX.IntrinsicElements
    ? // Support intrinsic elements, e.g. as="a", as="button", as="div"...
      React.PropsWithRef<JSX.IntrinsicElements[ElementType]>
    : never,
  PolymorphicProps<Props, ElementType>
>;

export type PolymorphicComponent<
  Props = {},
  ElementType extends React.ElementType = React.ElementType
> = Merge<
  React.ForwardRefExoticComponent<Props>,
  {
    <T extends React.ElementType = ElementType>(
      props: PolymorphicComponentProps<Props, T>
    ): React.ReactElement | null;
  }
>;
