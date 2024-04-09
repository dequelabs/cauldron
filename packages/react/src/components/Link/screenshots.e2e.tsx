import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setActive, setTheme } from '../../../../../e2e/helpers/playwright';
import { Link } from '../../../';

test('should have screenshot for Link', async ({ mount, page }) => {
  const component = await mount(
    <div>
      <Link href="http://acme.biz">Link</Link>
      <Link href="http://acme.biz">Hover</Link>
      <Link href="http://acme.biz">Focus</Link>
    </div>
  );

  await component.getByText('Hover').hover();
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('link');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--link');
});

test('should have screenshot for Link[variant=button]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Link href="http://acme.biz" variant="button">
        Link
      </Link>
      <Link href="http://acme.biz" variant="button">
        Hover
      </Link>
      <Link href="http://acme.biz" variant="button">
        Active
      </Link>
      <Link href="http://acme.biz" variant="button">
        Focus
      </Link>
      <Link
        href="http://acme.biz"
        variant="button-secondary"
        aria-disabled="true"
      >
        Disabled
      </Link>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('link[variant=button]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot('dark--link[variant=button]');
});

test('should have screenshot for Link[variant=button-secondary]', async ({
  mount,
  page
}) => {
  const component = await mount(
    <div>
      <Link href="http://acme.biz" variant="button-secondary">
        Link
      </Link>
      <Link href="http://acme.biz" variant="button-secondary">
        Hover
      </Link>
      <Link href="http://acme.biz" variant="button-secondary">
        Active
      </Link>
      <Link href="http://acme.biz" variant="button-secondary">
        Focus
      </Link>
      <Link
        href="http://acme.biz"
        variant="button-secondary"
        aria-disabled="true"
      >
        Disabled
      </Link>
    </div>
  );

  await component.getByText('Hover').hover();
  setActive(await component.getByText('Active'));
  await component.getByText('Focus').focus();

  await expect(component).toHaveScreenshot('link[variant=button-secondary]');
  await setTheme(page, 'dark');
  await expect(component).toHaveScreenshot(
    'dark--link[variant=button-secondary]'
  );
});
