import React from 'react';
import { render, screen } from '@testing-library/react';
import FieldWrap from './';
import axe from '../../axe';

test('renders a FieldWrap component', () => {
  render(<FieldWrap>foo</FieldWrap>);
  expect(screen.getByText('foo')).toBeInTheDocument();
});

test('is polymorphic', () => {
  render(<FieldWrap as="section">foo</FieldWrap>);
  expect(screen.getByText('foo').tagName).toBe('SECTION');
});

test('sets provided className and spreads props through', () => {
  render(
    <FieldWrap className="foo" role="radiogroup">
      foo
    </FieldWrap>
  );
  expect(screen.getByText('foo')).toHaveClass('foo');
  expect(screen.getByText('foo')).toHaveAttribute('role', 'radiogroup');
});

test('should return no axe violations', async () => {
  const { container } = render(<FieldWrap>foo</FieldWrap>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
