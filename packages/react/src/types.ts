import { ReactElement, ReactFragment, ReactPortal } from 'react';

export namespace Cauldron {
  export type LabelProps =
    | { 'aria-label': string }
    | { 'aria-labelledby': string };
}

// Explicit equivalent of Exclude<ReactNode, boolean | null | undefined>
export type ContentNode =
  | string
  | number
  | ReactFragment
  | ReactPortal
  | ReactElement;
