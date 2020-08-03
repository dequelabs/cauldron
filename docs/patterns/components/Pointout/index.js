import React, { useState, useEffect } from 'react';
import { Pointout, Code } from '@deque/cauldron-react';

const Demo = () => {
  const buttonRef = React.createRef();
  const ftpoRef = React.createRef();

  const [portal, setPortal] = useState(null);
  useEffect(() => {
    setPortal(document.querySelector('.Layout'));
  });

  const [position, setPosition] = useState(0);
  function togglePosition() {
    setPosition(position ? 0 : 50);
    ftpoRef.current.forceUpdate();
  }

  return (
    <div>
      <h1>First Time Point Out</h1>
      <h2>Demo</h2>

      <h3>With Default Arrow</h3>
      <Pointout heading={<h4>First time point out!</h4>} dismissText="Close">
        <p>This is a first time point out with a pointer</p>
      </Pointout>
      <Code language="javascript">
        {`<Pointout heading={<h4>First time point out!</h4>} dismissText="Close">
  <p>This is a first time point out with a pointer</p>
</Pointout>`}
      </Code>

      <h3>With Positioned Arrow</h3>
      <Pointout
        heading={<h4>First time point out!</h4>}
        dismissText="Close"
        arrowPosition="top-right"
      >
        <p>This is a first time point out with a positioned pointer</p>
      </Pointout>
      <Code language="javascript">
        {`<Pointout
  heading={<h4>First time point out!</h4>}
  dismissText="Close"
  arrowPosition="top-right"
>
  <p>This is a first time point out with a positioned pointer</p>
</Pointout>`}
      </Code>

      <h3>Without Arrow</h3>
      <Pointout noArrow={true}>
        <p>This is a first time point out without a pointer</p>
      </Pointout>
      <Code language="javascript">
        {`<Pointout noArrow={true}>
  <h4>First time point out!</h4>
  <p>This is a first time point out without a pointer</p>
</Pointout>`}
      </Code>

      <h3>Targeted First Time Point Outs</h3>
      <p>
        First time point outs can specify a <code>target</code> prop that will
        dynamically position itself pointing to the target element on render.
        Under the hood, we are using{' '}
        <a href="https://reactjs.org/docs/portals.html">Portals</a> to render
        the element to <code>document.body</code> but you can customize the
        portal location by setting the <code>portal</code> prop with your own
        element or ref.
      </p>
      <p>
        Positioning tracks <code>window.resize</code> events so that the First
        Time Point Out should always be positioned correctly no matter the
        context. If your component has a side effect where a target
        {"'"}s position is changed that does not cause a trigger a resize, you
        can call <code>forceUpdate()</code> on the First Time Point out to reset
        the positioning.
      </p>
      <p>
        Please be aware that when using a <code>target</code> prop, the First
        Time Point Out&#39;s children are duplicated in order to address
        accessibility concerns. Any ids that are present in children will be
        sanitized in order to prevent duplicate ids from existing in the DOM.
        These ids will not be available to style, so it&#39;s recommended that
        you use classes or attribute to target styling instead.
      </p>
      <p>
        <strong>NOTE:</strong> Any ids/attributes of children will be applied to
        the offscreen/screen-reader-only ftpo, so things like aria-labelledby
        and aria-describedby etc will still work as expected.
      </p>

      <button
        style={{ marginLeft: `${position}%`, marginBottom: '171px' }}
        ref={buttonRef}
        type="button"
        className="Button--primary"
        onClick={togglePosition}
      >
        Change My Position
      </button>
      <Pointout
        ref={ftpoRef}
        heading={<h4>Targeted FTPO</h4>}
        dismissText="Close"
        target={buttonRef}
        portal={portal}
      >
        <p>This is a first time point out pointing to an element target.</p>
      </Pointout>
      <Code language="javascript">
        {`function TargetedFTPO() {
  const buttonRef = React.createRef();
  return (
    <div>
      <button type="button" ref={buttonRef}>Button</button>
      <Pointout heading={<h4>Targeted FTPO</h4>} dismissText="Close" target={buttonRef}
        <p>This is a first time point out pointing to an element target.</p>
      </Pointout>
    </div>
  );
}`}
      </Code>
    </div>
  );
};

export default Demo;
