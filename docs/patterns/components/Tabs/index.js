import React, { useState } from 'react';
import { Tabs, Tab, TabPanel, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const [value, setValue] = useState(0);
  const handleChange = newValue => setValue(newValue);

  return (
    <div className="TabsDemo">
      <h1>Tabs</h1>
      <h2>Demo</h2>
      <h3>Baisc Tabs</h3>
      <Tabs value={value} handleChange={handleChange}>
        <Tab index={0} value={value}>
          Tab 1
        </Tab>
        <Tab index={1} value={value}>
          Tab 2
        </Tab>
        <Tab index={2} value={value}>
          Tab 3
        </Tab>
      </Tabs>
      <TabPanel value={value} index={0}>
        <p>Insert content for tab panle 1 here...</p>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <p>Insert content for tab panle 2 here...</p>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <p>Insert content for tab panle 3 here...</p>
      </TabPanel>
      <h2>Code Sample</h2>
      <Code language="javascript">
        {`
import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardContent,
  Code
} from '@deque/cauldron-react';

const Demo = () => {
  const [value, setValue] = useState(0);
  const handleChange = newValue => setValue(newValue);

  return (
    <div>
      <h1>Tabs</h1>
      <h2>Demo</h2>
      <h3>Baisc Tabs</h3>
      <Tabs value={value} handleChange={handleChange}>
      <Tab index={0} value={value}>
        Tab 1
      </Tab>
      <Tab index={1} value={value}>
        Tab 2
      </Tab>
      <Tab index={2} value={value}>
        Tab 3
      </Tab>
      </Tabs>
      <TabPanel value={value} index={0}>
        <p>Insert content for tab panle 1 here...</p>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <p>Insert content for tab panle 2 here...</p>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <p>Insert content for tab panle 3 here...</p>
      </TabPanel>
    </div>
  );
};
        `}
      </Code>
    </div>
  );
};

export default Demo;
