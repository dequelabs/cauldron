import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import {
  MetadataList,
  MetadataListItem,
  MetadataListLabel,
  MetadataListValue
} from '../../../';

test('should have screenshot for MetadataList[orientation=horizontal]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <MetadataList orientation="horizontal">
      <MetadataListItem>
        <MetadataListLabel>Status</MetadataListLabel>
        <MetadataListValue>Active</MetadataListValue>
      </MetadataListItem>
      <MetadataListItem>
        <MetadataListLabel>Created</MetadataListLabel>
        <MetadataListValue>January 1, 2026</MetadataListValue>
      </MetadataListItem>
      <MetadataListItem>
        <MetadataListLabel>Owner</MetadataListLabel>
        <MetadataListValue>Jane Doe</MetadataListValue>
      </MetadataListItem>
    </MetadataList>
  );

  await expect(component).toHaveScreenshot('metadata-list-horizontal');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--metadata-list-horizontal');
});

test('should have screenshot for MetadataList[orientation=vertical]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <MetadataList orientation="vertical">
      <MetadataListItem>
        <MetadataListLabel>Status</MetadataListLabel>
        <MetadataListValue>Active</MetadataListValue>
      </MetadataListItem>
      <MetadataListItem>
        <MetadataListLabel>Created</MetadataListLabel>
        <MetadataListValue>January 1, 2026</MetadataListValue>
      </MetadataListItem>
      <MetadataListItem>
        <MetadataListLabel>Owner</MetadataListLabel>
        <MetadataListValue>Jane Doe</MetadataListValue>
      </MetadataListItem>
    </MetadataList>
  );

  await expect(component).toHaveScreenshot('metadata-list-vertical');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--metadata-list-vertical');
});
