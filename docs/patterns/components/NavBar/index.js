import React, { useState } from 'react';
import { NavBar, NavItem, Code, Button } from '@deque/cauldron-react';
import './index.css';
import { className } from '../../../props';
import PropDocs from '../../../Demo/PropDocs';

const Demo = () => {
  const [isMobile, setIsMobile] = useState(false);
  const componentsList = new Array(5).fill('NavItem');
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };
  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Component Description</h2>
      <p>
        A navigation bar that contains links to other sections of the website.
      </p>
      <h2>Demo</h2>
      <NavBar collapsed={isMobile}>
        {componentsList.map((name, index) => {
          return (
            <NavItem key={`${name}-${index}`} active={index === 2}>
              <a href="#">{`${name} ${index + 1}`}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <Button onClick={handleToggle} className="NavBarButton">
        Toggle between mobile and nonmobile mode
      </Button>
      <h2>Code Sample</h2>
      <Code language="javascript" role="region" tabIndex={0}>
        {`
import React, { useState } from 'react';
import { NavBar, NavItem, Code, Button } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const [isMobile, setIsMobile] = useState(false);
  const componentsList = new Array(5).fill('NavItem');
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };
  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Demo</h2>
      <h3>Basic NavBar</h3>
      <NavBar collapsed={isMobile}>
        {componentsList.map((name, index) => {
          return (
            <NavItem key={\`\${name}-\${index}\`} active={index === 2}>
              <a href="#">{\`\${name} \${index + 1}\`}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <Button onClick={handleToggle} className="NavBarButton">
        Toggle between mobile and nonmobile mode
      </Button>
    </div>
       `}
      </Code>
      <div className="Demo-props">
        <PropDocs
          docs={{
            children: {
              type: 'node',
              description: 'The child content',
              required: true
            },
            className,
            collapsed: {
              type: 'boolean',
              description: 'Collapsed styling for mobile',
              default: false
            },
            navTriggerLabel: {
              type: 'string',
              description: 'Label shown in menu trigger with collapsed styling',
              default: 'MAIN MENU'
            },
            propId: {
              type: 'string',
              description:
                'ID passed to aria-controls, so assistive technology knows the trigger controls the menu.',
              default: 'randomly generated with react-id-generator'
            }
          }}
        />
      </div>
    </div>
  );
};

export default Demo;
