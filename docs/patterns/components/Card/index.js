import React from 'react';
import Demo from '../../../Demo';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Code
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

    {/* <Card>
      <CardHeader>
        <h3>Card heading</h3>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>Footer content</CardFooter>
    </Card>
    <Card variant="simple">
      <CardHeader>
        <h3 id="sort-option-heading">Sort options</h3>
      </CardHeader>
      <CardContent>
        <RadioGroup
          aria-labelledby="sort-options-heading"
          defaultValue="impact"
          name="sort"
          radios={[
            { id: 'impact', label: 'Impact', value: 'impact' },
            { id: 'frequency', label: 'Frequency', value: 'frequency' },
            { id: 'category', label: 'Category', value: 'category' }
          ]}
        />
      </CardContent>
    </Card>
    <h2>Code Sample</h2>
    <Code language="javascript">
      {`
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@deque/cauldron-react';

const Demo = () => (
  <Card>
    <CardHeader>
      <h3>Card heading</h3>
    </CardHeader>
    <CardContent>
      <p>Card content</p>
    </CardContent>
    <CardFooter>
      Footer content
    </CardFooter>
  </Card>
);
      `}
    </Code> */}
  </div>
);

export default CardDemo;
