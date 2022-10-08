import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar, Button, Code } from '@deque/cauldron-react';
import Demo from '../../../Demo';

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
    <div>
      <Demo
        component={ProgressBar}
        componentDescription={
          'Progress bars are used to indicate the status of some progress activity happening, such as number of items completed.'
        }
        states={[
          { 'arial-label': 'Progress', progress: 75 },
          {
            'aria-label': 'Progress',
            progress: 5,
            progressMin: 1,
            progressMax: 25
          }
        ]}
        propDocs={{
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
      >
        <h2>Animated</h2>
        <p>
          If the progress indicates that some activity is currently progressing,
          the progress bar will update the status of the progress bar based on
          the current <code>progress</code> prop:
        </p>
        <Code language="javascript" role="region" tabIndex={0}>
          {`<ProgressBar aria-label="Progress" progress={progress} />`}
        </Code>
        <p>
          <Button onClick={handleAnimate}>Show Animated Progress</Button>
        </p>
        <ProgressBar aria-label="Progress" progress={progress} />
      </Demo>
    </div>
  );
};

export default ProgressBarDemo;
