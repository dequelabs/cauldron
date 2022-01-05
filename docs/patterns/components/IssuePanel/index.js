import React from 'react';
import Demo from '../../../Demo';
import { IssuePanel, IconButton } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const IssuePanelDemo = () => {
  return (
    <div>
      <Demo
        customImport="import { IssuePanel, IconButton } from '@deque/cauldron-react'"
        component={IssuePanel}
        states={[
          {
            children: (
              <>
                Text appears and functions like a section heading but it is nor
                marked up as such.
              </>
            )
          },
          {
            title: 'Issue 1',
            children: (
              <>
                Text appears and functions like a section heading but it is nor
                marked up as such.
              </>
            )
          },
          {
            actions: [
              <IconButton icon="pencil" label="Edit" />,
              <IconButton icon="trash" label="Remove state" />,
              <IconButton icon="run-again" label="Re-run automatic scan" />
            ],
            children: (
              <>
                Text appears and functions like a section heading but it is nor
                marked up as such.
              </>
            )
          },
          {
            title: 'Issue 1',
            actions: [
              <IconButton icon="pencil" label="Edit" />,
              <IconButton icon="trash" label="Remove state" />,
              <IconButton icon="run-again" label="Re-run automatic scan" />
            ],
            children: (
              <>
                Text appears and functions like a section heading but it is nor
                marked up as such.
              </>
            )
          }
        ]}
        propDocs={{
          title: {
            type: 'string',
            required: false,
            description: 'Title'
          },
          actions: {
            type: 'typeof IconButton[]',
            required: false,
            description: 'Actions'
          },
          children: {
            ...children,
            required: true
          },
          className
        }}
      />
    </div>
  );
};

IssuePanelDemo.displayName = 'IssuePanelDemo';
export default IssuePanelDemo;
