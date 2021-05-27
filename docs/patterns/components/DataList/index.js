import React, { Component } from 'react';
import Demo from '../../../Demo';
import {
  Code,
  Checkbox,
  DataList,
  DataListItem,
  DataKey,
  DataValue
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';
import './index.css';

const dataListComponentNames = [
  'DataList',
  'DataListItem',
  'DataKey',
  'DataValue'
];

class DataListDemo extends Component {
  state = {
    collapsed: false
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { collapsed } = this.state;

    return (
      <div className="data-list-demo">
        <Demo
          component={DataList}
          customImport={`import {\n  ${dataListComponentNames.join(
            ',\n  '
          )}\n} from '@deque/cauldron-react'`}
          propDocs={{
            children: {
              ...children,
              required: true
            },
            className,
            collapsed: {
              type: 'boolean',
              required: false,
              default: false,
              description:
                'Collapse list into UI catered to narrow viewport widths.'
            }
          }}
          states={[]}
        >
          <h2>Examples</h2>
          <p id="collapse-help">
            The data list component accepts a "collapsed" prop (boolean) which
            is meant to be used on very narrow widths/viewports.
          </p>
          <Checkbox
            onChange={this.toggleCollapsed}
            label="Collapse data list"
            checked={collapsed}
            id="collapse-box"
            aria-describedby="collapse-help"
          />
          <ul className="semantic-only">
            <li>
              <DataList collapsed={collapsed}>
                <DataListItem>
                  <DataKey>First name</DataKey>
                  <DataValue>Frank</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Last name</DataKey>
                  <DataValue>Zappa</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Email</DataKey>
                  <DataValue>frank@zappa.io</DataValue>
                </DataListItem>
              </DataList>
            </li>
            <li>
              <DataList collapsed={collapsed}>
                <DataListItem>
                  <DataKey>First name</DataKey>
                  <DataValue>Duane</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Last name</DataKey>
                  <DataValue>Allman</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Email</DataKey>
                  <DataValue>duane@almond.biz</DataValue>
                </DataListItem>
              </DataList>
            </li>
            <li>
              <DataList collapsed={collapsed}>
                <DataListItem>
                  <DataKey>First name</DataKey>
                  <DataValue>Yamandu</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Last name</DataKey>
                  <DataValue>Costa</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Email</DataKey>
                  <DataValue>yamandu_costa@gmail.br</DataValue>
                </DataListItem>
              </DataList>
            </li>
            <li>
              <DataList collapsed={collapsed}>
                <DataListItem>
                  <DataKey>First name</DataKey>
                  <DataValue>Jimmy</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Last name</DataKey>
                  <DataValue>Herring</DataValue>
                </DataListItem>
                <DataListItem>
                  <DataKey>Email</DataKey>
                  <DataValue>jamesHerring@hotmail.gov</DataValue>
                </DataListItem>
              </DataList>
            </li>
          </ul>
          <Code>
            {`<DataList collapsed={this.state.collapsed}>
  <DataListItem>
    <DataKey>First name</DataKey>
    <DataValue>Frank</DataValue>
  </DataListItem>
  <DataListItem>
    <DataKey>Last name</DataKey>
    <DataValue>Zappa</DataValue>
  </DataListItem>
  <DataListItem>
    <DataKey>Email</DataKey>
    <DataValue>frank@zappa.io</DataValue>
  </DataListItem>
</DataList>`}
          </Code>
          <p>
            <strong>NOTE:</strong> if your UI calls for a set of{' '}
            <code>{`<DataList />`}</code> components, it is important to convey
            list semantics using <code>{`<ul />`}</code> and{' '}
            <code>{`<li />`}</code> elements (like the above example does).
          </p>
        </Demo>
        <p>
          The DataListItem, DataKey, and DataValue components accept the above
          "children" and "className" props (<strong>NOT</strong> the "collapsed"
          prop).
        </p>
      </div>
    );
  }
}

DataListDemo.displayName = 'DataListDemo';
export default DataListDemo;
