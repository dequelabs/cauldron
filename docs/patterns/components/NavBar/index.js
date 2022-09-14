import React, { useState } from 'react';
import { NavBar, NavItem, Code, Button } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const [isMobil, setIsMobil] = useState(false);
  const componentsList = new Array(5).fill('NavItem');
  const handleToggle = () => {
    setIsMobil(!isMobil);
  };
  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Component Description</h2>
      <p>
        A navigation bar that contains links to other sections of the website.
      </p>
      <h2>Demo</h2>
      <NavBar collapsed={isMobil}>
        {componentsList.map((name, index) => {
          return (
            <NavItem key={`${name}-${index}`} active={index === 2}>
              <a href="#">{`${name} ${index + 1}`}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <Button onClick={handleToggle} className="NavBarButton">
        Toggle between mobil and non-mobile mode
      </Button>
      <h2>Code Sample</h2>
      <Code language="javascript" role="region" tabIndex={0}>
        {`
import React, { useState } from 'react';
import { NavBar, NavItem, Code, Button } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const [isMobil, setIsMobil] = useState(false);
  const componentsList = new Array(5).fill('NavItem');
  const handleToggle = () => {
    setIsMobil(!isMobil);
  };
  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Demo</h2>
      <h3>Basic NavBar</h3>
      <NavBar collapsed={isMobil}>
        {componentsList.map((name, index) => {
          return (
            <NavItem key={\`\${name}-\${index}\`} active={index === 2}>
              <a href="#">{\`\${name} \${index + 1}\`}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <Button onClick={handleToggle} className="NavBarButton">
        Toggle between mobil and non-mobile mode
      </Button>
    </div>
       `}
      </Code>
    </div>
  );
};

export default Demo;
