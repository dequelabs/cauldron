import React from 'react';
import { test, expect } from '../../../../../e2e/screenshots';
import { setTheme } from '../../../../../e2e/helpers/playwright';
import { Toast } from '../../../';

/*
 * All Toast instances use style={{ opacity: 1 }} to bypass the FadeIn CSS
 * transition (transition: opacity 400ms). Playwright's "disable CSS animations"
 * only disables @keyframes, not transitions, so the transition can be frozen
 * at different opacity values between runs. The inline style overrides the
 * class-based opacity, ensuring a deterministic fully-opaque screenshot.
 *
 * focus={false} is used on variant tests to suppress the auto-focus outline
 * that would appear in the screenshot when focus={true} (the default).
 */

test('should have screenshot for Toast[type="confirmation"]', async ({
  mount,
  page
}) => {
  await mount(
    <Toast type="confirmation" show focus={false} style={{ opacity: 1 }}>
      Your changes have been saved.
    </Toast>
  );

  await expect(page).toHaveScreenshot('toast-confirmation');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-confirmation');
});

test('should have screenshot for Toast[type="caution"]', async ({
  mount,
  page
}) => {
  await mount(
    <Toast type="caution" show focus={false} style={{ opacity: 1 }}>
      Please review your input before continuing.
    </Toast>
  );

  await expect(page).toHaveScreenshot('toast-caution');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-caution');
});

test('should have screenshot for Toast[type="error"]', async ({
  mount,
  page
}) => {
  await mount(
    <Toast type="error" show focus={false} style={{ opacity: 1 }}>
      An error occurred. Please try again.
    </Toast>
  );

  await expect(page).toHaveScreenshot('toast-error');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-error');
});

test('should have screenshot for Toast[type="info"]', async ({
  mount,
  page
}) => {
  await mount(
    <Toast type="info" show focus={false} style={{ opacity: 1 }}>
      Here is some useful information.
    </Toast>
  );

  await expect(page).toHaveScreenshot('toast-info');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-info');
});

test('should have screenshot for Toast[type="action-needed"]', async ({
  mount,
  page
}) => {
  await mount(
    <Toast type="action-needed" show focus={false} style={{ opacity: 1 }}>
      Action required: please confirm your identity.
    </Toast>
  );

  await expect(page).toHaveScreenshot('toast-action-needed');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-action-needed');
});

test('should have screenshot for Toast[dismissible=false]', async ({
  mount,
  page
}) => {
  await mount(
    <Toast
      type="info"
      show
      focus={false}
      dismissible={false}
      style={{ opacity: 1 }}
    >
      This notification cannot be dismissed.
    </Toast>
  );

  await expect(page).toHaveScreenshot('toast-non-dismissible');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-non-dismissible');
});

test('should have screenshot for Toast with long content on a small viewport', async ({
  mount,
  page
}) => {
  /*
   * Tests the a11y fix: on a small viewport, long toast content must be
   * scrollable while the icon and dismiss button remain visible.
   * The toast is fixed-position so we use page.getByTestId() to locate it.
   */
  await page.setViewportSize({ width: 375, height: 200 });

  await mount(
    <Toast type="info" show focus={false} style={{ opacity: 1 }}>
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i}>
          This is a long toast message that should scroll within the fixed
          height.
        </p>
      ))}
    </Toast>
  );

  // The dismiss button must remain visible when content overflows
  const dismissButton = page.getByRole('button', { name: 'Dismiss' });
  await expect(dismissButton).toBeVisible();

  await expect(page).toHaveScreenshot('toast-long-content-small-viewport');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot(
    'dark--toast-long-content-small-viewport'
  );
});

test('should have screenshot for Toast in TopBar--thin context with long content', async ({
  mount,
  page
}) => {
  /*
   * Tests that the thin TopBar variant correctly caps the toast height using
   * --top-bar-height-thin instead of --top-bar-height.
   * The CSS variable is set inline on the wrapper to guarantee it is defined
   * regardless of whether variables.css has fully loaded in the test harness.
   */
  await page.setViewportSize({ width: 375, height: 200 });

  await mount(
    <div
      className="TopBar--thin"
      style={{ '--top-bar-height-thin': '43px' } as React.CSSProperties}
    >
      <Toast type="info" show focus={false} style={{ opacity: 1 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            This is a long toast message in the thin TopBar context.
          </p>
        ))}
      </Toast>
    </div>
  );

  // The dismiss button must remain visible when content overflows
  const dismissButton = page.getByRole('button', { name: 'Dismiss' });
  await expect(dismissButton).toBeVisible();

  await expect(page).toHaveScreenshot('toast-topbar-thin-long-content');
  await setTheme(page, 'dark');
  await expect(page).toHaveScreenshot('dark--toast-topbar-thin-long-content');
});
