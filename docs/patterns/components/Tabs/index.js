import React, { useRef } from 'react';
import { Tabs, Tab, TabPanel, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const tabPanel1 = useRef(null);
  const tabPanel2 = useRef(null);
  const tabPanel3 = useRef(null);

  return (
    <div className="TabsDemo">
      <h1>Tabs</h1>
      <h2>Demo</h2>
      <h3>Basic Tabs</h3>
      <Tabs aria-label="Basic Tabs">
        <Tab target={tabPanel1}>Tab 1</Tab>
        <Tab target={tabPanel2}>Tab 2</Tab>
        <Tab target={tabPanel3}>Tab 3</Tab>
      </Tabs>
      <TabPanel ref={tabPanel1}>
        <p>Insert content for tab panel 1 here...</p>
      </TabPanel>
      <TabPanel ref={tabPanel2}>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
      <TabPanel ref={tabPanel3}>
        <p>Insert content for tab panel 3 here...</p>
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
      <TabPanel ref={tabPanel1}>
        <p>Insert content for tab panel 1 here...</p>
      </TabPanel>
      <TabPanel ref={tabPanel2}>
        <p>Insert content for tab panel 2 here...</p>
      </TabPanel>
      <TabPanel ref={tabPanel3}>
        <p>Insert content for tab panel 3 here...</p>
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
