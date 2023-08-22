import React, { useState, useEffect } from 'react';
import { Icon, iconTypes } from '@deque/cauldron-react';
import './IconGrid.css';

export default function IconGrid() {
  return (
    <div className="IconGrid">
      <ul>
        {iconTypes.map((type: string) => (
          <li className="Panel" key={type}>
            <Icon type={type} />
            <div className="IconGrid__label">{type}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
