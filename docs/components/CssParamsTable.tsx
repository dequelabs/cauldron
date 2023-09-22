import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@deque/cauldron-react';

import { getCssVariablesStartingWith } from '../utils/getCssVariablesStartingWith';

const CssParamsTable = ({ param = '--text-size' }) => {
  const textSizes = getCssVariablesStartingWith(param);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">Name</TableHeader>
          <TableHeader scope="col">Value</TableHeader>
          <TableHeader scope="col">Description</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(textSizes).map(([name, value]) => (
          <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{value}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CssParamsTable;
