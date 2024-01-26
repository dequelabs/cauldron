import React from 'react';
import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Timeline from './Timeline';
import TimelineItem from './TimelineItem';
import Icon from '../Icon';

expect.extend(toHaveNoViolations);

test('should render Timeline', async () => {
  render(
    <Timeline>
      <TimelineItem>A</TimelineItem>
      <TimelineItem>B</TimelineItem>
      <TimelineItem>C</TimelineItem>
    </Timeline>
  );

  const timelineList = await screen.getByRole('list');
  expect(timelineList).toBeInTheDocument();
  expect(within(timelineList).queryAllByRole('listitem')).toHaveLength(3);
});

test('should render Timeline props', async () => {
  render(
    <Timeline className="test-class" aria-label="timeline">
      <TimelineItem>A</TimelineItem>
      <TimelineItem>B</TimelineItem>
      <TimelineItem>C</TimelineItem>
    </Timeline>
  );

  const timelineList = await screen.getByRole('list');
  expect(timelineList).toHaveClass('Timeline');
  expect(timelineList).toHaveClass('test-class');
  expect(timelineList).toHaveAttribute('aria-label', 'timeline');
});

test('should render TimelineItem props', async () => {
  render(
    <Timeline>
      <TimelineItem className="test-class" aria-label="timeline-item">
        A
      </TimelineItem>
      <TimelineItem>B</TimelineItem>
      <TimelineItem>C</TimelineItem>
    </Timeline>
  );

  const timelineItems = await screen.queryAllByRole('listitem');
  expect(timelineItems[0]).toHaveClass('TimelineItem');
  expect(timelineItems[0]).toHaveClass('test-class');
  expect(timelineItems[0]).toHaveAttribute('aria-label', 'timeline-item');
});

test('should render custom icons for timeline items', async () => {
  render(
    <Timeline>
      <TimelineItem icon={<Icon data-testid="icon" type="arrow-down" />}>
        A
      </TimelineItem>
      <TimelineItem>B</TimelineItem>
      <TimelineItem>C</TimelineItem>
    </Timeline>
  );

  const timelineItems = await screen.queryAllByRole('listitem');
  const icon = await screen.queryByTestId('icon');
  expect(timelineItems[0]).toContainElement(icon);
  expect(timelineItems[1]).not.toContainElement(icon);
  expect(timelineItems[2]).not.toContainElement(icon);
});

test('should have no axe violations', async () => {
  render(
    <Timeline>
      <TimelineItem>A</TimelineItem>
      <TimelineItem>B</TimelineItem>
      <TimelineItem>C</TimelineItem>
    </Timeline>
  );

  const results = await axe(screen.getByRole('list'));
  expect(results).toHaveNoViolations();
});
