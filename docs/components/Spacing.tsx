import React from 'react';

import './Spacing.css';
import CssParamsTable from './CssParamsTable';

const Spacing = () => {
  const renderExample = (name: string, value: string) => {
    return <div className="Spacing__example" style={{ padding: value }}></div>;
  };

  return (
    <div className="Spacing">
      <CssParamsTable param="--space" renderExample={renderExample} />
    </div>
  );
};

export default Spacing;
