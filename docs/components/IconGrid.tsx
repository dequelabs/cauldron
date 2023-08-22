import React, { useState, useRef } from 'react';
import {
  Icon,
  iconTypes,
  TextField,
  Panel,
  Button
} from '@deque/cauldron-react';
import './IconGrid.css';

export default function IconGrid() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const filteredTypes = searchValue.trim().length
    ? iconTypes.filter((type: string) =>
        type.includes(searchValue.trim().toLowerCase())
      )
    : iconTypes;

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  const handleClick = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

  return (
    <>
      <TextField
        fieldRef={inputRef}
        label="Filter Icons"
        type="search"
        placeholder="search for icons by type..."
        value={searchValue}
        onChange={handleChange}
      />
      <div className="IconGrid">
        {filteredTypes.length ? (
          <ul>
            {filteredTypes.map((type: string) => (
              <li className="Panel" key={type}>
                <Icon type={type} />
                <div className="IconGrid__label">{type}</div>
              </li>
            ))}
          </ul>
        ) : (
          <Panel className="IconGrid__NoResults">
            <p role="status">
              No icon types found matching <strong>"{searchValue}"</strong>.
            </p>
            <Button variant="secondary" onClick={handleClick}>
              Clear Search
            </Button>
          </Panel>
        )}
      </div>
    </>
  );
}
