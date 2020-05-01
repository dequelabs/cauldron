import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Code
} from '../../../../packages/react/src/';
import './index.css';

const Demo = () => (
  <div className="Card">
    <h1>Card</h1>
    <h2>Demo</h2>
    <Card>
      <CardHeader>
        <h3>Card heading</h3>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>Footer content</CardFooter>
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
} from 'cauldron-react';

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
    </Code>
  </div>
);

export default Demo;
