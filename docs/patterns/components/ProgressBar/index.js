import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar, Button, Code } from '@deque/cauldron-react';
import PropDocs from '../../../Demo/PropDocs';

const ProgressBarDemo = () => {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const updateProgress = useRef();

  const incrementProgress = () => {
    const updatedProgress = progress + 1;
    setProgress(updatedProgress);
    return progress;
  };

  useEffect(() => {
    updateProgress.current = incrementProgress;
  });

  useEffect(() => {
    let intervalId;

    const update = () => {
      return updateProgress.current();
    };

    if (animateProgress) {
      intervalId = setInterval(() => {
        const progress = update();
        if (progress >= 100) {
          clearInterval(intervalId);
          setAnimateProgress(false);
        }
      }, 33);
    }

    return () => clearInterval(intervalId);
  }, [animateProgress]);

  const handleAnimate = () => {
    setProgress(0);
    setAnimateProgress(true);
  };

  return (
    <div className="ProgressBarDemo">
      <h1>Progress Bar</h1>
      <h2>Component Description</h2>
      <p>
        Progress bars are used to indicate the status of some progress activity
        happening, such as number of items completed.
      </p>
      <h2>Demo</h2>
      <h3>Default Progress</h3>
      <ProgressBar aria-label="Progress" progress={75} />
      <Code language="javascript">
        {'<ProgressBar aria-label="Progress" progress={75} />'}
      </Code>
      <h3>Custom Progress</h3>
      <ProgressBar
        aria-label="Progress"
        progressMin={1}
        progressMax={25}
        progress={5}
      />
      <Code language="javascript" role="region" tabIndex={0}>
        {
          '<ProgressBar aria-label="Progress" progress={5} progressMin={1} progressMax={25} />'
        }
      </Code>
      <h3>Animated</h3>
      <p>
        If the progress indicates that some activity is currently progressing,
        the progress bar will update the status of the progress bar based on the
        current <code>progress</code> prop:
      </p>
      <p>
        <Button onClick={handleAnimate}>Show Animated Progress</Button>
      </p>
      <ProgressBar aria-label="Progress" progress={progress} />
      <h2>Code Sample</h2>
      <Code language="javascript" role="region" tabIndex={0}>
        {`import React from 'react';
import { ProgressBar } from '@deque/cauldron-react';

function Component() {
  return (
    <div>
      <ProgressBar label="Current Progress" aria-describedby="progress" progress={75} />
      <span id="progress">3 of 4 items complete</span>
    </div>
  )
}`}
      </Code>
      <h2>Props</h2>
      <div className="Demo-props">
        <PropDocs
          docs={{
            progress: {
              type: 'number',
              required: true,
              description: 'The current progress bar progress'
            },
            progressMin: {
              type: 'number',
              defaultValue: '0',
              description: 'Minimum value of progress'
            },
            progressMax: {
              type: 'number',
              defaultValue: 100,
              description: 'Maximum value of progress'
            }
          }}
          defaultProps={{}}
        />
      </div>
    </div>
  );
};

export default ProgressBarDemo;
