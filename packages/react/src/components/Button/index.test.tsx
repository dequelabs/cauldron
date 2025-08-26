import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../../../src/components/Button';
import Icon from '../../../src/components/Icon';
import axe from '../../axe';
import { BadgeLabel } from '../Badge';

test('should render primary button', () => {
  render(
    <>
      <Button>default primary</Button>
      <Button variant="primary">variant primary</Button>
    </>
  );
  expect(screen.getByRole('button', { name: 'default primary' })).toHaveClass(
    'Button--primary'
  );
  expect(screen.getByRole('button', { name: 'variant primary' })).toHaveClass(
    'Button--primary'
  );
});

test('should render secondary button', () => {
  render(<Button variant="secondary">secondary</Button>);
  const SecondaryButton = screen.getByRole('button', { name: 'secondary' });
  expect(SecondaryButton).toHaveClass('Button--secondary');
});

test('should render tertiary button', () => {
  render(<Button variant="tertiary">tertiary</Button>);
  const TertiaryButton = screen.getByRole('button', { name: 'tertiary' });
  expect(TertiaryButton).toHaveClass('Button--tertiary');
});

test('should render error button', () => {
  render(<Button variant="error">error</Button>);
  const ErrorButton = screen.getByRole('button', { name: 'error' });
  expect(ErrorButton).toHaveClass('Button--error');
});

test('should render danger button', () => {
  render(<Button variant="danger">danger</Button>);
  const ErrorButton = screen.getByRole('button', { name: 'error' });
  expect(ErrorButton).toHaveClass('Button--error');
});

test('should render danger secondary button', () => {
  render(<Button variant="danger-secondary">danger</Button>);
  const ErrorButton = screen.getByRole('button', { name: 'danger' });
  expect(ErrorButton).toHaveClass('Button--danger-secondary');
});

test('should render button as link', () => {
  render(<Button variant="link">link</Button>);
  const LinkButton = screen.getByRole('button', { name: 'link' });
  expect(LinkButton).toHaveClass('Link');
});

test('should render button as tag', () => {
  render(<Button variant="tag">tag</Button>);
  const TagButton = screen.getByRole('button', { name: 'tag' });
  expect(TagButton).toHaveClass('Tag');
});

test('should render button as badge', () => {
  render(<Button variant="badge">badge</Button>);
  const BadgeButton = screen.getByRole('button', { name: 'badge' });
  expect(BadgeButton).toHaveClass('Button--badge');
});

test('should support <BadgeLabel> as a child', () => {
  render(
    <Button>
      <BadgeLabel>Label</BadgeLabel>
      Value
    </Button>
  );
  const button = screen.getByRole('button', { name: 'Label Value' });
  const label = button.firstElementChild;
  expect(label).toHaveTextContent('Label');
});

test('should handle <Icon /> as child', () => {
  render(
    <Button>
      <Icon type="trash" />
      Delete
    </Button>
  );
  const button = screen.getByRole('button', { name: 'Delete' }).firstChild;
  expect(button).toHaveClass('Icon--trash');
});

test('should handle "thin" modifier', () => {
  render(<Button thin>link</Button>);
  const button = screen.getByRole('button', { name: 'link' });
  expect(button).toHaveClass('Button--thin');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <>
      <Button>primary</Button>
      <Button variant="primary">primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="tertiary">tertiary</Button>
      <Button variant="error">error</Button>
      <Button variant="danger">danger</Button>
      <Button variant="danger-secondary">danger secondary</Button>
      <Button variant="link">link</Button>
      <Button>
        <Icon type="bolt" />
        scan
      </Button>
    </>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
