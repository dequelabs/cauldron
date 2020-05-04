import React from 'react';

export interface OffscreenProps extends React.HTMLAttributes<HTMLDivElement> {}

const Offscreen = (props: OffscreenProps) => (
  <div className="dqpl-offscreen" {...props} />
);

export default Offscreen;
