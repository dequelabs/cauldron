import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from '../../axe';
import MenuBar from '../MenuBar';
import { TopBarItem } from '../TopBar';
import * as viewportUtils from '../../utils/viewport';

const [right, left] = [39, 37];
const child = (
  <TopBarItem>
    <div />
  </TopBarItem>
);

test('renders', () => {
  render(<MenuBar>{child}</MenuBar>);
  expect(screen.getByRole('menubar')).toBeTruthy();
});

test('supports falsy children', () => {
  const { container } = render(
    <MenuBar>
      {child}
      {false && child}
    </MenuBar>
  );
  expect(container).toBeTruthy();
  expect(container.querySelectorAll('div').length).toBe(1);
});

test('handles left arrow', async () => {
  render(
    <MenuBar>
      <TopBarItem>test-1</TopBarItem>
      <TopBarItem>test-2</TopBarItem>
      <TopBarItem>test-3</TopBarItem>
    </MenuBar>
  );

  const menuItems = screen.getAllByRole('menuitem');

  fireEvent.keyDown(menuItems[1], { key: 'ArrowLeft', keyCode: left });
  await waitFor(() => {
    expect(menuItems[0]).toHaveFocus();
    expect(document.activeElement).toBe(menuItems[0]);
  });

  fireEvent.keyDown(menuItems[2], { key: 'ArrowLeft', keyCode: left });
  await waitFor(() => {
    expect(menuItems[1]).toHaveFocus();
    expect(document.activeElement).toBe(menuItems[1]);
  });
});

test('handles right arrow', async () => {
  render(
    <MenuBar>
      <TopBarItem>test-1</TopBarItem>
      <TopBarItem>test-2</TopBarItem>
      <TopBarItem>test-3</TopBarItem>
    </MenuBar>
  );

  const menuItems = screen.getAllByRole('menuitem');
  fireEvent.keyDown(menuItems[1], { key: 'ArrowRight', keyCode: right });
  await waitFor(() => {
    expect(menuItems[2]).toHaveFocus();
    expect(document.activeElement).toBe(menuItems[2]);
  });

  fireEvent.keyDown(menuItems[0], { key: 'ArrowRight', keyCode: right });
  await waitFor(() => {
    expect(menuItems[1]).toHaveFocus();
    expect(document.activeElement).toBe(menuItems[1]);
  });
});

test('should pass-through classname', () => {
  const { container } = render(
    <MenuBar className="test">
      <TopBarItem>1</TopBarItem>
    </MenuBar>
  );

  // Assert that the container has the passed className
  expect(container.firstChild).toHaveClass('test');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <MenuBar>
      <TopBarItem>1</TopBarItem>
      <TopBarItem>2</TopBarItem>
      <TopBarItem>3</TopBarItem>
    </MenuBar>
  );

  // Perform accessibility test
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('handles thin state', () => {
  render(
    <MenuBar thin>
      <TopBarItem>1</TopBarItem>
    </MenuBar>
  );

  expect(document.body).toHaveClass('TopBar--thin');
});

test('handles wide state', () => {
  jest.spyOn(viewportUtils, 'isWide').mockReturnValue(true);

  render(
    <MenuBar>
      <TopBarItem>1</TopBarItem>
    </MenuBar>
  );

  expect(document.body).not.toHaveClass('TopBar--thin');
  jest.restoreAllMocks();
});
