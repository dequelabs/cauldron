import React, { Component } from 'react';
import Demo from '../../../Demo';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const tableComponentNames = [
  'Table',
  'TableBody',
  'TableCell',
  'TableHead',
  'TableHeader',
  'TableRow'
];

const TableDemo = () => (
  <Demo
    component={Table}
    customImport={`import {\n  ${tableComponentNames.join(
      ',\n  '
    )}\n} from '@deque/cauldron-react'`}
    states={[
      {
        children: (
          <>
            <TableHead>
              <TableRow>
                <TableHeader scope="col">First Name</TableHeader>
                <TableHeader scope="col">Last Name</TableHeader>
                <TableHeader scope="col">Email</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Frank</TableCell>
                <TableCell>Zappa</TableCell>
                <TableCell>frank@zappa.io</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duane</TableCell>
                <TableCell>Allman</TableCell>
                <TableCell>duane@almond.biz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Yamandu</TableCell>
                <TableCell>Costa</TableCell>
                <TableCell>yamandu_costa@gmail.br</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jimmy</TableCell>
                <TableCell>Herring</TableCell>
                <TableCell>jamesHerring@hotmail.gov</TableCell>
              </TableRow>
            </TableBody>
          </>
        )
      }
    ]}
    propDocs={{
      children: {
        ...children,
        required: true
      },
      className
    }}
  >
    <p>
      <strong>NOTE:</strong> the table width by default is set to 100%. If a
      max-width is desired, you can simply use your own CSS to apply it.
    </p>
  </Demo>
);

TableDemo.displayName = 'TableDemo';
export default TableDemo;
