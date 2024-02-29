import React, { createRef, ComponentProps } from 'react';
import { render as testingRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';

import TextFieldWrapper, { TextFieldWrapperProps } from './';

type RenderProps = Partial<TextFieldWrapperProps> & {
  [key: string]: any;
};

const render = ({ className, children, ...otherProps }: RenderProps = {}) =>
  testingRender(
    <TextFieldWrapper className={className} {...otherProps}>
      {children || <p>Children</p>}
    </TextFieldWrapper>
  );

test('should render children', () => {
  render();
  expect(screen.getByText('Children')).toBeInTheDocument();
});

test('should render TextFieldWrapper with default className', () => {
  render();
  expect(screen.getByText('Children').parentElement).toHaveClass(
    'TextFieldWrapper'
  );
});

test('should render TextFieldWrapper with custom className', () => {
  render({ className: 'banana' });
  expect(screen.getByText('Children').parentElement).toHaveClass(
    'TextFieldWrapper',
    'banana'
  );
});

test('should render TextFieldWrapper with onClick', async () => {
  const onClick = spy();
  render({ onClick });
  await userEvent.click(screen.getByText('Children'));
  expect(onClick.calledOnce).toBe(true);
});

test('should render TextFieldWrapper with other props', () => {
  render({ id: 'banana' });
  expect(screen.getByText('Children').parentElement).toHaveAttribute(
    'id',
    'banana'
  );
});

test('should have no axe violations with TextFieldWrapper', async () => {
  const { container } = render();
  expect(await axe(container)).toHaveNoViolations();
});
