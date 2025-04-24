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
          <ActionListLinkItem href="#">Link</ActionListLinkItem>
          <ActionListItem leadingIcon="copy">Leading Icon</ActionListItem>
          <ActionListItem trailingIcon="new">Trailing Icon</ActionListItem>
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
  await expect(component).toHaveScreenshot('dark-actionmenu');
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
            Selected Disabled
          </ActionListItem>
          <ActionListItem>Hover</ActionListItem>
          <ActionListLinkItem href="#">Link</ActionListLinkItem>
          <ActionListItem leadingIcon="copy">Leading Icon</ActionListItem>
          <ActionListItem trailingIcon="new">Trailing Icon</ActionListItem>
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
  await expect(component).toHaveScreenshot('dark-actionmenu-selections');
});

test('should have screenshot for ActionMenu mixed', async ({ mount, page }) => {
  await page.addStyleTag({
    // ensure screenshots are able to capture the boundaries of an expanded combobox
    content: `.ActionMenu {
      position: relative !important;
      transform: translateY(2px) !important;
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
          </ActionListGroup>
          <ActionListItem>Item</ActionListItem>
          <ActionListItem disabled>Disabled</ActionListItem>
          <ActionListItem>Hover</ActionListItem>
          <ActionListLinkItem href="#">Link</ActionListLinkItem>
          <ActionListItem leadingIcon="copy">Leading Icon</ActionListItem>
          <ActionListItem trailingIcon="new">Trailing Icon</ActionListItem>
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
  await expect(component).toHaveScreenshot('dark-actionmenu-mixed');
});
