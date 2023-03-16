import { ReactNode } from 'react';

export namespace Cauldron {
  export type LabelProps =
    | { 'aria-label': string }
    | { 'aria-labelledby': string };
}

export type ContentNode = Exclude<ReactNode, boolean | null | undefined>;
