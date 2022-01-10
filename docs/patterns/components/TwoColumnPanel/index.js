import React, { useRef, useState } from 'react';
import {
  TwoColumnPanel,
  ColumnLeft,
  ColumnRight,
  ColumnHeader,
  ColumnGroupHeader,
  ColumnList
} from '@deque/cauldron-react/';

function TwoColumnPanelDemo() {
  const [selected, setSelected] = useState(1);
  const [selectedGroup, setSelectedGroupItem] = useState(1);

  const items = [
    {
      id: 1,
      name: 'One',
      description: 'Short description of one',
      contents: 'Content for One'
    },
    {
      id: 2,
      name: 'Two',
      description: 'Short description of two',
      contents: 'Content for Two'
    },
    {
      id: 3,
      name: 'Three',
      description: 'Short description of three',
      contents: 'Content for Three'
    }
  ];

  const groupOne = [
    {
      id: 1,
      name: 'One',
      description: 'Short description of one',
      contents: 'Content for One'
    },
    {
      id: 2,
      name: 'Two',
      description: 'Short description of two',
      contents: 'Content for Two'
    }
  ];
  const groupTwo = [
    {
      id: 3,
      name: 'Three',
      description: 'Short description of three',
      contents: 'Content for Three'
    },
    {
      id: 4,
      name: 'Four',
      description: 'Short description of four',
      contents: 'Content for Four'
    }
  ];

  const selectedItem = items.find(item => item.id === selected);
  const selectedGroupItem = [...groupOne, ...groupTwo].find(
    item => item.id === selectedGroup
  );
  const selectItem = id => event => {
    event.preventDefault();
    setSelected(id);
  };
  const selectGroupItem = id => event => {
    event.preventDefault();
    setSelectedGroupItem(id);
  };

  return (
    <div className="twocolumnpanel-demo">
      <h1>Two Column Panel</h1>

      <TwoColumnPanel>
        <ColumnLeft>
          <ColumnHeader>Sidebar label</ColumnHeader>
          <nav>
            <ul>
              {items.map(item => (
                <li>
                  <a
                    href="#"
                    onClick={selectItem(item.id)}
                    aria-current={item.id === selectedItem.id}
                  >
                    {item.name}
                    <em>{item.description}</em>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </ColumnLeft>
        <ColumnRight>
          <ColumnHeader>Header Label</ColumnHeader>
          <div>{selectedItem?.contents}</div>
        </ColumnRight>
      </TwoColumnPanel>

      <h2>With Optional Group Header</h2>

      <TwoColumnPanel>
        <ColumnLeft>
          <ColumnHeader>Sidebar label</ColumnHeader>
          <ColumnList>
            <ColumnGroupHeader>Optional group heading</ColumnGroupHeader>
            <nav>
              <ul>
                {groupOne.map(item => (
                  <li>
                    <a
                      href="#"
                      onClick={selectGroupItem(item.id)}
                      aria-current={item.id === selectedGroupItem.id}
                    >
                      {item.name}
                      <em>{item.description}</em>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ColumnGroupHeader>Optional group heading</ColumnGroupHeader>
            <nav>
              <ul>
                {groupTwo.map(item => (
                  <li>
                    <a
                      href="#"
                      onClick={selectGroupItem(item.id)}
                      aria-current={item.id === selectedGroupItem.id}
                    >
                      {item.name}
                      <em>{item.description}</em>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </ColumnList>
        </ColumnLeft>
        <ColumnRight>
          <ColumnHeader>Header Label</ColumnHeader>
          <div>{selectedGroupItem?.contents}</div>
        </ColumnRight>
      </TwoColumnPanel>
    </div>
  );
}

export default TwoColumnPanelDemo;
