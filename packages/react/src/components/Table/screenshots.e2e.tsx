import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import {
  Panel,
  PanelContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '../../../';

test('should have screenshot for Table', async ({ mount, page }) => {
  const component = await mount(
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">Name</TableHeader>
          <TableHeader scope="col">Role</TableHeader>
          <TableHeader scope="col">Location</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell>London</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell>Mathematician</TableCell>
          <TableCell>Manchester</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Grace Hopper</TableCell>
          <TableCell>Admiral</TableCell>
          <TableCell>New York</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>3 people</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );

  await expect(component).toHaveScreenshot('table');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table');
});

test('should have screenshot for Table[variant=border]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Table variant="border">
      <TableHead>
        <TableRow>
          <TableHeader scope="col">Name</TableHeader>
          <TableHeader scope="col">Role</TableHeader>
          <TableHeader scope="col">Location</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell>London</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell>Mathematician</TableCell>
          <TableCell>Manchester</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  await expect(component).toHaveScreenshot('table-border');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-border');
});

test('should have screenshot for Table with sortable headers', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader
            scope="col"
            sortDirection="ascending"
            onSort={() => null}
          >
            Name
          </TableHeader>
          <TableHeader
            scope="col"
            sortDirection="descending"
            onSort={() => null}
          >
            Role
          </TableHeader>
          <TableHeader scope="col" sortDirection="none" onSort={() => null}>
            Location
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell>London</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell>Mathematician</TableCell>
          <TableCell>Manchester</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  await expect(component).toHaveScreenshot('table-sortable');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-sortable');
});

test('should have screenshot for Table[layout=grid]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Table layout="grid" columns={3}>
      <TableHead>
        <TableRow>
          <TableHeader scope="col">Name</TableHeader>
          <TableHeader scope="col">Role</TableHeader>
          <TableHeader scope="col">Location</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell>London</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell>Mathematician</TableCell>
          <TableCell>Manchester</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  await expect(component).toHaveScreenshot('table-grid');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-grid');
});

// A Panel with padding disabled is the container that publishes a corner for
// the table's edge cells to take.
const flushTable = (
  <Table>
    <TableHead>
      <TableRow>
        <TableHeader scope="col" sortDirection="none" onSort={() => null}>
          Name
        </TableHeader>
        <TableHeader scope="col">Role</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Ada Lovelace</TableCell>
        <TableCell>Engineer</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Alan Turing</TableCell>
        <TableCell>Mathematician</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

test('should have screenshot for Table flush in a container, with a footer', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Panel padding={false}>
      <PanelContent padding={false}>{flushTable}</PanelContent>
      <PanelContent>Footer</PanelContent>
    </Panel>
  );

  await expect(component).toHaveScreenshot('table-flush-with-footer');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-flush-with-footer');
});

test('should have screenshot for Table flush in a container, top and bottom', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Panel padding={false}>
      <PanelContent padding={false}>{flushTable}</PanelContent>
    </Panel>
  );

  await expect(component).toHaveScreenshot('table-flush');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-flush');
});

test('should have screenshot for Table flush as a direct child', async ({
  mount,
  page
}) => {
  const component = await mount(<Panel padding={false}>{flushTable}</Panel>);

  await expect(component).toHaveScreenshot('table-flush-direct-child');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-flush-direct-child');
});

test('should have screenshot for Table inset in a container', async ({
  mount,
  page
}) => {
  const component = await mount(<Panel>{flushTable}</Panel>);

  await expect(component).toHaveScreenshot('table-inset');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-inset');
});

test('should have screenshot for Table flush with a focused sortable header', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Panel padding={false}>
      <PanelContent padding={false}>{flushTable}</PanelContent>
    </Panel>
  );

  await component.getByRole('button', { name: 'Name' }).focus();

  await expect(component).toHaveScreenshot('table-flush-sort-focus');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--table-flush-sort-focus');
});
