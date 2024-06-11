import React from 'react';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from './polymorphicComponent';

/* prop types */

interface BaseComponentProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  value: number;
}

interface DifferentComponentProps {
  anotherValue: string;
}

type ConstrainedComponentProps = PolymorphicProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>;

/* test components */

const TestComponent = React.forwardRef<HTMLDivElement, BaseComponentProps>(
  (props, ref) => {
    return <></>;
  }
) as PolymorphicComponent<BaseComponentProps>;

const ConstrainedComponent = React.forwardRef<
  HTMLHeadingElement,
  ConstrainedComponentProps
>(({ as = 'h1' }, ref) => {
  return <></>;
}) as PolymorphicComponent<ConstrainedComponentProps>;

const AnotherComponent = (props: DifferentComponentProps) => <></>;

const htmlDivRef = React.createRef<HTMLDivElement>();
const htmlAnchorRef = React.createRef<HTMLAnchorElement>();

/*
 * Note: The below components are statically typed and get validated with tsc
 * to ensure we don't arbitrarily break polymoprhic components. Valid component
 * types should throw no errors, where @ts-expect-error is used to indicate
 * an invalid or missing property.
 */

// Intrinsic element with valid props
() => (
  <TestComponent as="a" ref={htmlAnchorRef} href="/somewhere" value={1}>
    bananas
  </TestComponent>
);

// Intrinsic element with unsupported intrinsic prop
() => (
  <TestComponent
    as="div"
    ref={htmlDivRef}
    // @ts-expect-error "href" should not be allowed on "div"
    href="/somewhere"
    value={1}
  >
    bananas
  </TestComponent>
);

// Intrinsic element with invalid own prop
() => (
  <TestComponent
    as="div"
    ref={htmlDivRef}
    // @ts-expect-error 'value="one"' is not a valid prop
    value="one"
  >
    bananas
  </TestComponent>
);

// Intrinsic element with invalid extra prop
() => (
  <TestComponent
    as="div"
    ref={htmlDivRef}
    // @ts-expect-error "anotherValue" is not a valid prop
    anotherValue="one"
  >
    bananas
  </TestComponent>
);

// React element with valid props
() => (
  <TestComponent as={AnotherComponent} value={1} anotherValue="one">
    bananas
  </TestComponent>
);

// React element with missing extended prop
() => (
  // @ts-expect-error component is missing a required prop
  <TestComponent as={AnotherComponent} value={1}>
    bananas
  </TestComponent>
);

// React element with invalid extended prop
() => (
  <TestComponent
    as={AnotherComponent}
    value={1}
    // @ts-expect-error "anotherValue" is not a valid prop
    anotherValue={1}
  >
    bananas
  </TestComponent>
);

// React element with invalid extended prop
() => (
  <TestComponent
    as={AnotherComponent}
    value={1}
    anotherValue="one"
    // @ts-expect-error "extraProp" is not a valid prop
    extraProp={true}
  >
    bananas
  </TestComponent>
);

// Constrained component
() => <ConstrainedComponent as="h2">bananas</ConstrainedComponent>;

// Constrained component invalid intrinsic element
() => (
  <ConstrainedComponent
    // @ts-expect-error because "div" is not an allowed element
    as="div"
  >
    bananas
  </ConstrainedComponent>
);

test('polymorphicComponent', () => {
  // avoid `yarn test` error (Your test suite must contain at least one test.)
});
