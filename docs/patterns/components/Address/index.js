import React, { Component } from 'react';
import Demo from '../../../Demo';
import {
  Code,
  Address,
  AddressLine,
  AddressCityStateZip
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const addressComponentNames = ['Address', 'AddressLine', 'AddressCityStateZip'];

class AddressDemo extends Component {
  render() {
    return (
      <div className="data-list-demo">
        <Demo
          component={Address}
          componentDescription={
            'The Address component indicates contact information for people or organizations. It may include any type of contact information including a physical address.'
          }
          customImport={`import {\n  ${addressComponentNames.join(
            ',\n  '
          )}\n} from '@deque/cauldron-react'`}
          propDocs={{
            children: {
              ...children,
              description:
                'Only required for <Address>. If children is undefined for <AddressLine>, it will not render.'
            },
            className,
            city: {
              type: 'node',
              description:
                '<AddressCityStateZip> Only. The city to be combined with state and zip in a single line.'
            },
            state: {
              type: 'node',
              description:
                '<AddressCityStateZip> Only. The state to be combined with city and zip in a single line.'
            },
            zip: {
              type: 'node',
              description:
                '<AddressCityStateZip> Only. The zip code to be combined with city and state in a single line.'
            }
          }}
          states={[]}
        >
          <h2>Examples</h2>

          <h3>Full address</h3>
          <Address>
            <AddressLine>1234 Sesame Street</AddressLine>
            <AddressCityStateZip city="Metrocity" state="AA" zip="8675309" />
          </Address>
          <Code role="region" tabIndex={0}>
            {`<Address>
  <AddressLine>1234 Sesame Street</AddressLine>
  <AddressCityStateZip city="Metrocity" state="AA" zip="8675309" />
</Address>`}
          </Code>

          <h3>Missing state</h3>
          <Address>
            <AddressLine>1234 Sesame Street</AddressLine>
            <AddressCityStateZip city="Metrocity" zip="8675309" />
          </Address>
          <Code role="region" tabIndex={0}>
            {`<Address>
  <AddressLine>1234 Sesame Street</AddressLine>
  <AddressCityStateZip city="Metrocity" zip="8675309" />
</Address>`}
          </Code>

          <h3>Missing zip code </h3>
          <Address>
            <AddressLine>1234 Sesame Street</AddressLine>
            <AddressCityStateZip city="Metrocity" state="AA" />
          </Address>
          <Code role="region" tabIndex={0}>
            {`<Address>
  <AddressLine>1234 Sesame Street</AddressLine>
  <AddressCityStateZip city="Metrocity" state="AA" />
</Address>`}
          </Code>
        </Demo>
      </div>
    );
  }
}

AddressDemo.displayName = 'AddressDemo';
export default AddressDemo;
