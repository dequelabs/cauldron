import React from 'react';
import Demo from '../../../Demo';
import { Loader } from '@deque/cauldron-react/';
import { className } from '../../../props';

const LoaderDemo = () => (
  <Demo
    component={Loader}
    states={[{ label: 'Loading...' }, {}]}
    propDocs={{
      label: {
        type: 'string',
        description:
          'The desired label to be set on the loader as the aria-label. If not provided, aria-hidden="true" will be applied to the element.'
      },
      className
    }}
  />
);

export default LoaderDemo;
