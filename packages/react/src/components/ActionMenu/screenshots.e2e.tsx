import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import {
  Button,
  Icon,
  ActionMenu,
  ActionList,
  ActionListItem,
  ActionListLinkItem,
  ActionListGroup,
  ActionListSeparator
} from '../../../';

test('should have screenshot for ActionMenu', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `.ActionMenu {
      position: relative !important;
      transform: translateY(2px) !important;
      /* view full height of menu */
      --action-menu-max-height: none;
    }`
  });
  const component = await mount(
    <div>
      <ActionMenu
        trigger={
          <Button variant="secondary">
            Action Menu Trigger
            <Icon type="chevron-down" />
          </Button>
        }
      >
        <ActionList>
          <ActionListGroup label="Group Label">
            <ActionListItem>Focus</ActionListItem>
            <ActionListItem>Group Item 2</ActionListItem>
            <ActionListItem>Group Item 3</ActionListItem>
          </ActionListGroup>
          <ActionListItem>Item</ActionListItem>
          <ActionListItem disabled>Disabled</ActionListItem>
          <ActionListItem>Hover</ActionListItem>
          <ActionListItem variant="danger">Danger</ActionListItem>
          <ActionListItem variant="danger" disabled>
            Disabled danger
          </ActionListItem>
          <ActionListItem description="This is a description">
            Description
          </ActionListItem>
          <ActionListItem description="This is a description" disabled>
            Disabled description
          </ActionListItem>
          <ActionListLinkItem href="#">Link</ActionListLinkItem>
          <ActionListItem leadingIcon="copy">Leading icon</ActionListItem>
          <ActionListItem trailingIcon="new">Trailing icon</ActionListItem>
          <ActionListItem leadingIcon="copy" trailingIcon="new">
            Both icons
          </ActionListItem>
          <ActionListItem leadingIcon="copy" disabled>
            Disabled icon
          </ActionListItem>
          <ActionListItem variant="danger" leadingIcon="copy">
            Danger leading icon
          </ActionListItem>
          <ActionListItem variant="danger" trailingIcon="new">
            Danger trailing icon
          </ActionListItem>
          <ActionListItem
            variant="danger"
            leadingIcon="copy"
            trailingIcon="new"
          >
            Danger both icons
          </ActionListItem>
          <ActionListItem variant="danger" leadingIcon="copy" disabled>
            Danger disabled icon
          </ActionListItem>
          <ActionListItem variant="danger" description="This is a description">
            Danger description
          </ActionListItem>
          <ActionListItem
            leadingIcon="copy"
            description="This is a description"
          >
            Leading icon description
          </ActionListItem>
          <ActionListItem
            trailingIcon="new"
            description="This is a description"
          >
            Trailing icon description
          </ActionListItem>
          <ActionListItem
            leadingIcon="copy"
            trailingIcon="new"
            description="This is a description"
          >
            Both icons description
          </ActionListItem>
          <ActionListSeparator />
          <ActionListItem>Separated</ActionListItem>
        </ActionList>
      </ActionMenu>
    </div>
  );

  await component.getByText('Action Menu Trigger').click();
  await component.getByText('Hover').hover();

  await expect(component).toHaveScreenshot('actionmenu');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--actionmenu');
});

test('should have screenshot for ActionMenu selections', async ({
  mount,
  page
}) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `.ActionMenu {
      position: relative !important;
      transform: translateY(2px) !important;
      /* view full height of menu */
      --action-menu-max-height: none;
    }`
  });
  const component = await mount(
    <div>
      <ActionMenu
        trigger={
          <Button variant="secondary">
            Action Menu Trigger
            <Icon type="chevron-down" />
          </Button>
        }
      >
        <ActionList selectionType="single">
          <ActionListGroup label="Group Label">
            <ActionListItem>Focus</ActionListItem>
            <ActionListItem>Group Item 2</ActionListItem>
            <ActionListItem>Group Item 3</ActionListItem>
          </ActionListGroup>
          <ActionListItem>Item</ActionListItem>
          <ActionListItem selected>Selected</ActionListItem>
          <ActionListItem disabled>Disabled</ActionListItem>
          <ActionListItem selected disabled>
            Selected disabled
          </ActionListItem>
          <ActionListItem>Hover</ActionListItem>
          <ActionListItem description="This is a description" selected>
            Selected description
          </ActionListItem>
          <ActionListItem description="This is a description" disabled>
            Disabled description
          </ActionListItem>
          <ActionListItem description="This is a description" selected disabled>
            Selected disabled description
          </ActionListItem>
          <ActionListItem leadingIcon="copy">Leading icon</ActionListItem>
          <ActionListItem trailingIcon="new">Trailing icon</ActionListItem>
          <ActionListItem leadingIcon="copy" selected>
            Leading icon selected
          </ActionListItem>
          <ActionListItem trailingIcon="new" selected>
            Trailing icon selected
          </ActionListItem>
          <ActionListItem leadingIcon="copy" trailingIcon="new" selected>
            Both icons selected
          </ActionListItem>
          <ActionListItem
            leadingIcon="copy"
            trailingIcon="new"
            selected
            disabled
          >
            Icons selected disabled
          </ActionListItem>
          <ActionListItem
            leadingIcon="copy"
            trailingIcon="new"
            description="This is a description"
            selected
          >
            Icons selected description
          </ActionListItem>
          <ActionListSeparator />
          <ActionListItem>Separated</ActionListItem>
        </ActionList>
      </ActionMenu>
    </div>
  );

  await component.getByText('Action Menu Trigger').click();
  await component.getByText('Hover').hover();

  await expect(component).toHaveScreenshot('actionmenu-selections');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--actionmenu-selections');
});

test('should have screenshot for ActionMenu mixed', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `.ActionMenu {
      position: relative !important;
      transform: translateY(2px) !important;
      /* view full height of menu */
      --action-menu-max-height: none;
    }`
  });
  const component = await mount(
    <div>
      <ActionMenu
        trigger={
          <Button variant="secondary">
            Action Menu Trigger
            <Icon type="chevron-down" />
          </Button>
        }
      >
        <ActionList>
          <ActionListGroup label="Group Label" selectionType="single">
            <ActionListItem>Focus</ActionListItem>
            <ActionListItem selected>Selected</ActionListItem>
            <ActionListItem selected disabled>
              Selected Disabled
            </ActionListItem>
            <ActionListItem leadingIcon="copy">Leading icon</ActionListItem>
            <ActionListItem trailingIcon="new">Trailing icon</ActionListItem>
          </ActionListGroup>
          <ActionListItem>Item</ActionListItem>
          <ActionListItem disabled>Disabled</ActionListItem>
          <ActionListItem>Hover</ActionListItem>
          <ActionListLinkItem href="#">Link</ActionListLinkItem>
          <ActionListItem leadingIcon="copy">Leading icon</ActionListItem>
          <ActionListItem trailingIcon="new">Trailing icon</ActionListItem>
          <ActionListSeparator />
          <ActionListItem>Separated</ActionListItem>
        </ActionList>
      </ActionMenu>
    </div>
  );

  await component.getByText('Action Menu Trigger').click();
  await component.getByText('Hover').hover();

  await expect(component).toHaveScreenshot('actionmenu-mixed');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--actionmenu-mixed');
});
