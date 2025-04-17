import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionHeader from './';
import axe from '../../axe';

test('should support ref prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <SectionHeader
      heading="Section Title"
      ref={ref}
      data-testid="sectionheader"
    />
  );

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.getByTestId('sectionheader'));
});

test('should render heading as h2 when string is passed', () => {
  render(<SectionHeader heading="Section Title" />);
  expect(
    screen.getByRole('heading', { name: 'Section Title', level: 2 })
  ).toBeInTheDocument();
});

test('should render heading as custom tag when ReactNode is passed', () => {
  render(<SectionHeader heading={<h3>Custom Section Title</h3>} />);
  expect(
    screen.getByRole('heading', { name: 'Custom Section Title', level: 3 })
  ).toBeInTheDocument();
});

test('should render description', () => {
  render(
    <SectionHeader heading="Section Title" description="Description Text" />
  );
  expect(screen.getByText('Description Text')).toBeInTheDocument();
});

test('should render children in actions section', () => {
  render(
    <SectionHeader heading="Section Title">
      <button>Action Button</button>
    </SectionHeader>
  );
  expect(
    screen.getByRole('button', { name: 'Action Button' })
  ).toBeInTheDocument();
});

test('should support className prop', () => {
  render(<SectionHeader heading="Section Title" className="custom-class" />);
  expect(
    screen
      .getByRole('heading', { name: 'Section Title' })
      .closest('.SectionHeader')
  ).toHaveClass('custom-class');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <SectionHeader heading="Section Title" description="Description Text">
      <button>Action Button</button>
    </SectionHeader>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
