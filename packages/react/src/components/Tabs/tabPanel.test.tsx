import React, { useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TabPanel } from './';

test('should render tab panel with two paragraphs correctly', () => {
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
  waitFor(() => {
    expect(screen.getAllByRole('paragraph')).toHaveLength(2);
  });
});

test('should pass classNames through', () => {
  const TabPanelwithRef = () => {
    const ref = useRef(null);
    return <TabPanel ref={ref} className="find--me" />;
  };

  render(<TabPanelwithRef />);
  waitFor(() => {
    expect(screen.getAllByRole('paragraph')).toHaveClass('find--me');
  });
});

test('should pass id through', () => {
  const TabPanelwithRef = () => {
    const ref = useRef(null);
    return <TabPanel ref={ref} id="I am a panelId" />;
  };

  render(<TabPanelwithRef />);
  waitFor(() => {
    expect(screen.queryByTestId('I am a panelId')).toBeInTheDocument();
  });
});
