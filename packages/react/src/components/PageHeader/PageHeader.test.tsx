import React from 'react';
import { render, screen } from '@testing-library/react';
import PageHeader from './';
import axe from '../../axe';

test('should support ref prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <PageHeader heading="Page Title" ref={ref} data-testid="pageheader" />
  );

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.getByTestId('pageheader'));
});

test('should render when heading passed as element but not as a string', () => {
  render(<PageHeader heading={<h2>Custom Page Title</h2>} />);
  expect(
    screen.getByRole('heading', { name: 'Custom Page Title', level: 2 })
  ).toBeInTheDocument();
});

test('should render heading', () => {
  render(<PageHeader heading="Page Title" />);
  expect(
    screen.getByRole('heading', { name: 'Page Title', level: 1 })
  ).toBeInTheDocument();
});

test('should render overline', () => {
  render(<PageHeader heading="Page Title" overline="Overline Text" />);
  expect(screen.getByText('Overline Text')).toBeInTheDocument();
});

test('should render description', () => {
  render(<PageHeader heading="Page Title" description="Description Text" />);
  expect(screen.getByText('Description Text')).toBeInTheDocument();
});

test('should render children', () => {
  render(
    <PageHeader heading="Page Title">
      <button>Action</button>
    </PageHeader>
  );
  expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
});

test('should support className prop', () => {
  render(<PageHeader heading="Page Title" className="custom-class" />);
  expect(
    screen.getByRole('heading', { name: 'Page Title' }).closest('.PageHeader')
  ).toHaveClass('custom-class');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <PageHeader
      heading="Page Title"
      overline="Overline Text"
      description="Description Text"
    >
      <button>Action</button>
    </PageHeader>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
