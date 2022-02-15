import React, { useState } from 'react';
import PropDocs from '../../../Demo/PropDocs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Code,
  IconButton
} from '@deque/cauldron-react/';
import { children, className } from '../../../props';

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
  const [sortBy, sortDirection] = sort;

  const comparator = data =>
    data.sort((a, b) =>
      (sortDirection === 'ascending' ? a[sortBy] : b[sortBy]).localeCompare(
        sortDirection === 'ascending' ? b[sortBy] : a[sortBy]
      )
    );

  const sortedData = sortBy ? comparator(sampleData) : sampleData;

  const getCurrentSortDirection = column =>
    column === sortBy ? sortDirection : 'none';
  /* asc => desc
     none => asc
     desc => asc */
  const getNextSortDirection = column =>
    column === sortBy && sortDirection === 'ascending'
      ? 'descending'
      : 'ascending';

  return (
    <div>
      <h1>Table</h1>
      <h2>Examples</h2>
      <h3>Basic</h3>
      <Table>
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
      </Table>
      <Code role="region" tabIndex="0">
        {`import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@deque/cauldron-react/';

const BasicTable = () => (
  <Table>
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
  </Table>
)`}
      </Code>

      <h3>Sortable Table</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader scope="col">First Name</TableHeader>
            <TableHeader
              scope="col"
              sortDirection={getCurrentSortDirection('last_name')}
              onSort={() => {
                setSort(['last_name', getNextSortDirection('last_name')]);
              }}
            >
              Last Name
            </TableHeader>
            <TableHeader
              scope="col"
              sortDirection={getCurrentSortDirection('email')}
              onSort={() => {
                setSort(['email', getNextSortDirection('email')]);
              }}
            >
              Email
            </TableHeader>
            <TableHeader scope="col">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map(contact => (
            <TableRow key={contact.email}>
              <TableCell>{contact.first_name}</TableCell>
              <TableCell>{contact.last_name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                <IconButton
                  icon="trash"
                  label="Delete"
                  onClick={() => {
                    console.log(`Delete ${contact.email}`);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Code role="region" tabIndex="0">
        {`import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@deque/cauldron-react/';

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

const SortableTable = () => {
  const [sort, setSort] = useState([null, 'none']);
  const [sortBy, sortDirection] = sort;

  const comparator = data =>
    data.sort((a, b) =>
      (sortDirection === 'ascending' ? a[sortBy] : b[sortBy]).localeCompare(
        sortDirection === 'ascending' ? b[sortBy] : a[sortBy]
      )
    );

  const sortedData = sortBy ? comparator(sampleData) : sampleData;

  const getCurrentSortDirection = column =>
    column === sortBy ? sortDirection : 'none';
  /* asc => desc
     none => asc
     desc => asc */
  const getNextSortDirection = column =>
    column === sortBy && sortDirection === 'ascending'
      ? 'descending'
      : 'ascending';
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">First Name</TableHeader>
          <TableHeader
            scope="col"
            sortDirection={getCurrentSortDirection('last_name')}
            onSort={() => {
              setSort(['last_name', getNextSortDirection('last_name')]);
            }}
          >
            Last Name
          </TableHeader>
          <TableHeader
            scope="col"
            sortDirection={getCurrentSortDirection('email')}
            onSort={() => {
              setSort(['email', getNextSortDirection('email')]);
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
    </Table>
  )
}`}
      </Code>

      <div className="Demo-props">
        <h2>Props</h2>
        <h3>Table</h3>
        <PropDocs
          docs={{
            separator: {
              type: 'React.Element',
              description: 'Separator dividing each breadcrumb item',
              default: '"/"'
            },
            children,
            className
          }}
        />
        <h3>TableHeader</h3>
        <PropDocs
          docs={{
            children,
            sortDirection: {
              type: 'string',
              description:
                'The directions of the sorting, including `ascending`, `descending`, and `none`. They match the values of `aria-sort`.',
              required: false,
              default: 'none'
            },
            onSort: {
              type: 'function',
              description:
                'The function that the implementer passes in to control the change of sort direction',
              required: false
            },
            className
          }}
        />
        <h3>TableHead, TableBody, TableRow, and TableCell</h3>
        <PropDocs
          docs={{
            children,
            className
          }}
        />
      </div>
      <p>
        <strong>NOTE:</strong> the table width by default is set to 100%. If a
        max-width is desired, you can simply use your own CSS to apply it.
      </p>
    </div>
  );
};

TableDemo.displayName = 'TableDemo';
export default TableDemo;
