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

interface CssParamsTableProps {
  param?: string;
  renderExample?: (name: string, value: string) => JSX.Element;
  formatName?: (name: string) => string;
}

const CssParamsTable = ({
  param = '--text-size',
  renderExample,
  formatName = (name: string) => name
}: CssParamsTableProps) => {
  const textSizes = getCssVariablesStartingWith(param);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">Name</TableHeader>
          <TableHeader scope="col">Value</TableHeader>
          <TableHeader scope="col">Description</TableHeader>
          {renderExample && <TableHeader scope="col">Example</TableHeader>}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(textSizes).map(([name, value]) => (
          <TableRow>
            <TableCell>{formatName(name)}</TableCell>
            <TableCell>{value}</TableCell>
            <TableCell>-</TableCell>
            {renderExample && (
              <TableCell>{renderExample(name, value)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CssParamsTable;
