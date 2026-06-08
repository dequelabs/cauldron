import React, { createContext, useContext } from 'react';

interface DrawerContextValue {
  headingId: string;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(): DrawerContextValue {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error(
      'Drawer compound components must be rendered within a Drawer'
    );
  }
  return context;
}

export { DrawerContext, useDrawerContext };
export type { DrawerContextValue };
