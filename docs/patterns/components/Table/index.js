import React, { useState } from 'react';
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

const sampleData = [
  {
    first_name: 'Frank',
    last_name: 'Zappa',
    email: 'frank@zappa.io'
  },
  {
    first_name: 'Duane',
    last_name: 'Allman',
    email: 'duane@almond.biz'
  },
  {
    first_name: 'Yamandu',
    last_name: 'Costa',
    email: 'yamandu_costa@gmail.br'
  },
  {
    first_name: 'Jimmy',
    last_name: 'Herring',
    email: 'jamesHerring@hotmail.gov'
  }
];

const TableDemo = () => {
  const [sort, setSort] = useState([null, 'none']);
  const [sortBy, sortDir] = sort;

  const comparator = data =>
    data.sort((a, b) =>
      (sortDir === 'ascending' ? a[sortBy] : b[sortBy]).localeCompare(
        sortDir === 'ascending' ? b[sortBy] : a[sortBy]
      )
    );

  const sortedData = sortBy ? comparator(sampleData) : sampleData;

  const getSortDir = column => (column === sortBy ? sortDir : 'none');
  /* asc => desc
     none => asc
     desc => asc */
  const setSortDir = column =>
    column === sortBy && sortDir === 'ascending' ? 'descending' : 'ascending';

  return (
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
                  <TableHeader
                    scope="col"
                    sortDir={getSortDir('last_name')}
                    onSort={() => {
                      setSort(['last_name', setSortDir('last_name')]);
                    }}
                  >
                    Last Name
                  </TableHeader>
                  <TableHeader
                    scope="col"
                    sortDir={getSortDir('email')}
                    onSort={() => {
                      setSort(['email', setSortDir('email')]);
                    }}
                  >
                    Email
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map(contact => (
                  <TableRow>
                    <TableCell>{contact.first_name}</TableCell>
                    <TableCell>{contact.last_name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                  </TableRow>
                ))}
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
};

TableDemo.displayName = 'TableDemo';
export default TableDemo;
