import React, { useState, useRef, useEffect } from 'react';
import { ProgressBar, Button, Code } from '@deque/cauldron-react';

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
      <p>
        Progress bars are used to indicate the status of some progress activity
        happening, such as number of items completed.
      </p>
      <h2>Demo</h2>
      <ProgressBar label="Progress" progress="75" />
      <h3>Animated</h3>
      <p>
        If the progress indicates that some activity is currently progressing,
        the progress bar will update the status of the progress bar based on the
        current <code>progress</code> prop:
      </p>
      <p>
        <Button onClick={handleAnimate}>Show Animated Progress</Button>
      </p>
      <ProgressBar label="Progress" progress={progress} />
      <h2>Code Sample</h2>
      <Code langauge="javascript">
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
    </div>
  );
};

export default ProgressBarDemo;
