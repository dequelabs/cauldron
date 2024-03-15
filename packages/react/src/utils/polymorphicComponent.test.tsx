import React from 'react';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from './polymorphicComponent';

interface BaseComponentProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  value: number;
}

interface DifferentComponentProps {
  anotherValue: string;
}

const TestComponent = React.forwardRef<HTMLDivElement, BaseComponentProps>(
  (props, ref) => {
    return <></>;
  }
) as PolymorphicComponent<BaseComponentProps>;

const AnotherComponent = (props: DifferentComponentProps) => <></>;
const htmlDivRef = React.createRef<HTMLDivElement>();
const htmlAnchorRef = React.createRef<HTMLAnchorElement>();

// Intrinsic element with valid props
() => (
  <TestComponent as="a" ref={htmlAnchorRef} href="/somewhere" value={1}>
    hello
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
    hello
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
    hello
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
    hello
  </TestComponent>
);

// React element with valid props
() => (
  <TestComponent as={AnotherComponent} value={1} anotherValue="one">
    hello
  </TestComponent>
);

// React element with missing extended prop
() => (
  // @ts-expect-error component is missing a required prop
  <TestComponent as={AnotherComponent} value={1}>
    hello
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
    hello
  </TestComponent>
);

// React element with invalid extended prop
() => (
  <TestComponent
    as={AnotherComponent}
    value={1}
    anotherValue="one"
    // @ts-expect-error
    extraProp={true}
  >
    hello
  </TestComponent>
);
