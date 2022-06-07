import React from 'react';
import { Link } from 'react-router-dom';
import Demo from '../../../Demo';
import {
  RadioCardGroup,
  Code,
  FieldWrap
} from '../../../../packages/react/lib';

const labelDescription =
  'A label for the radio card group is required. This means you must provide either an aria-label or aria-labelledby prop.';

const DemoRadioCardGroup = () => {
  return (
    <>
      <h1>RadioCardGroup</h1>
      <p>
        <strong>NOTE:</strong> All form fields should be rendered as children of
        a{' '}
        <Link to="/components/FieldWrap">
          <code>{`<FieldWrap />`}</code> component
        </Link>
        . This means ALL fields in a form should be wrapped by 1 or more (in the
        case of "groups" of fields) FieldWrap components.
      </p>

      <h2>Demo</h2>

      <FieldWrap>
        <h3 id="pizza-label">Do you like pizza?</h3>
        <RadioCardGroup
          name="pizza"
          defaultValue="tuesday"
          aria-labelledby="pizza-label"
          radios={[
            {
              id: 'yes',
              value: 'yes',
              label: 'Yes',
              cardImg: <img src="inserturl" alt="" />,
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
              id: 'tuesday',
              value: 'tuesday',
              label: 'Only on Tuesdays',
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

      <h2>Code Samples</h2>
      <Code language="javascript" role="region" tabIndex={0}>
        {`import React from 'react';
import { RadioCardGroup, FieldWrap } from '@deque/cauldron-react';

const Demo = () => {
return (
  <FieldWrap>
  <h3 id="pizza-label">Do you like pizza?</h3>
  <RadioCardGroup
    name="pizza"
    defaultValue="tuesday"
    aria-labelledby="pizza-label"
    radios={[
      {
        id: 'yes',
        value: 'yes',
        label: 'Yes',
        cardImg: <img src="inserturl" alt="" />,
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
        id: 'tuesday',
        value: 'tuesday',
        label: 'Only on Tuesdays',
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

      <Demo
        component={RadioCardGroup}
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
      />
    </>
  );
};

export default DemoRadioCardGroup;
