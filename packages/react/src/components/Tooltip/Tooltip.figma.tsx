import React from 'react';
import figma from '@figma/code-connect';
import { Tooltip } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=62-3730&m=dev';

// Tooltip's React `placement` default is `'auto'` (via AnchoredOverlay), not
// `'right'`, so every Figma Direction must map to an explicit value — omitting
// Right would render the snippet without a placement prop and let the floating
// engine pick its own, which won't match the design.
figma.connect(Tooltip, FIGMA_URL, {
  props: {
    placement: figma.enum('Direction', {
      Up: 'top',
      Right: 'right',
      Down: 'bottom',
      Left: 'left'
    })
  },
  // `example` is serialized as the snippet a designer sees, so we render a
  // complete, anchored pattern (button + Tooltip sharing a ref) rather than a
  // dangling `useRef` that wouldn't point at anything.
  example: ({ placement }) => {
    const targetRef = React.createRef<HTMLButtonElement>();
    return (
      <>
        <button ref={targetRef}>Trigger</button>
        <Tooltip target={targetRef} placement={placement}>
          Tooltip text
        </Tooltip>
      </>
    );
  }
});
