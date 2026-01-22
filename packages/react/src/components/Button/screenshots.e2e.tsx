import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { Button, Icon } from '../../../';

test('should have screenshot for Button[variant="primary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="primary">Hover</Button>
      <Button variant="primary">Active</Button>
      <Button variant="primary">Focus</Button>
      <Button variant="primary" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component
    .getByText('Active')
    .press('Space', { delay: 1000, noWaitAfter: true });
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=primary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=primary]');
});

test('should have screenshot for Button[thin][variant="primary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="primary" thin>
        Primary
      </Button>
      <Button variant="primary" thin>
        Hover
      </Button>
      <Button variant="primary" thin>
        Active
      </Button>
      <Button variant="primary" thin>
        Focus
      </Button>
      <Button variant="primary" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][variant=primary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--button[thin][variant=primary]'
  );
});

test('should have screenshot for Button[variant="secondary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary">Hover</Button>
      <Button variant="secondary">Active</Button>
      <Button variant="secondary">Focus</Button>
      <Button variant="secondary" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=secondary]');
});

test('should have screenshot for Button[thin][variant="secondary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary" thin>
        Secondary
      </Button>
      <Button variant="secondary" thin>
        Hover
      </Button>
      <Button variant="secondary" thin>
        Active
      </Button>
      <Button variant="secondary" thin>
        Focus
      </Button>
      <Button variant="secondary" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin][secondary]');
});

test('should have screenshot for Button[variant="tertiary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="tertiary">Hover</Button>
      <Button variant="tertiary">Active</Button>
      <Button variant="tertiary">Focus</Button>
      <Button variant="tertiary" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=tertiary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=tertiary]');
});

test('should have screenshot for Button[thin][variant="tertiary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="tertiary" thin>
        Tertiary
      </Button>
      <Button variant="tertiary" thin>
        Hover
      </Button>
      <Button variant="tertiary" thin>
        Active
      </Button>
      <Button variant="tertiary" thin>
        Focus
      </Button>
      <Button variant="tertiary" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][tertiary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin][tertiary]');
});

test('should have screenshot for Button with leading icon', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary">
        <Icon type="plus" /> Leading Icon
      </Button>
      <Button variant="secondary">
        <Icon type="plus" /> Hover
      </Button>
      <Button variant="secondary">
        <Icon type="plus" /> Active
      </Button>
      <Button variant="secondary">
        <Icon type="plus" /> Focus
      </Button>
      <Button variant="secondary" disabled>
        <Icon type="plus" />
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button-leading-icon');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button-leading-icon');
});

test('should have screenshot for Button with trailing icon', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary">
        Trailing Icon <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary">
        {' '}
        Hover <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary">
        Active <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary">
        Focus <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary" disabled>
        Disabled
        <Icon type="chevron-down" />
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button-trailing-icon');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button-trailing-icon');
});

test('should have screenshot for Button[thin] with leading icon', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary" thin>
        <Icon type="plus" /> Leading Icon
      </Button>
      <Button variant="secondary" thin>
        <Icon type="plus" /> Hover
      </Button>
      <Button variant="secondary" thin>
        <Icon type="plus" /> Active
      </Button>
      <Button variant="secondary" thin>
        <Icon type="plus" /> Focus
      </Button>
      <Button variant="secondary" thin disabled>
        <Icon type="plus" />
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin]-leading-icon');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin]-leading-icon');
});

test('should have screenshot for Button[thin] with trailing icon', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="secondary" thin>
        Trailing Icon <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary" thin>
        {' '}
        Hover <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary" thin>
        Active <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary" thin>
        Focus <Icon type="chevron-down" />{' '}
      </Button>
      <Button variant="secondary" thin disabled>
        Disabled
        <Icon type="chevron-down" />
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin]-trailing-icon');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin]-trailing-icon');
});

test('should have screenshot for Button[variant="error"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="error">Error</Button>
      <Button variant="error">Hover</Button>
      <Button variant="error">Active</Button>
      <Button variant="error">Focus</Button>
      <Button variant="error" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=error]');
});

test('should have screenshot for Button[thin][variant="error"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="error" thin>
        Error
      </Button>
      <Button variant="error" thin>
        Hover
      </Button>
      <Button variant="error" thin>
        Active
      </Button>
      <Button variant="error" thin>
        Focus
      </Button>
      <Button variant="error" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][variant=error]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[thin][variant=error]');
});

test('should have screenshot for Button[variant="danger"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="danger">Danger</Button>
      <Button variant="danger">Hover</Button>
      <Button variant="danger">Active</Button>
      <Button variant="danger">Focus</Button>
      <Button variant="danger" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=danger]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=danger]');
});

test('should have screenshot for Button[thin][variant="danger"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="danger" thin>
        Danger
      </Button>
      <Button variant="danger" thin>
        Hover
      </Button>
      <Button variant="danger" thin>
        Active
      </Button>
      <Button variant="danger" thin>
        Focus
      </Button>
      <Button variant="danger" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[thin][variant=danger]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--button[thin][variant=danger]'
  );
});

test('should have screenshot for Button[variant="danger-secondary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="danger-secondary">Danger</Button>
      <Button variant="danger-secondary">Hover</Button>
      <Button variant="danger-secondary">Active</Button>
      <Button variant="danger-secondary">Focus</Button>
      <Button variant="danger-secondary" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=danger-secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--button[variant=danger-secondary]'
  );
});

test('should have screenshot for Button[thin][variant="danger-secondary"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="danger-secondary" thin>
        Danger
      </Button>
      <Button variant="danger-secondary" thin>
        Hover
      </Button>
      <Button variant="danger-secondary" thin>
        Active
      </Button>
      <Button variant="danger-secondary" thin>
        Focus
      </Button>
      <Button variant="danger-secondary" thin disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot(
    'button[thin][variant=danger-secondary]'
  );
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--button[thin][variant=danger-secondary]'
  );
});

test('should have screenshot for Button[variant="link"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="link">Link</Button>
      <Button variant="link">Hover</Button>
      <Button variant="link">Active</Button>
      <Button variant="link">Focus</Button>
      <Button variant="link" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=link]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=link]');
});

test('should have screenshot for Button[variant="tag"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="tag">Tag</Button>
      <Button variant="tag">Hover</Button>
      <Button variant="tag">Active</Button>
      <Button variant="tag">Focus</Button>
      <Button variant="tag" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=tag]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=tag]');
});

test('should have screenshot for Button[variant="badge"]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Button variant="badge">Badge</Button>
      <Button variant="badge">Hover</Button>
      <Button variant="badge">Active</Button>
      <Button variant="badge">Focus</Button>
      <Button variant="badge" disabled>
        {' '}
        Disabled
      </Button>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('button[variant=badge]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--button[variant=badge]');
});
test('should not wrap text in buttons by default', async ({ mount, page }) => {
  await page.setViewportSize({ height: 600, width: 320 });
  const internalText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

  const component = await mount(
    <div
      className="Button-wrap"
      style={{ display: 'flex', flexDirection: 'column', width: '320px' }}
    >
      <Button variant="primary">{internalText}</Button>
      <Button variant="primary" style={{ minWidth: '10px' }}>
        {internalText}
      </Button>
    </div>
  );
  await expect(component).toHaveScreenshot('button-wrap');
  const buttons = component.getByRole('button');
  const firstButton = buttons.first();
  const firstButtonBoundingBox = await firstButton.boundingBox();
  expect(firstButtonBoundingBox?.height).toBe(36);
  const lastButton = buttons.last();
  const lastButtonBoundingBox = await lastButton.boundingBox();
  expect(lastButtonBoundingBox?.height).toBeGreaterThan(36);
});
