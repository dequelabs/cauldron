import React from 'react';
import { NavBar, NavItem, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const componentsList = new Array(8).fill('NavItem');

  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Demo</h2>
      <h3>Basic NavBar</h3>
      <NavBar>
        {componentsList.map((name, index) => {
          return (
            <NavItem key={`${name}-${index}`}>
              <a href="#">{`${name} ${index + 1}`}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <h3>Collapsed NavBar</h3>
      <div className="container">
        <NavBar collapsed>
          {componentsList.map((name, index) => {
            return (
              <NavItem key={`${name}-${index}`}>
                <a href="#">{`${name} ${index + 1}`}</a>
              </NavItem>
            );
          })}
        </NavBar>
      </div>
      <h2>Code Sample</h2>
      <Code language="javascript">
        {`
import React from 'react';
import { NavBar, NavItem, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const componentsList = new Array(5).fill('NavItem');

  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Demo</h2>
      <h3>Basic NavBar</h3>
      <NavBar>
        {componentsList.map((name, index) => {
          return (
            <NavItem key={\`\${name}-\${index}\`}>
              <a href="#">{\`\${name} \${index + 1}\`}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <h3>Collapsed NavBar</h3>
      <div className="container">
        <NavBar collapsed>
          {componentsList.map((name, index) => {
            return (
              <NavItem key={\`\${name}-\${index}\`}>
                <a href="#">{\`\${name} \${index + 1}\`}</a>
              </NavItem>
            );
          })}
        </NavBar>
      </div>
    </div>
       `}
      </Code>
    </div>
  );
};

export default Demo;
