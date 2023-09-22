import React from 'react';

import { getCssVariablesStartingWith } from '../utils/getCssVariablesStartingWith';

import './Spacing.css';

const Spacing = () => {
  const spaces = getCssVariablesStartingWith('--space');

  return (
    <div className="Spacing">
      <ol>
        {Object.entries(spaces).map(([name, space]) => (
          <li>
            <span className="Spacing__name">{name}</span> :{' '}
            <span className="Space__value">{space}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Spacing;
