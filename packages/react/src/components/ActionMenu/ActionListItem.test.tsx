import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import ActionListItem from './ActionListItem';
import { ActionListProvider } from './ActionListContext';

const withActionListContext =
  (props: Partial<React.ComponentProps<typeof ActionListProvider>>) =>
  ({ children }: React.PropsWithChildren) => (
    <ActionListProvider role="list" selectionType={null} {...props}>
      {children}
    </ActionListProvider>
  );

test('should render item with label', () => {
  render(<ActionListItem>Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(item).toBeInTheDocument();
  expect(item).toHaveClass('ActionListItem');
  expect(within(item).getByText('Label Text')).toBeInTheDocument();
});

test('should render item with leading icon', () => {
  render(<ActionListItem leadingIcon="add-user">Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(
    item.querySelector('.ActionListItem__leadingIcon')
  ).toBeInTheDocument();
});

test('should render item with trailing icon', () => {
  render(
    <ActionListItem trailingIcon="chevron-right">Label Text</ActionListItem>
  );

  const item = screen.getByRole('listitem');
  expect(
    item.querySelector('.ActionListItem__trailingIcon')
  ).toBeInTheDocument();
});

test('should render item with description', () => {
  render(
    <ActionListItem description="This is a description">
      Label Text
    </ActionListItem>
  );

  const description = within(screen.getByRole('listitem')).getByText(
    'This is a description'
  );
  expect(description).toBeInTheDocument();
  expect(description).toHaveClass('ActionListItem__description');
});

test('should support className prop', () => {
  render(<ActionListItem className="custom-class">Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(item).toHaveClass('ActionListItem');
  expect(item).toHaveClass('custom-class');
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLLIElement>();
  render(<ActionListItem ref={ref}>Label Text</ActionListItem>);

  const item = screen.getByRole('listitem');
  expect(ref.current).toBeTruthy();
  expect(ref.current).toEqual(item);
});

// test('should prevent menu closing when selectionType is multiple', () => {
//   const preventDefault = spy();

//   render(
//     <ActionListItem>Label Text</ActionListItem>,
//     { selectionType: 'multiple' }
//   );

//   const event = { preventDefault };
//   const item = screen.getByRole('listitemcheckbox');

//   // Manually trigger the handler since we need to pass our mock event
//   const onClick = item.onclick;
//   onClick(event);

//   expect(preventDefault.calledOnce).toBeTruthy();
// });

// test('should return no axe violations', async () => {
//   render(<ActionListItem>Label Text</ActionListItem>);

//   const item = screen.getByRole('listitem');
//   const results = await axe(item);

//   expect(results).toHaveNoViolations();
// });

// test('should return no axe violations when disabled', async () => {
//   render(<ActionListItem disabled>Label Text</ActionListItem>);

//   const item = screen.getByRole('listitem');
//   const results = await axe(item);

//   expect(results).toHaveNoViolations();
// });

// test('should return no axe violations when selected with single selection type', async () => {
//   render(
//     <ActionListItem selected>Label Text</ActionListItem>,
//     { wrapper: withActionListContext({ role: 'menu', selectionType: 'single' }) }
//   );

//   const item = screen.getByRole('menuitemradio');
//   const results = await axe(item);

//   expect(results).toHaveNoViolations();
// });

// test('should return no axe violations when selected with multiple selection type', async () => {
//   render(
//     <ActionListItem selected>Label Text</ActionListItem>,
//     { wrapper: withActionListContext({ role: 'menu', selectionType: 'multiple' }) }
//   );

//   const item = screen.getByRole('menuitemcheckbox');
//   const results = await axe(item);

//   expect(results).toHaveNoViolations();
// });
