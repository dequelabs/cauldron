import React, { createContext, useContext } from 'react';

interface DialogContextValue {
  headingId: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
  headingLevel: number;
  onClose: () => void;
  forceAction: boolean;
  closeButtonText: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      'Dialog compound components must be rendered within a Dialog'
    );
  }
  return context;
}

export { DialogContext, useDialogContext };
export type { DialogContextValue };
