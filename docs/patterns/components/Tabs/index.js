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
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
        <TabPanel>
          <p>Insert content for tab panel 1 here...</p>
        </TabPanel>
        <TabPanel>
          <p>Insert content for tab panel 2 here...</p>
        </TabPanel>
        <TabPanel>
          <p>Insert content for tab panel 3 here...</p>
        </TabPanel>
      </Tabs>
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
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
      <TabPanel>
        <p>Insert content for tab panle 1 here...</p>
      </TabPanel>
      <TabPanel>
        <p>Insert content for tab panle 2 here...</p>
      </TabPanel>
      <TabPanel>
        <p>Insert content for tab panle 3 here...</p>
      </TabPanel>
    </Tabs>
    </div>
  );
};
        `}
      </Code>
    </div>
  );
};

export default Demo;
