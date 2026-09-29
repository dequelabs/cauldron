import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { Panel, PanelContent } from '../../../';

// A background of its own is what makes a corner visible, so the screenshots
// use plain elements rather than another component.
const banner = (
  <div style={{ background: '#8b2f3d', color: '#fff', padding: '12px' }}>
    Flush content
  </div>
);

test('should have screenshot for Panel[padding=false] with flush content', async ({
  mount,
  page
}) => {
  const component = await mount(
    <Panel padding={false}>
      {banner}
      <PanelContent>Footer</PanelContent>
    </Panel>
  );

  await expect(component).toHaveScreenshot('panel-flush-content');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--panel-flush-content');
});

test('should have screenshot for Panel[padding=false] with flush content top and bottom', async ({
  mount,
  page
}) => {
  const component = await mount(<Panel padding={false}>{banner}</Panel>);

  await expect(component).toHaveScreenshot('panel-flush-content-only');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--panel-flush-content-only');
});

test('should have screenshot for Panel with inset content', async ({
  mount,
  page
}) => {
  const component = await mount(<Panel>{banner}</Panel>);

  await expect(component).toHaveScreenshot('panel-inset-content');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--panel-inset-content');
});
