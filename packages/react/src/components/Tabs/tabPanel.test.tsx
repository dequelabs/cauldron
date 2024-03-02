import React, { useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TabPanel } from './';

test('should render tab panel with two paragraphs correctly', async () => {
  const TabPanelwithRef = () => {
    const ref = useRef(null);
    return (
      <div ref={ref}>
        <TabPanel>
          <p>a simple paragraph</p>
          <p>a complicated paragraph</p>
        </TabPanel>
      </div>
    );
  };

  render(<TabPanelwithRef />);
  await waitFor(() => {
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });
});

test('should pass classNames through', async () => {
  const TabPanelwithRef = () => {
    const ref = useRef(null);
    return <TabPanel ref={ref} className="find--me" />;
  };

  render(<TabPanelwithRef />);
  await waitFor(() => {
    expect(screen.getByRole('tabpanel')).toHaveClass('find--me');
  });
});

test('should pass id through', async () => {
  const TabPanelwithRef = () => {
    const ref = useRef(null);
    return <TabPanel ref={ref} id="I am a panelId" />;
  };

  render(<TabPanelwithRef />);
  await waitFor(() => {
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'id',
      'I am a panelId'
    );
  });
});
