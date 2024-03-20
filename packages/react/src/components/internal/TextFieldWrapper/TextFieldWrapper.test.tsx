import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';

import TextFieldWrapper, { TextFieldWrapperProps } from './';

test('should render children', () => {
  render(
    <TextFieldWrapper>
      <p>Children</p>
    </TextFieldWrapper>
  );
  expect(screen.getByText('Children')).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <TextFieldWrapper className="banana">
      <input />
    </TextFieldWrapper>
  );
  expect(screen.getByRole('textbox').parentElement).toHaveClass(
    'TextFieldWrapper',
    'banana'
  );
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <TextFieldWrapper className="banana" ref={ref}>
      <input />
    </TextFieldWrapper>
  );
  expect(ref.current).toBeDefined();
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
});

test('should render TextFieldWrapper with other props', () => {
  render(
    <TextFieldWrapper id="banana">
      <input />
    </TextFieldWrapper>
  );
  expect(screen.getByRole('textbox').parentElement).toHaveAttribute(
    'id',
    'banana'
  );
});

test('should have no axe violations with TextFieldWrapper', async () => {
  const { container } = render(
    <TextFieldWrapper className="banana">
      <p>Children</p>
    </TextFieldWrapper>
  );
  expect(await axe(container)).toHaveNoViolations();
});
