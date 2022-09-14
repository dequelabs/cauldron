import React from 'react';
import Demo from '../../../Demo';
import {
  RadioCardGroup,
  Code,
  FieldWrap
} from '../../../../packages/react/lib';
import FieldWrapNotice from '../../../FieldWrapNotice';

const labelDescription =
  'A label for the radio card group is required. This means you must provide either an aria-label or aria-labelledby prop.';

const DemoRadioCardGroup = () => {
  return (
    <FieldWrap>
      <FieldWrapNotice />
      <Demo
        component={RadioCardGroup}
        whenToUse={'A radio group with options styled like cards.'}
        states={[]}
        propDocs={{
          radios: {
            type: 'array',
            required: true,
            description:
              'Array of objects containing: label, cardImg, cardIcon (see IconTypes), value (optional), and any supported HTMLInputElement properties'
          },
          'aria-label': {
            type: 'string',
            description: labelDescription
          },
          'aria-labelledby': {
            type: 'string',
            description: labelDescription
          },
          name: {
            type: 'string',
            required: false
          },
          className: {
            type: 'string',
            required: false
          },
          defaultValue: {
            type: 'any (The DOM API casts this to a string)',
            required: false,
            description:
              'the default value of the radio group (applied when <RadioGroup /> is mounted)'
          },
          value: {
            type: 'any (The DOM API casts this to a string)',
            required: false,
            description:
              'Use when "controlled" radios are desired. Caller is responsible for managing the selected/checked state of the radio group'
          },
          onChange: {
            type: 'function',
            required: false,
            description:
              'This is required if using "controlled" input; otherwise it is optional',
            defaultValue: '() => {}'
          }
        }}
      >
        <div>
          <h3 id="coffee-label">Do you like coffee?</h3>
          <RadioCardGroup
            name="coffee"
            defaultValue="yes"
            aria-labelledby="coffee-label"
            radios={[
              {
                id: 'yes',
                value: 'yes',
                label: 'Yes',
                cardImg: (
                  <div
                    style={{
                      backgroundColor: 'green',
                      height: 100,
                      width: 100,
                      borderRadius: 50
                    }}
                  ></div>
                ),
                cardIcon: 'check-circle'
              },
              {
                id: 'no',
                value: 'no',
                label: 'No',
                disabled: true,
                cardImg: (
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="40" fill="red" />
                  </svg>
                ),
                cardIcon: 'check-circle'
              },
              {
                id: 'still-yes',
                value: 'still yes',
                label: 'still yes',
                cardImg: (
                  <div
                    style={{
                      backgroundColor: 'green',
                      height: 100,
                      width: 100,
                      borderRadius: 50
                    }}
                  ></div>
                ),
                cardIcon: 'check-circle'
              }
            ]}
          />
        </div>
        <h2>Code Samples</h2>
        <Code language="javascript" role="region" tabIndex={0}>
          {`import React from 'react';
import { RadioCardGroup, FieldWrap } from '@deque/cauldron-react';

const Demo = () => {
return (
  <FieldWrap>
  <h3 id="coffee-label">Do you like coffee?</h3>
  <RadioCardGroup
    name="coffee"
    defaultValue="yes"
    aria-labelledby="coffee-label"
    radios={[
      {
        id: 'yes',
        value: 'yes',
        label: 'Yes',
        cardImg: (
          <div
            style={{
              backgroundColor: 'green',
              height: 100,
              width: 100,
              borderRadius: 50
            }}
          ></div>
        ),
        cardIcon: 'check-circle'
      },
      {
        id: 'no',
        value: 'no',
        label: 'No',
        disabled: true,
        cardImg: (
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="red" />
          </svg>
        ),
        cardIcon: 'check-circle'
      },
      {
        id: 'still-yes',
        value: 'still yes',
        label: 'still yes',
        cardImg: (
          <div
            style={{
              backgroundColor: 'green',
              height: 100,
              width: 100,
              borderRadius: 50
            }}
          ></div>
        ),
        cardIcon: 'check-circle'
      }
    ]}
  />
</FieldWrap>
};`}
        </Code>
      </Demo>
    </FieldWrap>
  );
};

export default DemoRadioCardGroup;
