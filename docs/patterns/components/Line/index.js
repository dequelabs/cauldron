import React, { Component } from 'react';
import Demo from '../../../Demo';
import { Line } from '@deque/cauldron-react/';
import { className } from '../../../props';

const LineDemo = () => (
  <Demo
    component={Line}
    states={[{}]}
    propDocs={{
      className
    }}
  />
);

LineDemo.displayName = 'LineDemo';

export default LineDemo;
