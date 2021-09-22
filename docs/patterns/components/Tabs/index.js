import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  TabPanel
} from '../../../../packages/react/src/components/Tabs';
import { Card, CardHeader, CardContent, Code } from '@deque/cauldron-react';

const Demo = () => {
  const [value, setValue] = useState(0);
  const handleChange = event => {
    console.log(event);
  };

  return (
    <div>
      <h1>Tabs</h1>
      <h2>Demo</h2>
      <h3>Baisc Tabs</h3>
      <Tabs handleChange={handleChange}>
        <Tab label="Tab 1" index={0} />
        <Tab label="Tab 1" index={1} />
        <Tab label="Tab 1" index={2} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Card>
          <CardHeader>
            <h3>Tab Panel 1</h3>
          </CardHeader>
          <CardContent>
            <p>Tab panle 1 content</p>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card>
          <CardHeader>
            <h3>Tab Panel 2</h3>
          </CardHeader>
          <CardContent>
            <p>Tab panle 2 content</p>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Card>
          <CardHeader>
            <h3>Tab Panel 3</h3>
          </CardHeader>
          <CardContent>
            <p>Tab panle 3 content</p>
          </CardContent>
        </Card>
      </TabPanel>
      <h2>Code Sample</h2>
      <Code language="javascript"></Code>
    </div>
  );
};

export default Demo;
