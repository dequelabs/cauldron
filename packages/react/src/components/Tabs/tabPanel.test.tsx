import React, { useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TabPanel } from './';
import axe from '../../axe';

test('should render tab panel with two paragraphs correctly', () => {
  render(
    <TabPanel>
      <p>a simple paragraph</p>
      <p>a complicated paragraph</p>
    </TabPanel>
  );
  expect(screen.getByRole('tabpanel')).toBeInTheDocument();
});

test('should pass classNames through', () => {
  render(<TabPanel className="find--me" />);
  expect(screen.getByRole('tabpanel')).toHaveClass('TabPanel', 'find--me');
});

test('should pass id through', () => {
  render(<TabPanel id="I am a panelId" />);
  expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'I am a panelId');
});

test('should support ref', () => {
  const ref = React.createRef();
  const TabPanelwithRef = () => {
    const ref = useRef(null);
    return <TabPanel ref={ref}>Content</TabPanel>;
  };

  render(<TabPanelwithRef />);
  waitFor(() => {
    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('Content');
  });
});

test('returns no axe violations', async () => {
  render(
    <TabPanel>
      <p>a simple paragraph</p>
      <p>a complicated paragraph</p>
    </TabPanel>
  );

  const results = await axe(screen.getByRole('tabpanel'));
  expect(results).toHaveNoViolations();
});
