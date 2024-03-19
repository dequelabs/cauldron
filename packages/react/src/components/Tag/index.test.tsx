import React from 'react';
import { render, screen } from '@testing-library/react';
import Tag, { TagLabel } from '../../../src/components/Tag';
import axe from '../../axe';

test('renders children', () => {
  render(
    <Tag>
      <TagLabel>Label:</TagLabel> value
    </Tag>
  );
  expect(screen.getByText('Label:')).toBeInTheDocument();
});

test('passes classNames through', () => {
  render(
    <Tag className="baz">
      <TagLabel className="jazz">Tag:</TagLabel>
      hi
    </Tag>
  );
  expect(screen.getByText('hi')).toHaveClass('baz');
  expect(screen.getByText('Tag:')).toHaveClass('jazz');
});

test('passes arbitrary props through', () => {
  render(
    <Tag data-foo="true">
      <TagLabel data-bar="yes">hi</TagLabel>
      bye
    </Tag>
  );
  expect(screen.getByText('bye')).toHaveAttribute('data-foo', 'true');
  expect(screen.getByText('hi')).toHaveAttribute('data-bar', 'yes');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Tag>
      <TagLabel>Label:</TagLabel> value
    </Tag>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
