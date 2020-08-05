import React from 'react';
import { Button, Code } from '@deque/cauldron-react/';

class TopBarMenuDemo extends React.Component {
  buttonRef = React.createRef();

  handleClick = () => {
    const event = new Event('focusTopBarMenu', { bubbles: true });
    this.buttonRef.current.dispatchEvent(event);
  };

  render() {
    const { buttonRef, handleClick } = this;

    return (
      <div className="topbarmenu-demo">
        <h1>TopBar Menu</h1>
        <p>
          The <em>TopBar Menu</em> is a composite component intended to be
          included as a child of <em>TopBar</em>.
        </p>
        <h2>Demo</h2>
        <Button buttonRef={buttonRef} onClick={handleClick}>
          Focus TopBar Menu
        </Button>
        <h2>Code Sample</h2>
        <Code language="javascript">
          {`import React from 'react';
import { TopBar, TopBarMenu, OptionsMenu } from '@deque/cauldron-react';

const Demo = () => (
  <TopBar>
    <TopBarMenu id="top-bar-menu">
      I'm a menu thingy
      <OptionsMenu>
        <li>Item 1</li>
        <li>Item 2</li>
      </OptionsMenu>
    </TopBarMenu>
  </TopBar>
);`}
        </Code>
      </div>
    );
  }
}

export default TopBarMenuDemo;
