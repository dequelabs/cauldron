import React from 'react';
import { render, screen } from '@testing-library/react';
import Tabs, { Tab } from './';
import axe from '../../axe';

const ariaLabel = 'I am a label';

test('should render tab with a paragraph correctly', async () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <Tab target={ref} id="I-am-a-tabId">
      <p>a simple paragraph</p>
    </Tab>
  );

  expect(screen.getAllByRole('tab')).toHaveLength(1);
});

test('should pass classNames through', async () => {
  const ref = React.createRef<HTMLDivElement>();
  const ref2 = React.createRef<HTMLDivElement>();

  render(
    <Tabs aria-label={ariaLabel}>
      <Tab target={ref}>option 1</Tab>
      <Tab target={ref2}>option 2</Tab>
    </Tabs>
  );

  expect(screen.getAllByRole('tab')).toHaveLength(2);
  expect(screen.getAllByRole('tab')[0]).toHaveClass('Tab--active');
  expect(screen.getAllByRole('tab')[0]).toBeInTheDocument();
  expect(screen.getAllByRole('tab')[1]).not.toHaveClass('Tab--active');
  expect(screen.getAllByRole('tab')[1]).toBeInTheDocument();
});

test('should pass id through', async () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <Tab target={ref} id="I-am-a-tabId">
      option 1
    </Tab>
  );

  expect(screen.getByRole('tab')).toHaveAttribute('id', 'I-am-a-tabId');
});

test('should pass aria-selected through and render aria-selected properly', async () => {
  const ref = React.createRef<HTMLDivElement>();
  const ref2 = React.createRef<HTMLDivElement>();

  render(
    <>
      <Tabs aria-label={ariaLabel} initialActiveIndex={1}>
        <Tab target={ref}>option 1</Tab>
        <Tab target={ref2}>option 2</Tab>
      </Tabs>
    </>
  );

  expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
    'aria-selected',
    'false'
  );
  expect(screen.getAllByRole('tab')[1]).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

test('should pass ref through', async () => {
  const tabRef1 = React.createRef<HTMLDivElement>();
  const ref = React.createRef<HTMLLIElement>();

  render(
    <Tab target={tabRef1} ref={ref}>
      Test Tab
    </Tab>
  );

  expect(ref.current).toBeTruthy();
  expect(ref.current).toBeInstanceOf(HTMLLIElement);
});

test('returns no axe violations', async () => {
  const ref = React.createRef<HTMLDivElement>();

  const { container } = render(
    <Tabs aria-label={ariaLabel}>
      <Tab target={ref} id="I-am-a-tabId">
        <p>a simple paragraph</p>
      </Tab>
    </Tabs>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
