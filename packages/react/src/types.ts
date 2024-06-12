import type { ReactElement, ReactPortal } from 'react';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Cauldron {
  export type LabelProps =
    | { 'aria-label': string }
    | { 'aria-labelledby': string };
}

/**
 * This type is meant to ensure that a prop can actually be rendered as content.
 * Explicit equivalent of Exclude<ReactNode, boolean | null | undefined>
 */
export type ContentNode = string | number | ReactPortal | ReactElement;
