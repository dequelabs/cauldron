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
          'The desired label will be rendered offscreen. If not provided, aria-hidden="true" will be applied to the element.'
      },
      className
    }}
  />
);

export default LoaderDemo;
