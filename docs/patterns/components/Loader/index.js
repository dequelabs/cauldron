import React from 'react';
import Demo from '../../../Demo';
import { Loader } from '@deque/cauldron-react';
import { className } from '../../../props';

const LoaderDemo = () => (
  <Demo
    component={Loader}
    componentDescription={
      'An animated image that indicates something is loading. Regular and large options.'
    }
    states={[{ label: 'Loading...' }, { variant: 'large' }]}
    propDocs={{
      label: {
        type: 'string',
        description:
          'The desired label will be rendered offscreen. If not provided, aria-hidden="true" will be applied to the element.'
      },
      variant: {
        type: 'string',
        description: 'Loader variant, can be "small" or "large".'
      },
      className
    }}
  />
);

export default LoaderDemo;
