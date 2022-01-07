import React from 'react';
import { FieldWrap, TextField, Button } from '@deque/cauldron-react';
import Demo from '../../../Demo';
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
          type: 'string',
          description:
            'code to be syntax highlighted and rendered in code block'
        },
        language: {
          type: 'string',
          description: '"javascript", "css" or "html"'
        }
      }}
    />
  </div>
);

export default FieldWrapDemo;
