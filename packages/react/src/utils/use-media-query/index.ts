import { useState, useEffect } from 'react';

function useMediaQuery(query: string, initialValue = false): boolean {
  const [match, setMatch] = useState(initialValue);

  useEffect(() => {
    const mediaQueryList = window.matchMedia && window.matchMedia(query);

    if (!mediaQueryList) {
      return;
    }

    const listener = (e: { matches: boolean }) => {
      setMatch(e.matches);
    };

    mediaQueryList.addEventListener('change', listener);

    if (mediaQueryList.matches !== match) {
      setMatch(mediaQueryList.matches);
    }

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return match;
}

export default useMediaQuery;
