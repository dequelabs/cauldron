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
        <ColumnLeft aria-labelledby="sidebar">
          <ColumnHeader id="sidebar">Sidebar label</ColumnHeader>
          <nav aria-label="Sidebar navigation">
            <ul>
              {items.map(item => (
                <li key={item.id}>
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
        <ColumnRight aria-labelledby="item-header">
          <ColumnHeader id="item-header">{selectedItem?.name}</ColumnHeader>
          <div>
            {selectedItem?.contents}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              eu suscipit tellus. Sed ultrices pretium vulputate. Maecenas id
              diam tortor. Integer a felis dignissim, euismod mauris a,
              vestibulum leo. Aenean vel fringilla turpis. In magna massa,
              lacinia quis arcu ut, tincidunt condimentum tortor. Maecenas quis
              vestibulum libero, eget gravida tortor. Suspendisse sed mollis
              lorem. Pellentesque nec sagittis risus. Nunc faucibus suscipit
              libero eget vehicula. Praesent scelerisque vitae risus ut auctor.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque efficitur sollicitudin ornare.
            </p>
          </div>
        </ColumnRight>
      </TwoColumnPanel>

      <h2>With Optional Group Heading</h2>

      <TwoColumnPanel>
        <ColumnLeft aria-labelledby="group-heading">
          <ColumnHeader>Items</ColumnHeader>
          <ColumnList>
            <ColumnGroupHeader id="group-heading">
              <h3>Optional group heading</h3>
            </ColumnGroupHeader>
            <nav aria-label="Sidebar group 1 navigation">
              <ul>
                {groupOne.map(item => (
                  <li key={item.id}>
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
            <ColumnGroupHeader>
              <h3>Another optional group heading</h3>
            </ColumnGroupHeader>
            <nav aria-label="Sidebar group 2 navigation">
              <ul>
                {groupTwo.map(item => (
                  <li key={item.id}>
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
        <ColumnRight aria-labelledby="group-contents-heading">
          <ColumnHeader id="group-contents-heading">
            {selectedGroupItem?.name}
          </ColumnHeader>
          <div>
            {selectedGroupItem?.contents}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              eu suscipit tellus. Sed ultrices pretium vulputate. Maecenas id
              diam tortor. Integer a felis dignissim, euismod mauris a,
              vestibulum leo. Aenean vel fringilla turpis. In magna massa,
              lacinia quis arcu ut, tincidunt condimentum tortor. Maecenas quis
              vestibulum libero, eget gravida tortor. Suspendisse sed mollis
              lorem. Pellentesque nec sagittis risus. Nunc faucibus suscipit
              libero eget vehicula. Praesent scelerisque vitae risus ut auctor.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque efficitur sollicitudin ornare.
            </p>
          </div>
        </ColumnRight>
      </TwoColumnPanel>
    </div>
  );
}

export default TwoColumnPanelDemo;
