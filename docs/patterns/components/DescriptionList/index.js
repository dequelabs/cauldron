import React, { Component } from 'react';
import Demo from '../../../Demo';
import {
  Code,
  Checkbox,
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from '@deque/cauldron-react';
import { children, className } from '../../../props';
import './index.css';

const dataListComponentNames = [
  'DescriptionList',
  'DescriptionListItem',
  'DescriptionTerm',
  'DescriptionDetails'
];

class DescriptionListDemo extends Component {
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
          component={DescriptionList}
          componentDescription={
            'A component that creates a list of terms and their definitions.'
          }
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
              <DescriptionList collapsed={collapsed}>
                <DescriptionListItem>
                  <DescriptionTerm>First name</DescriptionTerm>
                  <DescriptionDetails>Frank</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Last name</DescriptionTerm>
                  <DescriptionDetails>Zappa</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Email</DescriptionTerm>
                  <DescriptionDetails>frank@zappa.io</DescriptionDetails>
                </DescriptionListItem>
              </DescriptionList>
            </li>
            <li>
              <DescriptionList collapsed={collapsed}>
                <DescriptionListItem>
                  <DescriptionTerm>First name</DescriptionTerm>
                  <DescriptionDetails>Duane</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Last name</DescriptionTerm>
                  <DescriptionDetails>Allman</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Email</DescriptionTerm>
                  <DescriptionDetails>duane@almond.biz</DescriptionDetails>
                </DescriptionListItem>
              </DescriptionList>
            </li>
            <li>
              <DescriptionList collapsed={collapsed}>
                <DescriptionListItem>
                  <DescriptionTerm>First name</DescriptionTerm>
                  <DescriptionDetails>Yamandu</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Last name</DescriptionTerm>
                  <DescriptionDetails>Costa</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Email</DescriptionTerm>
                  <DescriptionDetails>
                    yamandu_costa@gmail.br
                  </DescriptionDetails>
                </DescriptionListItem>
              </DescriptionList>
            </li>
            <li>
              <DescriptionList collapsed={collapsed}>
                <DescriptionListItem>
                  <DescriptionTerm>First name</DescriptionTerm>
                  <DescriptionDetails>Jimmy</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Last name</DescriptionTerm>
                  <DescriptionDetails>Herring</DescriptionDetails>
                </DescriptionListItem>
                <DescriptionListItem>
                  <DescriptionTerm>Email</DescriptionTerm>
                  <DescriptionDetails>
                    jamesHerring@hotmail.gov
                  </DescriptionDetails>
                </DescriptionListItem>
              </DescriptionList>
            </li>
          </ul>
          <Code role="region" tabIndex={0}>
            {`<DescriptionList collapsed={${collapsed}}>
  <DescriptionListItem>
    <DescriptionTerm>First name</DescriptionTerm>
    <DescriptionDetails>Frank</DescriptionDetails>
  </DescriptionListItem>
  <DescriptionListItem>
    <DescriptionTerm>Last name</DescriptionTerm>
    <DescriptionDetails>Zappa</DescriptionDetails>
  </DescriptionListItem>
  <DescriptionListItem>
    <DescriptionTerm>Email</DescriptionTerm>
    <DescriptionDetails>frank@zappa.io</DescriptionDetails>
  </DescriptionListItem>
</DescriptionList>`}
          </Code>
          <p>
            <strong>NOTE:</strong> if your UI calls for a set of{' '}
            <code>{`<DescriptionList />`}</code> components, it is important to
            convey list semantics using <code>{`<ul />`}</code> and{' '}
            <code>{`<li />`}</code> elements (like the above example does).
          </p>
        </Demo>
        <p>
          The DescriptionListItem, DescriptionTerm, and DescriptionDetails
          components accept the above "children" and "className" props (
          <strong>NOT</strong> the "collapsed" prop).
        </p>
      </div>
    );
  }
}

DescriptionListDemo.displayName = 'DescriptionListDemo';
export default DescriptionListDemo;
