import React, { useState, useRef, useEffect } from 'react';
import {
  Icon,
  iconTypes,
  IconType,
  TextField,
  Panel,
  Button
} from '@deque/cauldron-react';
import './IconGrid.css';

export default function IconGrid() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showDelayedAnnouncement, setShowDelayedAnnouncement] = useState(false);
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

  const noMatchesFound = !filteredTypes.length;

  useEffect(() => {
    if (noMatchesFound) {
      // according to the aria spec, status is a live region and only dynamic
      // changes to content should be announced. We're artificially delaying the
      // status content in order to ensure this gets announced for AT users
      setTimeout(() => setShowDelayedAnnouncement(true), 100);
    }
  }, [noMatchesFound]);

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
        {noMatchesFound ? (
          <Panel className="IconGrid__NoResults">
            <p role="status">
              {showDelayedAnnouncement ? (
                <>
                  No icon types found matching <strong>"{searchValue}"</strong>.
                </>
              ) : null}
            </p>
            <Button variant="secondary" onClick={handleClick}>
              Clear Search
            </Button>
          </Panel>
        ) : (
          <ul>
            {filteredTypes.map((type: string) => (
              <li className="Panel" key={type}>
                <Icon type={type as IconType} />
                <div className="IconGrid__label">{type}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
