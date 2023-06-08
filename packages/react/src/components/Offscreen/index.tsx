import React from 'react';

export type OffscreenProps = React.HTMLAttributes<HTMLSpanElement>;

const Offscreen = (props: OffscreenProps) => (
  <span className="Offscreen" {...props} />
);

export default Offscreen;
