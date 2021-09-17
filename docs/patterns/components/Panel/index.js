import React, { useState, useRef, useEffect } from 'react';
import Demo from '../../../Demo';
import {
  Panel,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const PanelDemo = () => {
  return (
    <div>
      <Demo
        customImport="import { Panel } from '@deque/cauldron-react'"
        component={Panel}
        states={[
          {
            children: (
              <div>
                Text appears and functions like a section heading but it is nor
                marked up as such.
              </div>
            ),
            title: 'Issue 1'
          }
        ]}
        propDocs={{
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

PanelDemo.displayName = 'PanelDemo';
export default PanelDemo;
