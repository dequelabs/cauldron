import React from 'react';
import { NavBar, NavItem, Code } from '@deque/cauldron-react';
import './index.css';

const Demo = () => {
  const componentsList = new Array(6).fill('NavItem');

  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Demo</h2>
      <h3>Basic NavBar</h3>
      <NavBar>
        {componentsList.map(name => {
          return (
            <NavItem key={name}>
              <a href="#">{name}</a>
            </NavItem>
          );
        })}
      </NavBar>
      <h3>Collapsed NavBar</h3>
      <div className="container">
        <NavBar collapsed>
          {componentsList.map(name => {
            return (
              <NavItem key={name}>
                <a href="#">{name}</a>
              </NavItem>
            );
          })}
        </NavBar>
      </div>
      <h2>Code Sample</h2>
      <Code language="javascript">
        {`
import React from 'react';
import { NavBar, NavItem } from '@deque/cauldron-react';

const Demo = () => {
  const componentsList = new Array(6).fill('NavItem');

  return (
    <div className="NavBarDemo">
      <h1>NavBar</h1>
      <h2>Demo</h2>
      <h3>NavBar</h3>
      <NavBar>
        {componentsList.map(name => {
          return (
            <NavItem key={name}>
              <a>{name}</a>
            </NavItem>
          );
        })}
      </NavBar>
    </div>
       `}
      </Code>
    </div>
  );
};

export default Demo;
