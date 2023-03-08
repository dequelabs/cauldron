import React, { useState } from 'react';
import {
  TwoColumnPanel,
  ColumnLeft,
  ColumnRight,
  ColumnHeader,
  ColumnGroupHeader,
  ColumnList,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  Code
} from '@deque/cauldron-react';
import PropDocs from '../../../Demo/PropDocs';
import { children, className } from '../../../props';

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
      contents: 'Content for grouped One'
    },
    {
      id: 2,
      name: 'Two',
      description: 'Short description of two',
      contents: 'Content for grouped Two'
    }
  ];
  const groupTwo = [
    {
      id: 3,
      name: 'Three',
      description: 'Short description of three',
      contents: 'Content for grouped Three'
    },
    {
      id: 4,
      name: 'Four',
      description: 'Short description of four',
      contents: 'Content for grouped Four'
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
      <h2>Component Description</h2>
      <p>
        Two column panel is a container component intended to provide a
        navigable list of items that can be collapsed if not needed.
      </p>
      <h2>Basic</h2>
      <TwoColumnPanel>
        <ColumnLeft aria-labelledby="sidebar">
          <ColumnHeader id="sidebar">Items</ColumnHeader>
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

      <h3>Example</h3>

      <Code role="region" tabIndex="1">{`<TwoColumnPanel>
  <ColumnLeft aria-labelledby="sidebar">
    <ColumnHeader id="sidebar">Items</ColumnHeader>
    <nav aria-label="Sidebar navigation">
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <a
              href={item.url}
              onClick={selectItem(item.id)} aria-current={item.id === selectedItem.id}
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
    </div>
  </ColumnRight>
</TwoColumnPanel>`}</Code>

      <h2>With Optional Group Heading</h2>

      <TwoColumnPanel>
        <ColumnLeft aria-labelledby="group-heading">
          <ColumnHeader>Grouped Items</ColumnHeader>
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
          <ColumnHeader>
            <Breadcrumb aria-label="content breadcrumbs">
              <BreadcrumbLink href="#">Context A</BreadcrumbLink>
              <BreadcrumbLink href="#">Context B</BreadcrumbLink>
              <BreadcrumbItem id="group-contents-heading">
                Grouped {selectedGroupItem?.name}
              </BreadcrumbItem>
            </Breadcrumb>
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

      <h3>Example</h3>

      <Code role="region" tabIndex="1">
        {`<TwoColumnPanel>
  <ColumnLeft aria-labelledby="group-heading">
    <ColumnHeader>Grouped Items</ColumnHeader>
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
                href={item.url}
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
    <ColumnHeader>
      <Breadcrumb aria-label="content breadcrumbs">
        <BreadcrumbLink href="#">Context A</BreadcrumbLink>
        <BreadcrumbLink href="#">Context B</BreadcrumbLink>
        <BreadcrumbItem id="group-contents-heading">Grouped {selectedGroupItem?.name}</BreadcrumbItem>
      </Breadcrumb>
    </ColumnHeader>
    <div>
      {selectedGroupItem?.contents}
    </div>
  </ColumnRight>
</TwoColumnPanel>`}
      </Code>

      <div className="Demo-props">
        <h2>Props</h2>
        <h3>
          <code>TwoColumnPanel</code>
        </h3>
        <PropDocs
          docs={{
            initialCollapsed: {
              type: 'boolean',
              description: 'Initial collapsed state of ColumnLeft',
              default: 'false'
            },
            showCollapsedPanelLabel: {
              type: 'string',
              description: 'Label show panel toggle',
              default: 'Show Panel'
            },
            hideCollapsedPanelLabel: {
              type: 'string',
              description: 'Label hide panel toggle',
              default: 'Hide Panel'
            },
            skipLink: {
              type: 'SkipLink',
              description: 'A "Skip to Content" link'
            },
            collapsedMediaQuery: {
              type: 'string',
              description:
                'The TwoPanelColumn will collapse the ColumnLeft by default when this media query is active and display the ColumnLeft content via a slide-in element',
              default: '(max-width: 45rem)'
            },
            children
          }}
        />

        <h3>
          <code>ColumnLeft</code>
        </h3>
        <PropDocs
          docs={{
            children,
            className
          }}
        />

        <h3>
          <code>ColumnRight</code>
        </h3>
        <PropDocs
          docs={{
            children,
            className
          }}
        />

        <h3>
          <code>ColumnHeader</code>
        </h3>
        <PropDocs
          docs={{
            children,
            className
          }}
        />
      </div>
    </div>
  );
}

export default TwoColumnPanelDemo;
