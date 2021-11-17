declare module 'keyname' {
  function keyname(n: number): string;
  export = keyname;
}

declare module 'focusable' {
  function focusable(): string;
  export = focusable;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cauldron {
  export type LabelProps =
    | { 'aria-label': string }
    | { 'aria-labelledby': string };
}
