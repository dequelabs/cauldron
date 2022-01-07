import React from 'react';
import { FieldWrap, TextField, Button } from '@deque/cauldron-react';
import Demo from '../../../Demo';
import { children } from '../../../props';
import './index.css';

const FieldWrapDemo = () => (
  <div className="FieldWrapDemo">
    <Demo
      component={FieldWrap}
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
          description: 'A component to render the IconButton as',
          default: 'button'
        }
      }}
    />
  </div>
);

export default FieldWrapDemo;
