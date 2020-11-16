import React, { useRef, useEffect, useState } from 'react';
import Demo from '../../../Demo';
import {
  LoaderOverlay,
  Loader,
  Button,
  Scrim,
  Code
} from '@deque/cauldron-react/';
import { className, children } from '../../../props';
import './index.css';

const LOADING_DURATION = 5000;

const LoaderOverlayDemo = () => {
  const mounted = useRef(false);
  const loaderRef = useRef();
  const buttonRef = useRef();
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, LOADING_DURATION);
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (loading) {
      return loaderRef.current.focus();
    }

    buttonRef.current.focus();
  }, [loading]);

  return (
    <Demo
      component={LoaderOverlay}
      states={[]}
      propDocs={{
        className,
        children
      }}
    >
      <div className="LoaderOverlayDemo">
        {loading && (
          <>
            <Scrim show />
            <LoaderOverlay tabIndex={-1} ref={loaderRef}>
              <Loader />
              <div>Loading...</div>
            </LoaderOverlay>
          </>
        )}
        <p>
          The <code>LoaderOverlay</code> component is simply a wrapper in which
          you can mount a Loader along with some text. It will render a
          centered, absolutely poisitioned loader box within its relative
          parent.
        </p>
        <h2>It is expected that you choose one of the following:</h2>
        <ul>
          <li>
            Manage focus properly by shifting focus to the loader when loading
            and shift it to something logical once loading is complete
          </li>
          <li>
            Add <code>role=alert</code> to the <code>LoaderOverlay</code>
          </li>
        </ul>
        <p>
          <strong>NOTE:</strong> in this example we also render a{' '}
          <code>Scrim</code>
          component.
        </p>
        <Button onClick={onClick} buttonRef={buttonRef}>
          Show loader for {LOADING_DURATION / 1000} seconds
        </Button>
        <Code>{`<LoaderOverlay tabIndex={-1} ref={loaderRef}>
  <Loader />
  <div>Loading...</div>
</LoaderOverlay>`}</Code>
      </div>
    </Demo>
  );
};

export default LoaderOverlayDemo;
