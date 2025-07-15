import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from './';
import axe from '../../axe';

const renderDefaultTable = (props: React.ComponentProps<typeof Table> = {}) => {
  return render(
    <Table className="my-table" data-foo="true" {...props}>
      <TableHead data-testid="thead" className="my-table-head" data-foo="true">
        <TableRow className="my-table-row" data-foo="true">
          <TableHeader className="my-table-header" scope="col" data-foo="true">
            A
          </TableHeader>
          <TableHeader className="my-table-header" scope="col">
            B
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody data-testid="tbody" className="my-table-body" data-foo="true">
        <TableRow className="my-table-row">
          <TableCell className="my-table-cell" data-foo="true">
            1
          </TableCell>
          <TableCell className="my-table-cell">2</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter
        data-testid="tfoot"
        className="my-table-footer"
        data-foo="true"
      >
        <TableRow className="my-table-row">
          <TableCell className="my-table-cell" data-foo="true">
            foo
          </TableCell>
          <TableCell className="my-table-cell">bar</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

test('should render table and its components correctly', () => {
  renderDefaultTable();

  const table = screen.getByRole('table');
  const tableHead = screen.getByTestId('thead');
  const tableBody = screen.getByTestId('tbody');
  const tableRows = screen.getAllByRole('row');
  const tableHeaders = screen.getAllByRole('columnheader');
  const tableCells = screen.getAllByRole('cell');
  const tableFooter = screen.getByTestId('tfoot');

  // Accessing the first elements of each type for more detailed assertions
  const firstTableRow = tableRows[0];
  const firstTableHeader = tableHeaders[0];
  const firstTableCell = tableCells[0];

  // Assertions on the lengths of various table components
  expect(tableRows).toHaveLength(3); // Assuming there are three rows
  expect(tableHeaders).toHaveLength(2); // Assuming there are two column headers
  expect(tableCells).toHaveLength(4); // Assuming there are four cells

  const tableItems = [
    table,
    tableHead,
    tableBody,
    firstTableRow,
    firstTableHeader,
    firstTableCell,
    tableFooter
  ];

  tableItems.forEach((element) => {
    expect(element).toBeInTheDocument();
  });
});

test('should pass classNames through', () => {
  renderDefaultTable();

  const table = screen.getByRole('table');
  const tableHead = screen.getByTestId('thead');
  const tableBody = screen.getByTestId('tbody');
  const tableRows = screen.getAllByRole('row');
  const tableHeaders = screen.getAllByRole('columnheader');
  const tableCells = screen.getAllByRole('cell');
  const tableFooter = screen.getByTestId('tfoot');

  const firstTableRow = tableRows[0];
  const firstTableHeader = tableHeaders[0];
  const firstTableCell = tableCells[0];

  expect(table).toHaveClass('Table', 'my-table');
  expect(tableHead).toHaveClass('TableHead', 'my-table-head');
  expect(tableBody).toHaveClass('TableBody', 'my-table-body');
  expect(firstTableRow).toHaveClass('TableRow', 'my-table-row');
  expect(firstTableHeader).toHaveClass('TableHeader', 'my-table-header');
  expect(firstTableCell).toHaveClass('TableCell', 'my-table-cell');
  expect(tableFooter).toHaveClass('TableFooter', 'my-table-footer');
});

test('should pass arbitrary props through', () => {
  renderDefaultTable();

  const table = screen.getByRole('table');
  const tableHead = screen.getByTestId('thead');
  const tableBody = screen.getByTestId('tbody');
  const tableRows = screen.getAllByRole('row');
  const tableHeaders = screen.getAllByRole('columnheader');
  const tableCells = screen.getAllByRole('cell');
  const tableFooter = screen.getByTestId('tfoot');

  const firstTableRow = tableRows[0];
  const firstTableHeader = tableHeaders[0];
  const firstTableCell = tableCells[0];

  const tableItems = [
    table,
    tableHead,
    tableBody,
    firstTableRow,
    firstTableHeader,
    firstTableCell,
    tableFooter
  ];

  tableItems.forEach((element) => {
    expect(element).toHaveAttribute('data-foo', 'true');
  });

  expect(firstTableHeader).toHaveAttribute('scope', 'col');
});

test('should render the expected semantic HTML elements', () => {
  renderDefaultTable();

  const table = screen.getByRole('table');
  const tableHead = screen.getByTestId('thead');
  const tableBody = screen.getByTestId('tbody');
  const tableRows = screen.getAllByRole('row');
  const tableHeaders = screen.getAllByRole('columnheader');
  const tableCells = screen.getAllByRole('cell');
  const tableFooter = screen.getByTestId('tfoot');

  const firstTableRow = tableRows[0];
  const firstTableHeader = tableHeaders[0];
  const firstTableCell = tableCells[0];

  expect(table.tagName).toBe('TABLE');
  expect(tableHead.tagName).toBe('THEAD');
  expect(tableBody.tagName).toBe('TBODY');
  expect(firstTableRow.tagName).toBe('TR');
  expect(firstTableHeader.tagName).toBe('TH');
  expect(firstTableCell.tagName).toBe('TD');
  expect(tableFooter.tagName).toBe('TFOOT');
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLTableElement>();
  renderDefaultTable({ ref });
  expect(ref.current).toBeTruthy();
  expect(ref.current).toEqual(screen.getByRole('table'));
});

test('should render with border variant', () => {
  render(
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

  expect(screen.getByRole('table')).toHaveClass('Table', 'Table--border');
});

test('should render sort button and icons with sortDirection and onSort in Table', () => {
  render(
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

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('status').closest('.Icon--sort-triangle'));
  expect(screen.getByRole('status')).toHaveTextContent('');
});

test('should render className "TableHeader--sorting" when actively sorting', () => {
  render(
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

  expect(screen.getByRole('columnheader')).toHaveAttribute(
    'aria-sort',
    'ascending'
  );
  expect(screen.getByRole('columnheader')).toHaveClass(
    'TableHeader',
    'TableHeader--sort-ascending'
  );
});

test('should render triangle up Icon and ascending message when sortDirection is ascending', () => {
  render(
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

  expect(screen.getByRole('status')).toHaveTextContent('up and away');
  expect(screen.getByRole('status').closest('.Icon--table-sort-ascending'));
});

test('should render triangle down Icon and descending message when sortDirection is descending', () => {
  render(
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

  expect(screen.getByRole('status')).toHaveTextContent('down below');
  expect(screen.getByRole('status').closest('.Icon--table-sort-descending'));
});

test('should call onSort when sort button is clicked', async () => {
  const onSortMock = jest.fn();

  render(
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader sortDirection="none" onSort={onSortMock}>
            Sortable Header
          </TableHeader>
        </TableRow>
      </TableHead>
    </Table>
  );

  const button = screen.getByRole('button');

  await userEvent.click(button);
  await waitFor(() => {
    expect(onSortMock).toHaveBeenCalledTimes(1);
  });
});

test('should maintain focus on the sort button after it is clicked', async () => {
  render(
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader
            id="button-focused"
            sortDirection="none"
            onSort={() => null}
          >
            Sortable Header
          </TableHeader>
        </TableRow>
      </TableHead>
    </Table>
  );

  const button = screen.getByRole('button');

  await userEvent.click(button);
  await waitFor(() => {
    expect(button).toHaveFocus();
  });
});

test('should support grid layout', () => {
  renderDefaultTable({ layout: 'grid', columns: 2 });
  const table = screen.getByRole('table');
  expect(table).toHaveClass('Table', 'TableGrid');
  expect(table).toHaveStyle('--table-grid-template-columns: auto auto');
});

test('should support column definitions with grid layout', () => {
  renderDefaultTable({
    layout: 'grid',
    columns: [
      { width: '1fr', align: 'start' },
      { width: 'min-content', align: 'end' }
    ]
  });
  const table = screen.getByRole('table');
  expect(table).toHaveStyle('--table-grid-template-columns: 1fr min-content');
  const tableHeaderCells = screen.getAllByRole('columnheader');
  expect(tableHeaderCells[0]).toHaveStyle('text-align: start');
  expect(tableHeaderCells[1]).toHaveStyle('text-align: end');
  const tableCells = screen.getAllByRole('cell');
  expect(tableCells[0]).toHaveStyle('text-align: start');
  expect(tableCells[1]).toHaveStyle('text-align: end');
});

test('should support column definitions with maxWidth with grid layout', () => {
  renderDefaultTable({
    layout: 'grid',
    columns: [
      { width: '1fr', align: 'start' },
      { width: 'min-content', align: 'end' },
      { width: 'min-content', maxWidth: '789', align: 'end' },
      { maxWidth: '789', align: 'end' }
    ]
  });
  const table = screen.getByRole('table');
  expect(table).toHaveStyle(
    '--table-grid-template-columns: 1fr min-content minmax(min-content, 789px) minmax(auto, 789px)'
  );
});

test('should apply colspan styles to cells in grid layout', () => {
  render(
    <Table layout="grid">
      <TableBody>
        <TableRow>
          <TableCell data-testid="colspan-cell" colSpan={2}>
            2
          </TableCell>
          <TableCell data-testid="cell">1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  expect(screen.getByTestId('colspan-cell')).toHaveStyle('gridColumn: span 2');
  expect(screen.getByTestId('cell')).not.toHaveStyle('gridColumn: span 1');
});

test('should apply rowspan styles to cells in grid layout', () => {
  render(
    <Table layout="grid">
      <TableBody>
        <TableRow>
          <TableCell data-testid="rowspan-cell" rowSpan={2}>
            2
          </TableCell>
          <TableCell data-testid="cell">1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  expect(screen.getByTestId('rowspan-cell')).toHaveStyle('gridRow: span 2');
  expect(screen.getByTestId('cell')).not.toHaveStyle('gridRow: span 1');
});

test('returns 0 axe violations for default table layout', async () => {
  const { container } = renderDefaultTable();
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns 0 axe violations for grid table layout', async () => {
  const { container } = renderDefaultTable({ layout: 'grid' });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns 0 axe violations without any sorting', async () => {
  const { container } = render(
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
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns 0 axe violations with ascending sorting', async () => {
  const { container } = render(
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
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('returns 0 axe violations with descending sorting', async () => {
  const { container } = render(
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader sortDirection={'descending'} onSort={() => null}>
            Sortable Header
          </TableHeader>
        </TableRow>
      </TableHead>
    </Table>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
test('aligns the table headers for sortable columns when it is end', () => {
  render(
    <Table
      layout="grid"
      columns={[
        {
          width: '1fr',
          align: 'end'
        }
      ]}
    >
      <TableHead>
        <TableRow>
          <TableHeader sortDirection={'none'} onSort={() => null}>
            Sortable Header
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Cell</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const tableHeader = screen.getByRole('button', { name: /Sortable Header/i });
  expect(tableHeader).toHaveStyle('justify-content: flex-end');
});

test('aligns the table headers for sortable columns when it is center', () => {
  render(
    <Table
      layout="grid"
      columns={[
        {
          width: '1fr',
          align: 'center'
        }
      ]}
    >
      <TableHead>
        <TableRow>
          <TableHeader sortDirection={'none'} onSort={() => null}>
            Sortable Header
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Cell</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const tableHeader = screen.getByRole('button', { name: /Sortable Header/i });
  expect(tableHeader).toHaveStyle('justify-content: center');
});

test('aligns the table headers for sortable columns when it is not set', () => {
  render(
    <Table layout="grid">
      <TableHead>
        <TableRow>
          <TableHeader sortDirection={'none'} onSort={() => null}>
            Sortable Header
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Cell</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const tableHeader = screen.getByRole('button', { name: /Sortable Header/i });
  expect(tableHeader).toHaveStyle('justify-content: flex-start');
});
