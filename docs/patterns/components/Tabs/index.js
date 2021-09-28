import React from 'react';
import { Tabs, Tab, TabPanel, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => (
  <div className="TabsDemo">
    <h1>Tabs</h1>
    <h2>Demo</h2>
    <h3>Basic Tabs</h3>
    <Tabs aria-label="Basic Tabs">
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

    <h3 id="tabs-variant">Full-width Tabs</h3>
    <Tabs variant="full-width" aria-labelledby="tabs-variant">
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <TabPanel>
        <p>Insert content for tab panel 1 here...</p>
      </TabPanel>
      <TabPanel>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
    </Tabs>
    <h2>Code Sample</h2>
    <Code language="javascript">
      {`
import React from 'react';
import {
  Tabs,
  Tab,
  TabPanel
} from '@deque/cauldron-react';

const Demo = () => (
  <div>
    <h1>Tabs</h1>
    <h2>Demo</h2>
    <h3>Basic Tabs</h3>
    <Tabs aria-label="Basic Tabs">
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
  <h3 id="tabs-variant">Full-width Tabs</h3>
  <Tabs variant="full-width" aria-labelledby="tabs-variant">
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
    <TabPanel>
      <p>Insert content for tab panel 1 here...</p>
    </TabPanel>
    <TabPanel>
      <p>Insert content for tab panel 2 here...</p>
    </TabPanel>
  </Tabs>
  </div>
);
      `}
    </Code>
  </div>
);

export default Demo;
