import React, { useRef, useEffect, useState } from 'react';
import Demo from '../../../Demo';
import {
  LoaderOverlay,
  Loader,
  Button,
  Scrim,
  Code
} from '@deque/cauldron-react';
import { className, children } from '../../../props';

const LOADING_DURATION = 5000;

const LoaderOverlayDemo = () => {
  const buttonRef = useRef();
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, LOADING_DURATION);
  };

  return (
    <Demo
      component={LoaderOverlay}
      componentDescription={
        'A wrapper in which you can mount a Loader component along with some text. It will render a centered, absolutely positioned loader box within its relative parent.'
      }
      states={[]}
      propDocs={{
        className,
        children,
        label: {
          type: 'string',
          description: 'A primary label for the loader.'
        },
        variant: {
          type: 'string',
          description: 'Loader variant, can be "small" or "large".'
        },
        focusOnInitialRender: {
          type: 'boolean',
          description: 'whether or not to focus the loader on initial render'
        },
        loaderRef: {
          type: 'function',
          description: 'optional ref function'
        },
        focusTrap: {
          type: 'boolean',
          description: 'conditionally wrap the overlay in a focus trap',
          defaultValue: 'false'
        }
      }}
    >
      <div className="LoaderOverlayDemo">
        {loading && (
          <>
            <Scrim show />
            <LoaderOverlay
              tabIndex={-1}
              label="Loading..."
              variant="large"
              focusTrap
              focusOnInitialRender
            >
              <p>
                Explanatory secondary text goes here. Let them know what's
                happening, alright?
              </p>
            </LoaderOverlay>
          </>
        )}
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
          <code>Scrim</code> component.
        </p>
        <Button onClick={onClick} buttonRef={buttonRef}>
          Show loader for {LOADING_DURATION / 1000} seconds
        </Button>
        <Code
          role="region"
          tabIndex={0}
        >{`<LoaderOverlay tabIndex={-1} label="Loading..." focusOnInitialRender focusTrap>
  <p>Explanatory secondary text goes here. Let them know what's happening, alright?</p>
</LoaderOverlay>`}</Code>
      </div>
    </Demo>
  );
};

export default LoaderOverlayDemo;
