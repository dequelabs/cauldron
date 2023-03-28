import React, { useRef } from 'react';
import PropDocs from '../../../Demo/PropDocs';
import { Tabs, Tab, TabPanel, Code, Link } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const tabPanel1 = useRef(null);
  const tabPanel2 = useRef(null);
  const tabPanel3 = useRef(null);

  const verticalTabPanel1 = useRef(null);
  const verticalTabPanel2 = useRef(null);
  const verticalTabPanel3 = useRef(null);

  return (
    <div className="TabsDemo">
      <h1 id="main-title">Tabs</h1>
      <h2>Component Description</h2>
      <p>
        The
        <Link href="https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/">
          ARIA Authoring Practices Guide (APG)
        </Link>
        describes Tabs, a Tabbed Interface, or a Tab List as, "...a set of
        layered sections of content, known as tab panels, that display one panel
        of content at a time. Each tab panel has an associated tab element, that
        when activated, displays the panel. The list of tab elements is arranged
        along one edge of the currently displayed panel, most commonly the top
        edge."
      </p>
      <h2>Demo</h2>
      <h3>Horizontal Tabs</h3>
      <Tabs aria-label="Horizontal Tabs">
        <Tab target={tabPanel1}>Tab 1</Tab>
        <Tab target={tabPanel2}>Tab 2</Tab>
        <Tab target={tabPanel3}>Tab 3</Tab>
      </Tabs>
      <TabPanel ref={tabPanel1}>Panel for Tab 1</TabPanel>
      <TabPanel ref={tabPanel2}>Panel for Tab 2</TabPanel>
      <TabPanel ref={tabPanel3}>Panel for Tab 3</TabPanel>
      <h4>Example</h4>
      <Code language="javascript">
        {`function HorizontalTabs() {
  const tabRef1 = useRef()
  const tabRef2 = useRef()
  const tabRef3 = useRef()

  return (
    <>
      <Tabs aria-label="Horizontal Tabs">
        <Tab target={tabRef1}>Tab 1</Tab>
        <Tab target={tabRef2}>Tab 2</Tab>
        <Tab target={tabRef3}>Tab 3</Tab>
      </Tabs>
      <TabPanel ref={tabRef1}>
        Panel for Tab 1
      </TabPanel>
      <TabPanel ref={tabRef2}>
        Panel for Tab 2
      </TabPanel>
      <TabPanel ref={tabRef3}>
        Panel for Tab 3
      </TabPanel>
    </>
  )
}`}
      </Code>
      <h3>Vertical Tabs</h3>
      <Tabs aria-label="Vertical Tabs" orientation="vertical">
        <Tab target={verticalTabPanel1}>Tab 1</Tab>
        <Tab target={verticalTabPanel2}>Tab 2</Tab>
        <Tab target={verticalTabPanel3}>Tab 3</Tab>
      </Tabs>
      <TabPanel ref={verticalTabPanel1}>Panel for Tab 1</TabPanel>
      <TabPanel ref={verticalTabPanel2}>Panel for Tab 2</TabPanel>
      <TabPanel ref={verticalTabPanel3}>Panel for Tab 3</TabPanel>
      <h4>Example</h4>
      <Code language="javascript">
        {`function VerticalTabs() {
  const tabRef1 = useRef()
  const tabRef2 = useRef()
  const tabRef3 = useRef()

  return (
    <>
      <Tabs aria-label="Vertical Tabs" orientation="vertical">
        <Tab target={tabRef1}>Tab 1</Tab>
        <Tab target={tabRef2}>Tab 2</Tab>
        <Tab target={tabRef3}>Tab 3</Tab>
      </Tabs>
      <TabPanel ref={tabRef1}>
        Panel for Tab 1
      </TabPanel>
      <TabPanel ref={tabRef2}>
        Panel for Tab 2
      </TabPanel>
      <TabPanel ref={tabRef3}>
        Panel for Tab 3
      </TabPanel>
    </>
  )
}`}
      </Code>
      <div className="Demo-props">
        <h2>Props</h2>
        <PropDocs
          docs={{
            initialActiveIndex: {
              type: 'number',
              description: 'The initial active tab',
              default: 0
            },
            thin: {
              type: 'boolean',
              description: 'Thin variant of tabs',
              default: false
            },
            orientation: {
              type: 'string',
              description: 'Vertical or horizontal orientation of tabs',
              default: 'horizontal'
            },
            onChange: {
              type: 'function',
              description:
                'Callback function that gets invoked when the active tab changes'
            }
          }}
          defaultProps={{
            initialActiveIndex: 0,
            orientation: 'horizontal'
          }}
        />
      </div>
    </div>
  );
};

export default Demo;
