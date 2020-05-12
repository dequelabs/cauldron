import React from 'react';

export interface OffscreenProps extends React.HTMLAttributes<HTMLDivElement> {}

const Offscreen = (props: OffscreenProps) => (
  <div className="Offscreen" {...props} />
);

export default Offscreen;
