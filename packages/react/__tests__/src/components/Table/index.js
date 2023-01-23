import React from 'react';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
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
      <TableFooter className="my-table-footer" data-foo="true">
        <TableRow className="my-table-row">
          <TableCell className="my-table-cell" data-foo="true">
            foo
          </TableCell>
          <TableCell className="my-table-cell">bar</TableCell>
        </TableRow>
      </TableFooter>
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
    const tableFooter = table.find('TableFooter').at(0);

    const tableItems = [
      table,
      tableHead,
      tableRow,
      tableHeader,
      tableBody,
      tableCell,
      tableFooter
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
    const tableFooter = table.find('TableFooter').at(0);

    expect(table.is('.my-table')).toBe(true);
    expect(tableHead.is('.my-table-head')).toBe(true);
    expect(tableRow.is('.my-table-row')).toBe(true);
    expect(tableHeader.is('.my-table-header')).toBe(true);
    expect(tableBody.is('.my-table-body')).toBe(true);
    expect(tableCell.is('.my-table-cell')).toBe(true);
    expect(tableFooter.is('.my-table-footer')).toBe(true);
  });

  test('passes arbitrary props through', () => {
    const table = renderDefaultTable();
    const tableHead = table.find('TableHead');
    const tableRow = table.find('TableRow').at(0);
    const tableHeader = table.find('TableHeader').at(0);
    const tableBody = table.find('TableBody');
    const tableCell = table.find('TableCell').at(0);
    const tableFooter = table.find('TableFooter').at(0);

    const tableItems = [
      table,
      tableHead,
      tableRow,
      tableHeader,
      tableBody,
      tableCell,
      tableFooter
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
    const footer = shallow(<TableFooter>a</TableFooter>);

    expect(table.is('table')).toBe(true);
    expect(body.is('tbody')).toBe(true);
    expect(cell.is('td')).toBe(true);
    expect(head.is('thead')).toBe(true);
    expect(header.is('th')).toBe(true);
    expect(footer.is('tfoot')).toBe(true);
    expect(row.is('tr')).toBe(true);
  });

  test('renders border variant', () => {
    const wrapper = mount(
      <Table variant="border">
        <TableHead>
          <TableRow>
            <TableHeader>Header</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(wrapper.find('.Table--border').exists()).toBe(true);
  });

  describe('Sortable Table', () => {
    test('renders sort button and icons when passing in sortDirection and onSort in TableHeader', () => {
      const wrapper = mount(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader sortDirection={'none'} onSort={() => null}>
                Sortable Header
              </TableHeader>
            </TableRow>
          </TableHead>
        </Table>
      );

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.find('.Icon--sort-triangle').exists()).toBe(true);
      expect(wrapper.find('Offscreen').text()).toBe('');
    });

    test('render className TableHeader--sorting when a TableHeader is actively sorting', () => {
      const wrapper = mount(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader sortDirection={'ascending'} onSort={() => null}>
                Sortable Header
              </TableHeader>
            </TableRow>
          </TableHead>
        </Table>
      );

      expect(wrapper.find('.TableHeader--sort-ascending').exists()).toBe(true);
    });

    test('renders triangle up Icon and ascending message when sortDirection is ascending', () => {
      const wrapper = mount(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader
                sortDirection={'ascending'}
                sortAscendingAnnouncement={'up and away'}
                onSort={() => null}
              >
                Sortable Header
              </TableHeader>
            </TableRow>
          </TableHead>
        </Table>
      );

      expect(wrapper.find('Offscreen').text()).toBe('up and away');
      expect(wrapper.find('.Icon--triangle-up').exists()).toBe(true);
    });

    test('renders triangle down Icon and descending message when sortDirection is descending', () => {
      const wrapper = mount(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader
                sortDirection={'descending'}
                sortDescendingAnnouncement={'down below'}
                onSort={() => null}
              >
                Sortable Header
              </TableHeader>
            </TableRow>
          </TableHead>
        </Table>
      );

      expect(wrapper.find('Offscreen').text()).toBe('down below');
      expect(wrapper.find('.Icon--triangle-down').exists()).toBe(true);
    });

    test('calls onSort when sort button is clicked', () => {
      const onSortSpy = spy();
      const wrapper = mount(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader sortDirection={'none'} onSort={onSortSpy}>
                Sortable Header
              </TableHeader>
            </TableRow>
          </TableHead>
        </Table>
      );

      wrapper.find('button').simulate('click');

      expect(onSortSpy.calledOnce).toBe(true);
    });

    test('focus stays on the sort button after it is clicked', () => {
      const wrapper = mount(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader
                id={'button-focused'}
                sortDirection={'none'}
                onSort={() => null}
              >
                Sortable Header
              </TableHeader>
            </TableRow>
          </TableHead>
        </Table>
      );

      wrapper.find('button').simulate('click');
      wrapper.update();

      expect(document.activeElement.id).toBe(
        wrapper.find('button').getDOMNode().id
      );
    });
  });
});

test('returns 0 axe violations', async () => {
  const table = renderDefaultTable();
  expect(await axe(table.html())).toHaveNoViolations();
});
