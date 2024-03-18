import React, { useRef } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Tabs, { Tab, TabPanel } from './';
import axe from '../../axe';

const ariaLabel = 'I am a label';

test('should render tabs without errors when mounted', async () => {
  render(
    <Tabs aria-label={ariaLabel}>
      <div />
    </Tabs>
  );

  expect(screen.getByRole('tablist').parentElement).toBeInTheDocument();
});

test('should render children with a tab', () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={ref}>option 1</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  expect(screen.getAllByRole('tab')).toHaveLength(1);
});

test('should only render tab components', () => {
  render(
    <Tabs aria-label={ariaLabel}>
      <li>option 1</li>
      <button>option 2</button>
      <div className="no-show-div">option 3</div>
    </Tabs>
  );

  expect(screen.queryByRole('listitem')).toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByRole('generic', { name: /option 3/i })).toBeNull();
});

test('should render with thin prop', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} thin>
          <Tab target={ref}>option 1</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  await waitFor(() => {
    expect(screen.getByRole('tablist').parentElement).toHaveClass('Tabs--thin');
  });
});

test('should pass classNames through', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} className="find--me">
          <Tab target={ref}>option 1</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  await waitFor(() => {
    expect(screen.getByRole('tablist').parentElement).toHaveClass('find--me');
  });
});

test('should render with aria-label prop', () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <>
        <Tabs aria-label="find-me">
          <Tab target={ref}>option 1</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'find-me');
});

test('should render with aria-labelledby prop', () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    return (
      <>
        <Tabs aria-labelledby="find-me">
          <Tab target={ref}>option 1</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  expect(screen.getByRole('tablist')).toHaveAttribute(
    'aria-labelledby',
    'find-me'
  );
});

test('should display correct tab panel when clicking a tab', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={ref}>option 1</Tab>
          <Tab target={ref2}>option 2</Tab>
          <Tab target={ref3}>option 3</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
        <TabPanel ref={ref3}>
          <p>Panel 3</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  fireEvent.click(screen.getAllByRole('tab')[0]);
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).not.toHaveClass(
      'TabPanel--hidden'
    );
    expect(screen.getAllByRole('tabpanel')[1]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[2]).toHaveClass('TabPanel--hidden');
  });

  fireEvent.click(screen.getAllByRole('tab')[1]);
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[1]).not.toHaveClass(
      'TabPanel--hidden'
    );
    expect(screen.getAllByRole('tabpanel')[2]).toHaveClass('TabPanel--hidden');
  });
});

test('should focus the active tab with keyboard activation', async () => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  const TabsComponent = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);

    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab id="tab-uno" target={ref}>
            option 1
          </Tab>
          <Tab id="tab-dos" target={ref2}>
            option 2
          </Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
      </>
    );
  };

  render(<TabsComponent />, { container: mountElement });
  screen.getByText('option 2').focus();
  fireEvent.keyDown(document.activeElement || document.body, {
    key: 'ArrowRight'
  });
  await waitFor(() => {
    expect(screen.getByText('option 2')).toHaveClass('Tab--active');
  });
});

test('should display correct tabpanel when pressing left, right, home, or end keys', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={ref}>option 1</Tab>
          <Tab target={ref2}>option 2</Tab>
          <Tab target={ref3}>option 3</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
        <TabPanel ref={ref3}>
          <p>Panel 3</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[1]).not.toHaveClass(
      'TabPanel--hidden'
    );
    expect(screen.getAllByRole('tabpanel')[2]).toHaveClass('TabPanel--hidden');
  });

  fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' });
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).not.toHaveClass(
      'TabPanel--hidden'
    );
    expect(screen.getAllByRole('tabpanel')[1]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[2]).toHaveClass('TabPanel--hidden');
  });

  fireEvent.keyDown(screen.getByRole('tablist'), { key: 'End' });
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[1]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[2]).not.toHaveClass(
      'TabPanel--hidden'
    );
  });

  fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Home' });
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).not.toHaveClass(
      'TabPanel--hidden'
    );
    expect(screen.getAllByRole('tabpanel')[1]).toHaveClass('TabPanel--hidden');
    expect(screen.getAllByRole('tabpanel')[2]).toHaveClass('TabPanel--hidden');
  });
});

test('should not do anything when pressing keys other than left, right, home, or end', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={ref}>option 1</Tab>
          <Tab target={ref2}>option 2</Tab>
        </Tabs>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
      </>
    );
  };

  render(<TabswithRef />);
  fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowDown' });
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')[0]).not.toHaveClass(
      'TabPanel--hidden'
    );
    expect(screen.getAllByRole('tabpanel')[1]).toHaveClass('TabPanel--hidden');
  });
});

test('should call onChange prop when active tab is changed', async () => {
  const onChange = jest.fn();
  const TabsWithOnChange = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <Tabs aria-label={ariaLabel} onChange={onChange}>
        <Tab target={ref}>tab 1</Tab>
        <Tab target={ref2}>tab 2</Tab>
      </Tabs>
    );
  };

  render(<TabsWithOnChange />);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getAllByRole('tab')[1]);
  await waitFor(() => {
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ activeTabIndex: 1 })
    );
  });
});

test('returns no axe vialation', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <Tabs aria-label={ariaLabel}>
        <Tab target={ref}>option 1</Tab>
        <Tab target={ref2}>option 2</Tab>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
      </Tabs>
    );
  };

  const { container } = render(<TabswithRef />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe vialation with thin variant', async () => {
  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <Tabs aria-label={ariaLabel} thin>
        <Tab target={ref}>option 1</Tab>
        <Tab target={ref2}>option 2</Tab>
        <TabPanel ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
      </Tabs>
    );
  };

  const { container } = render(<TabswithRef />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns no axe vialation with vertical variant', async () => {
  const panelStyles = { minHeight: '10rem' };

  const TabswithRef = () => {
    const ref = useRef(null);
    const ref2 = useRef(null);
    return (
      <Tabs aria-label={ariaLabel} orientation="vertical">
        <Tab target={ref}>option 1</Tab>
        <Tab target={ref2}>option 2</Tab>
        <TabPanel style={panelStyles} ref={ref}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel style={panelStyles} ref={ref2}>
          <p>Panel 2</p>
        </TabPanel>
      </Tabs>
    );
  };

  const { container } = render(<TabswithRef />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
