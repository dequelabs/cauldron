# E2E Tests

## Accessibility

axe-core is automatically run against Cauldron documentation with [axe-puppeteer](https://www.npmjs.com/package/@axe-core/puppeteer). Each link in the navigation is visited and automatic scans are run against that page for both light and dark themes for WCAG 2.2 AA.

## Snapshot Testing

Snapshot testing uses [playwright](https://playwright.dev/) and [component testing](https://playwright.dev/docs/test-components) to capture screenshots of components in different states for both light and dark themes.

In order to generate consistent testing across platforms, Docker is used to run playwright and run the screenshot comparison tests. To update or generate the docker image, run:

```sh
yarn screenshots:docker
```

To update existing snapshots run:

```sh
npm run screenshots --update-screenshots
```

Finally, to run screenshot comparison tests run:

```sh
yarn screenshots
```

### Testing Components

Component testing is done in [`screenshots.test.tsx`](./screenshots.test.tsx). Non-interactive components can render a single component for screenshots:

```tsx
const component = await mount(<Component prop="a" variant="b" />);
```

There are additional helpers available under [`e2e/helpers`](./helpers/playwright.ts) for things like setting the current Cauldron theme. In order to provide sufficient coverage, components should have snapshots for both light and dark Cauldron themes:

```tsx
await expect(component).toHaveScreenshot('component');
await setTheme(page, 'dark');
await expect(component).toHaveScreenshot('dark--component');
```

For interactive components, remember to test all the different states (focus, hover, disabled, etc):

```tsx
const component = await mount(
  <div>
    <Button>Button</Button>
    <Button>Hover</Button>
    <Button>Active</Button>
    <Button>Focus</Button>
    <Button disabled>Disabled</Button>
  </div>
);

await component.getByText('Hover').hover();
setActive(await component.getByText('Active'));
await component.getByText('Focus').focus();
```
