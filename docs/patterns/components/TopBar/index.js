import React from 'react';
import { Checkbox } from '@deque/cauldron-react/';

const Demo = () => {
  return (
    <>
      <h1>TopBar</h1>
      <Checkbox
        label="Light Mode"
        id="toggle-dark-light-theme"
        onChange={() => {
          const event = new Event('toggleTopBarVariant', {
            bubbles: true
          });
          document.body.dispatchEvent(event);
        }}
      />
    </>
  );
};

export default Demo;
