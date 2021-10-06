import React, { useRef } from 'react';
import { Tabs, Tab, TabPanel, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const tabPanel1 = useRef(null);
  const tabPanel2 = useRef(null);
  const tabPanel3 = useRef(null);
  const tabPanel4 = useRef(null);
  const tabPanel5 = useRef(null);

  return (
    <div className="TabsDemo">
      <h1>Tabs</h1>
      <h2>Demo</h2>
      <h3>Basic Tabs</h3>
      <Tabs aria-label="Basic Tabs">
        <Tab targetref={tabPanel1}>Tab 1</Tab>
        <Tab targetref={tabPanel2}>Tab 2</Tab>
        <Tab targetref={tabPanel3}>Tab 3</Tab>
      </Tabs>
      <TabPanel panelref={tabPanel1}>
        <p>Insert content for tab panel 1 here...</p>
      </TabPanel>
      <TabPanel panelref={tabPanel2}>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
      <TabPanel panelref={tabPanel3}>
        <p>Insert content for tab panel 3 here...</p>
      </TabPanel>

      <h3 id="tabs-variant">Full-width Tabs</h3>
      <Tabs variant="full-width" aria-labelledby="tabs-variant">
        <Tab targetref={tabPanel5}>Tab 1</Tab>
        <Tab targetref={tabPanel4}>Tab 2</Tab>
      </Tabs>
      <TabPanel panelref={tabPanel4}>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
      <TabPanel panelref={tabPanel5}>
        <p>Insert content for tab panel 1 here...</p>
      </TabPanel>
      <h2>Code Sample</h2>
      <Code language="javascript">
        {`
import React, { useRef } from 'react';
import { Tabs, Tab, TabPanel, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const tabPanel1 = useRef(null);
  const tabPanel2 = useRef(null);
  const tabPanel3 = useRef(null);
  const tabPanel4 = useRef(null);
  const tabPanel5 = useRef(null);

  return (
    <div className="TabsDemo">
      <h1>Tabs</h1>
      <h2>Demo</h2>
      <h3>Basic Tabs</h3>
      <Tabs aria-label="Basic Tabs">
        <Tab targetref={tabPanel1}>Tab 1</Tab>
        <Tab targetref={tabPanel2}>Tab 2</Tab>
        <Tab targetref={tabPanel3}>Tab 3</Tab>
      </Tabs>
      <TabPanel panelref={tabPanel1}>
        <p>Insert content for tab panel 1 here...</p>
      </TabPanel>
      <TabPanel panelref={tabPanel2}>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
      <TabPanel panelref={tabPanel3}>
        <p>Insert content for tab panel 3 here...</p>
      </TabPanel>

      <h3 id="tabs-variant">Full-width Tabs</h3>
      <Tabs variant="full-width" aria-labelledby="tabs-variant">
        <Tab targetref={tabPanel5}>Tab 1</Tab>
        <Tab targetref={tabPanel4}>Tab 2</Tab>
      </Tabs>
      <TabPanel panelref={tabPanel4}>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
      <TabPanel panelref={tabPanel5}>
        <p>Insert content for tab panel 1 here...</p>
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
