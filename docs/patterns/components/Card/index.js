import React from 'react';
import Demo from '../../../Demo';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@deque/cauldron-react/';
import './index.css';

const dataListComponentNames = [
  'Card',
  'CardHeader',
  'CardContent',
  'CardFooter'
];

const CardDemo = () => (
  <div className="CardDemo">
    <Demo
      customImport={`import {\n  ${dataListComponentNames.join(
        ',\n  '
      )}\n} from '@deque/cauldron-react'`}
      component={Card}
      states={[
        {
          children: (
            <>
              <CardHeader>
                <h3>Card heading</h3>
              </CardHeader>
              <CardContent>
                <p>Card content</p>
              </CardContent>
              <CardFooter>Footer content</CardFooter>
            </>
          )
        },
        {
          children: (
            <>
              <CardHeader>
                <h3>Simple card heading</h3>
              </CardHeader>
              <CardContent>
                <p>Card content</p>
              </CardContent>
            </>
          ),
          variant: 'simple'
        }
      ]}
      propDocs={{
        variant: {
          type: 'string',
          required: false,
          description:
            '"simple" variant is smaller and not intended to be used with Card Footer'
        }
      }}
    />
  </div>
);

export default CardDemo;
