import React from 'react';
import { FieldWrap, TextField, Button } from '@deque/cauldron-react';
import Demo from '../../../Demo';
import { children } from '../../../props';
import './index.css';

const FieldWrapDemo = () => (
  <div className="FieldWrapDemo">
    <Demo
      component={FieldWrap}
      componentDescription={
        'The FieldWrap component adds padding and a border around your input elements.'
      }
      states={[
        {
          children: <TextField label="First name" />
        },
        {
          children: (
            <>
              <legend>Send us a message</legend>
              <TextField label="Email" />
              <TextField multiline label="Message" />
              <Button>Send Message</Button>
            </>
          ),
          as: 'fieldset'
        }
      ]}
      propDocs={{
        children: {
          ...children,
          required: true
        },
        as: {
          type: 'ElementType',
          description: 'A component to render the FieldWrap as',
          default: 'div'
        }
      }}
    />
  </div>
);

export default FieldWrapDemo;
