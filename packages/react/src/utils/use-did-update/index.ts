import React from 'react';

/**
 * Hook to be used similarly to the React.Component#componentDidMount.
 * Executes the provided `effect` when `dependencies` change but does not
 * execute the effect initially (on mount) - only on update.
 *
 * @param effect {Function} function to be executed when dependencies update
 * @param dependencies {Any} any valid dependency argument to React.useEffect
 */
const useDidUpdate = (effect: () => void, dependencies: unknown[]): void => {
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    effect();
  }, dependencies);
};

export default useDidUpdate;
