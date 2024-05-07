import React from 'react';
import { render, screen } from '@testing-library/react';
import Panel, { PanelHeader, PanelContent } from './';
import axe from '../../axe';

test('should render the default heading level', () => {
  render(<Panel heading="Title">Content</Panel>);

  expect(
    screen.queryByRole('heading', { name: 'Title', level: 2 })
  ).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render a custom heading level', () => {
  render(<Panel heading={{ text: 'Title', level: 3 }}>Content</Panel>);

  expect(
    screen.queryByRole('heading', { name: 'Title', level: 3 })
  ).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render the heading as an accessible region', () => {
  render(<Panel heading="Title">Content</Panel>);

  expect(screen.queryByRole('region')).toHaveAccessibleName('Title');
});

test('should render with custom id', () => {
  render(
    <Panel heading={{ id: 'heading123', text: 'Title', level: 2 }}>
      Content
    </Panel>
  );

  expect(
    screen.queryByRole('heading', { name: 'Title', level: 2 })
  ).toHaveAttribute('id', 'heading123');
});

test('should render with custom attribute', () => {
  render(
    <Panel heading="Title" aria-label="Custom Label">
      Content
    </Panel>
  );

  expect(screen.getByRole('region')).toHaveAttribute(
    'aria-label',
    'Custom Label'
  );
});

test('should add the collapsed class when collapsed prop is true', () => {
  render(
    <Panel heading="Title" collapsed>
      Content
    </Panel>
  );

  expect(screen.getByRole('region')).toHaveClass('Panel--collapsed');
});

test('should forward a ref to Panel component', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <Panel ref={ref} heading="Title">
      Content
    </Panel>
  );

  expect(ref.current).toBeInTheDocument();
});

test('should forward a ref to PanelHeader component', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <Panel>
      <PanelHeader ref={ref}>Panel Header</PanelHeader>
      <PanelContent>Content</PanelContent>
    </Panel>
  );

  expect(ref.current).toBeInTheDocument();
});

test('should forward a ref to PanelContent component', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <Panel>
      <PanelHeader>Panel Header</PanelHeader>
      <PanelContent ref={ref}>Content</PanelContent>
    </Panel>
  );

  expect(ref.current).toBeInTheDocument();
});

test('should accept a boolean padding prop in Panel component', () => {
  render(
    <Panel heading="Title" padding={false}>
      Content
    </Panel>
  );

  expect(screen.getByRole('region')).toHaveClass('Panel--no-padding');
});

test('should accept a boolean padding prop in PanelContent component', () => {
  render(
    <Panel heading="Title">
      <PanelHeader>Header</PanelHeader>
      <PanelContent padding={false}>Content</PanelContent>
    </Panel>
  );

  expect(screen.getByText('Content')).toHaveClass('Panel__Content--no-padding');
});

test('should render with no heading', () => {
  render(<Panel>Content</Panel>);

  expect(screen.queryByRole('heading', { name: 'Title' })).toBeNull();
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render with composed heading', () => {
  render(
    <Panel>
      <PanelHeader>
        <h1>Panel Heading</h1>
      </PanelHeader>
      Content
    </Panel>
  );

  expect(
    screen.getByRole('heading', { name: 'Panel Heading' })
  ).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render with composed content', () => {
  render(
    <Panel>
      <PanelContent>Content</PanelContent>
    </Panel>
  );

  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render with composed content and heading', () => {
  render(
    <Panel>
      <PanelHeader>
        <h1>Panel Heading</h1>
      </PanelHeader>
      <PanelContent>Content</PanelContent>
    </Panel>
  );

  expect(
    screen.getByRole('heading', { name: 'Panel Heading' })
  ).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render with composed content and heading with custom attributes', () => {
  render(
    <Panel>
      <PanelHeader>
        <h1>Panel Heading</h1>
      </PanelHeader>
      <PanelContent aria-label="Custom Label">Content</PanelContent>
    </Panel>
  );

  expect(
    screen.getByRole('heading', { name: 'Panel Heading' })
  ).toBeInTheDocument();
  expect(screen.getByText('Content')).toHaveAccessibleName('Custom Label');
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('should render with multiple PanelContent components', () => {
  render(
    <Panel>
      <PanelHeader>
        <h1>Panel Heading</h1>
      </PanelHeader>
      <PanelContent>Content #1</PanelContent>
      <PanelContent>Content #2</PanelContent>
    </Panel>
  );

  const heading = screen.getByRole('heading', { name: 'Panel Heading' });
  const panelContent1 = screen.getByText('Content #1');
  const panelContent2 = screen.getByText('Content #2');

  expect(heading).toBeInTheDocument();
  expect(panelContent1).toBeInTheDocument();
  expect(panelContent2).toBeInTheDocument();
  expect(document.querySelectorAll('.Panel__Content').length).toBe(2);
});

test('returns no axe violations with Panel with no heading', async () => {
  const { container } = render(
    <main>
      <Panel>Content</Panel>
    </main>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe violations with Panel and heading prop', async () => {
  const { container } = render(
    <main>
      <Panel heading={{ level: 2, text: 'Title' }}>Content</Panel>
    </main>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe violations with Panel and composed heading', async () => {
  const { container } = render(
    <main>
      <Panel>
        <PanelHeader>
          <h1>Panel Heading</h1>
        </PanelHeader>
        Content
      </Panel>
    </main>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
