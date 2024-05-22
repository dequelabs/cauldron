import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionTrigger, AccordionContent } from './';
import axe from '../../axe';

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderDefaultAccordion = () => {
  return render(
    <Accordion>
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );
};

test('should render without errors', () => {
  renderDefaultAccordion();

  expect(screen.getAllByRole('generic')[1]).toBeInTheDocument(); // Accordion container
});

test('should pass through props', () => {
  render(
    <Accordion role="region">
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  expect(screen.getByRole('region')).toHaveAttribute('role', 'region');
});

test('should render with a trigger and panel element', () => {
  renderDefaultAccordion();

  expect(screen.getByRole('button')).toHaveTextContent('Trigger');
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render the trigger element', () => {
  renderDefaultAccordion();

  expect(screen.getByRole('button').tagName).toBe('BUTTON');
  expect(screen.getByRole('button')).toHaveClass('Accordion__trigger');
  expect(screen.getByRole('button')).toHaveTextContent('Trigger');
});

test('should render the panel element', () => {
  renderDefaultAccordion();

  expect(screen.getByText('Content').tagName).toBe('DIV');
  expect(screen.getByText('Content').parentElement).toHaveClass(
    'ExpandCollapse__panel'
  );
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should set aria-expanded to false when collapsed', () => {
  renderDefaultAccordion();

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});

test('should set aria-expanded to true when expanded', () => {
  renderDefaultAccordion();

  fireEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
});

test('should not render the panel element when closed', () => {
  render(
    <Accordion>
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>
        <div data-testid="content">foo</div>
      </AccordionContent>
    </Accordion>
  );

  setTimeout(() => {
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });
});

test('should set the id of the panel element', () => {
  renderDefaultAccordion();

  expect(screen.getByRole('button')).toHaveAttribute(
    'aria-controls',
    screen.getByText('Content').parentElement?.id
  );
});

test('should set aria-expanded to true when open via the open prop', () => {
  render(
    <Accordion open>
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
});

test('should set the className when passed a value in the className prop', () => {
  render(
    <Accordion>
      <AccordionTrigger className="test">Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  expect(screen.getByRole('button')).toHaveClass('test');
});

test('should set the heading level when passed a value in the heading prop', () => {
  render(
    <Accordion>
      <AccordionTrigger heading={{ level: '2' }}>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
    'Trigger'
  );
});

test('should not set the heading level when not passed a value in the heading prop', () => {
  renderDefaultAccordion();

  expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
});

test('should use a default className if not passed one via the className prop (Accordion)', () => {
  renderDefaultAccordion();

  expect(screen.getAllByRole('generic')[1]).toHaveClass('Accordion');
});

test('should set the className when passed a value in the className prop (Accordion)', () => {
  render(
    <Accordion className="test">
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  expect(screen.getAllByRole('generic')[1]).toHaveClass('test');
});

test('should use a default className if not passed one via the className prop (AccordionContent)', () => {
  renderDefaultAccordion();

  expect(screen.getByText('Content')).toHaveClass('Accordion__panel');
});

test('should set the className when passed a value in the className prop (AccordionContent)', () => {
  render(
    <Accordion>
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent className="test">Content</AccordionContent>
    </Accordion>
  );

  expect(screen.getByText('Content')).toHaveClass('test');
});

test('returns no axe violations with closed accordion', async () => {
  const { container } = renderDefaultAccordion();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe violations with open accordion', async () => {
  const { container } = render(
    <Accordion open>
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe violations with heading prop set', async () => {
  const { container } = render(
    <Accordion>
      <AccordionTrigger heading={{ level: '2' }}>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe violations with role="region"', async () => {
  const { container } = render(
    <Accordion role="region">
      <AccordionTrigger>Trigger</AccordionTrigger>
      <AccordionContent>Content</AccordionContent>
    </Accordion>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
