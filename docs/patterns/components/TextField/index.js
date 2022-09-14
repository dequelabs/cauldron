import React from 'react';
import { TextField, FieldWrap } from '@deque/cauldron-react/';
import { className } from '../../../props';
import Demo from '../../../Demo';
import FieldWrapNotice from '../../../FieldWrapNotice';
import './index.css';

const TextFieldDemo = () => {
  return (
    <div className="TextField">
      <FieldWrap>
        <FieldWrapNotice />
        <Demo
          states={[
            {
              label: 'Resting'
            },
            {
              disabled: true,
              label: 'Disabled'
            },
            {
              required: true,
              label: 'Required'
            },
            {
              required: true,
              label: 'With error',
              error: 'This field has an error!'
            },
            {
              multiline: true,
              label: 'Text area'
            },
            {
              disabled: true,
              multiline: true,
              label: 'Text area disabled'
            },
            {
              required: true,
              multiline: true,
              label: 'Text area required'
            },
            {
              required: true,
              multiline: true,
              label: 'Text area with error',
              error: 'This text area has an error!'
            }
          ]}
          component={TextField}
          whenToUse={
            'A form element that allows users to type in text. One line and multi-line options.'
          }
          propDocs={{
            className,
            label: {
              type: 'ReactNode',
              required: true,
              description: 'The label for the field.'
            },
            error: {
              type: 'string',
              description: 'The field‘s error message.'
            },
            required: {
              type: 'boolean',
              description: 'Whether the field is required or not.'
            },
            defaultValue: {
              type: 'string',
              description:
                'The default value to be applied to the field. Optionally used for "uncontrolled" fields.'
            },
            value: {
              type: 'string',
              description:
                'The value to be applied to the field. Used for "controlled" fields.'
            },
            onChange: {
              type: 'function',
              description:
                'onChange handler for the field. The field‘s value and original event object will be passed as the 2 parameters.'
            },
            fieldRef: {
              type: 'ref',
              description: 'Field element reference.'
            },
            requiredText: {
              type: 'string',
              description: 'Custom "required" text. Useful for localization.'
            },
            multiline: {
              type: 'boolean',
              description:
                'If true, a textarea element will be rendered. Otherwise, an input[type="text"] will be rendered.'
            }
          }}
        />
      </FieldWrap>
    </div>
  );
};

TextFieldDemo.displayName = 'TextFieldDemo';

export default TextFieldDemo;
