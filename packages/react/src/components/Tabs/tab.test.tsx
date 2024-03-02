import React, { useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Tabs, { Tab } from './';

const ariaLabel = 'I am a label';

test('should render tab with a paragraph correctly', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <Tab target={ref} id={'I am a tabId'}>
        <p>a simple paragraph</p>
      </Tab>
    );
  };

  render(<TabswithRef />);
  await waitFor(() => {
    expect(screen.getAllByRole('tab')).toHaveLength(1);
  });
});

test('should pass classNames through', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <Tabs aria-label={ariaLabel}>
        <Tab target={ref}>option 1</Tab>
        <Tab target={ref2}>option 2</Tab>
      </Tabs>
    );
  };

  render(<TabswithRef />);
  await waitFor(() => {
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getAllByRole('tab')[0]).toHaveClass('Tab--active');
    expect(screen.getAllByRole('tab')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('tab')[1]).not.toHaveClass('Tab--active');
    expect(screen.getAllByRole('tab')[1]).toBeInTheDocument();
  });
});

test('should pass id through', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <Tab target={ref} id={'I am a tabId'}>
        option 1
      </Tab>
    );
  };

  render(<TabswithRef />);
  await waitFor(() => {
    expect(screen.getByRole('tab')).toHaveAttribute('id', 'I am a tabId');
  });
});

test('should pass aria-selected through and render aria-selected properly', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} initialActiveIndex={1}>
          <Tab target={ref}>option 1</Tab>
          <Tab target={ref2}>option 2</Tab>
        </Tabs>
      </>
    );
  };

  render(<TabswithRef />);
  await waitFor(() => {
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
});
