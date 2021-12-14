import React from 'react';
import Demo from '../../../Demo';
import { Loader } from '@deque/cauldron-react/';
import { className } from '../../../props';

const LoaderDemo = () => (
  <Demo
    component={Loader}
    states={[
      { 'aria-label': 'Loading...' },
      {
        'aria-labelledby': 'loading-text',
        DEMO_renderAfter: <span id="loading-text">Loading...</span>
      }
    ]}
    propDocs={{
      'aria-label': {
        type: 'string',
        description:
          'The desired label to be set on the loader. If not provided, aria-hidden="true" will be applied to the element.'
      },
      'aria-labelledby': {
        type: 'string',
        description:
          'The desired associated element to use the associated accessible name. If not provided, aria-hidden="true" will be applied to the element.'
      },
      className
    }}
  />
);

export default LoaderDemo;
