import React from 'react';
import { shallow, mount } from 'enzyme';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/Table';
import axe from '../../../axe';

const renderDefaultTable = () =>
  mount(
    <Table className="my-table" data-foo="true">
      <TableHead className="my-table-head" data-foo="true">
        <TableRow className="my-table-row" data-foo="true">
          <TableHeader className="my-table-header" scope="col" data-foo="true">
            A
          </TableHeader>
          <TableHeader className="my-table-header" scope="col">
            B
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody className="my-table-body" data-foo="true">
        <TableRow className="my-table-row">
          <TableCell className="my-table-cell" data-foo="true">
            1
          </TableCell>
          <TableCell className="my-table-cell">2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

describe('Table components', () => {
  test('render children', () => {
    const table = renderDefaultTable();
    const tableHead = table.find('TableHead');
    const tableRow = table.find('TableRow').at(0);
    const tableHeader = table.find('TableHeader').at(0);
    const tableBody = table.find('TableBody');
    const tableCell = table.find('TableCell').at(0);

    const tableItems = [
      table,
      tableHead,
      tableRow,
      tableHeader,
      tableBody,
      tableCell
    ];

    tableItems.forEach(wrapper => {
      expect(!!wrapper.children().length).toBe(true);
    });
  });

  test('passes classNames through', () => {
    const table = renderDefaultTable();
    const tableHead = table.find('TableHead');
    const tableRow = table.find('TableRow').at(0);
    const tableHeader = table.find('TableHeader').at(0);
    const tableBody = table.find('TableBody');
    const tableCell = table.find('TableCell').at(0);

    expect(table.is('.my-table')).toBe(true);
    expect(tableHead.is('.my-table-head')).toBe(true);
    expect(tableRow.is('.my-table-row')).toBe(true);
    expect(tableHeader.is('.my-table-header')).toBe(true);
    expect(tableBody.is('.my-table-body')).toBe(true);
    expect(tableCell.is('.my-table-cell')).toBe(true);
  });

  test('passes arbitrary props through', () => {
    const table = renderDefaultTable();
    const tableHead = table.find('TableHead');
    const tableRow = table.find('TableRow').at(0);
    const tableHeader = table.find('TableHeader').at(0);
    const tableBody = table.find('TableBody');
    const tableCell = table.find('TableCell').at(0);

    const tableItems = [
      table,
      tableHead,
      tableRow,
      tableHeader,
      tableBody,
      tableCell
    ];

    tableItems.forEach(wrapper => {
      expect(wrapper.is('[data-foo="true"]')).toBe(true);
    });

    expect(tableHeader.is('[scope="col"]')).toBe(true);
  });

  test('renders the expected semantic HTML elements', () => {
    const table = shallow(<Table>a</Table>);
    const body = shallow(<TableBody>a</TableBody>);
    const cell = shallow(<TableCell>a</TableCell>);
    const head = shallow(<TableHead>a</TableHead>);
    const header = shallow(<TableHeader>a</TableHeader>);
    const row = shallow(<TableRow>a</TableRow>);

    expect(table.is('table')).toBe(true);
    expect(body.is('tbody')).toBe(true);
    expect(cell.is('td')).toBe(true);
    expect(head.is('thead')).toBe(true);
    expect(header.is('th')).toBe(true);
    expect(row.is('tr')).toBe(true);
  });
});

test('returns 0 axe violations', async () => {
  const table = renderDefaultTable();
  expect(await axe(table.html())).toHaveNoViolations();
});
