import React from 'react';

export interface OffscreenProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Offscreen = (props: OffscreenProps) => (
  <span className="Offscreen" {...props} />
);

export default Offscreen;
