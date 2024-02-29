import React from 'react';
import { render, screen } from '@testing-library/react';
import Stepper, { Step } from './';
import axe from '../../axe';

test('should render ol element', () => {
  render(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );
  expect(screen.getByRole('list')).toBeInTheDocument();
});

test('should have two li elements', () => {
  render(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
});

test('should have specified class and data attribute on ol element', () => {
  render(
    <Stepper className="Foo" data-foo="7">
      <Step status="complete">Foo</Step>
    </Stepper>
  );
  expect(screen.getByRole('list')).toHaveClass('Foo');
  expect(screen.getByRole('list')).toHaveClass('Stepper');
  expect(screen.getByRole('list')).toHaveAttribute('data-foo', '7');
});

test('should render li element with span and text', () => {
  render(
    <Step status="current">
      <span>Foo</span>
    </Step>
  );
  expect(screen.getByRole('listitem')).toBeInTheDocument();
  expect(screen.getByText('Foo')).toBeInTheDocument();
  expect(screen.getByRole('listitem')).toContainElement(
    screen.getByText('Foo')
  );
  expect(screen.getByText('Foo')).toHaveTextContent('Foo');
});

test('should render with tooltip tabstops and set the aria-current attribute', () => {
  render(
    <Step
      data-testid="step"
      status="current"
      tooltip="bananas"
      tooltipText="bananas"
    />
  );
  expect(screen.getByTestId('step')).toBeInTheDocument();
  expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'step');
});

test('should set the correct aria-current attribute', () => {
  render(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );
  expect(screen.getAllByRole('listitem')[0]).toHaveAttribute(
    'aria-current',
    'false'
  );
  expect(screen.getAllByRole('listitem')[1]).toHaveAttribute(
    'aria-current',
    'step'
  );
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );

  const { container: tooltipContainer } = render(
    <Stepper>
      <Step status="complete" tooltip="bananas" tooltipText="bananas" />
      <Step status="current" tooltip="mangos" tooltipText="mangos" />
    </Stepper>
  );

  expect(await axe(container)).toHaveNoViolations();
  expect(await axe(tooltipContainer)).toHaveNoViolations();
  expect(
    await axe(
      // manually adding tooltips rendered in a portal
      `${tooltipContainer.innerHTML}<div id="tooltip2">a</div><div id="tooltip3">b</div>`
    )
  ).toHaveNoViolations();
});
