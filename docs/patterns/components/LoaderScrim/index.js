import React, { useRef, useEffect } from 'react';
import Demo from '../../../Demo';
import { LoaderScrim, Loader } from '@deque/cauldron-react/';
import { className } from '../../../props';
import './index.css';

console.log(LoaderScrim);

const LoaderScrimDemo = () => {
  const loaderRef = useRef();

  useEffect(() => {
    console.log(loaderRef);
  });

  return (
    <div className="LoaderScrimDemo">
      <Demo
        component={LoaderScrim}
        states={[
          {
            children: (
              <div className="LoaderScrimDemo--wrap">
                <div className="Scrim" />
                <Loader />
                <p>Loading your results...</p>
              </div>
            ),
            ref: loaderRef
          }
        ]}
        propDocs={{
          className
        }}
      />
    </div>
  );
};

export default LoaderScrimDemo;
