import React, { createRef } from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  createEvent,
  findByTestId
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ActionMenu from './ActionMenu';
import { ActionList, ActionListGroup, ActionListItem } from '../ActionList';

const defaultProps: React.ComponentProps<typeof ActionMenu> = {
  trigger: <button>Trigger</button>,
  children: (
    <ActionList>
      <ActionListItem>Item 1</ActionListItem>
      <ActionListItem>Item 2</ActionListItem>
      <ActionListItem>Item 3</ActionListItem>
    </ActionList>
  )
};

test('should render trigger button', () => {
  render(<ActionMenu {...defaultProps} />);
  expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
});

test('should render trigger function', async () => {
  const user = userEvent.setup();
  render(
    <ActionMenu
      trigger={(props, open) => (
        <button {...props} data-testid="trigger-button">
          Menu ({open ? 'Open' : 'Closed'})
        </button>
      )}
    >
      <ActionList>
        <ActionListItem>Item 1</ActionListItem>
        <ActionListItem>Item 2</ActionListItem>
        <ActionListItem>Item 3</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  expect(screen.getByTestId('trigger-button')).toHaveAccessibleName(
    'Menu (Closed)'
  );
  await user.click(screen.getByTestId('trigger-button'));
  expect(screen.getByTestId('trigger-button')).toHaveAccessibleName(
    'Menu (Open)'
  );
});

test('should not render menu when closed', () => {
  render(<ActionMenu {...defaultProps} />);
  const menu = screen.queryByRole('menu', { hidden: true });
  expect(menu).not.toBeVisible();
});

test('should render menu when trigger is clicked', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  const trigger = screen.getByRole('button', { name: 'Trigger' });
  const menu = screen.queryByRole('menu', { hidden: true });

  await user.click(trigger);
  await waitFor(() => {
    expect(screen.queryByRole('menu')).toBeVisible();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toHaveAccessibleName('Trigger');
  });

  const menuItems = screen.getAllByRole('menuitem');
  expect(menuItems).toHaveLength(3);
  expect(menuItems[0]).toHaveAccessibleName('Item 1');
  expect(menuItems[1]).toHaveAccessibleName('Item 2');
  expect(menuItems[2]).toHaveAccessibleName('Item 3');
});

test('should focus menu when opened', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await waitFor(() => {
    expect(screen.getByRole('menu')).toHaveFocus();
  });
});

test('should return focus to trigger when closed', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  const button = screen.getByRole('button', { name: 'Trigger' });
  await user.click(button);
  await user.keyboard('{Escape}');

  await waitFor(() => {
    expect(button).toHaveFocus();
  });
});

test('should close menu when an action list item is selected', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await user.click(screen.getByText('Item 2'));

  expect(await screen.findByRole('menu', { hidden: true })).not.toBeVisible();
});

test('should close menu when clicked outside', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await user.click(document.body);

  expect(await screen.findByRole('menu', { hidden: true })).not.toBeVisible();
});

test('should close menu on escape keypress', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await user.keyboard('{Escape}');

  expect(await screen.findByRole('menu', { hidden: true })).not.toBeVisible();
});

test('should open menu on arrow down key press', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  const triggerButton = screen.getByRole('button', { name: 'Trigger' });

  triggerButton.focus();
  await user.keyboard('{ArrowDown}');

  expect(await screen.findByRole('menu')).toBeVisible();
});

test('should set first item active on arrow down key press', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  const triggerButton = screen.getByRole('button', { name: 'Trigger' });

  triggerButton.focus();
  await user.keyboard('{ArrowDown}');

  await waitFor(() => {
    expect(screen.queryAllByRole('menuitem')[0]).toHaveClass(
      'ActionListItem--active'
    );
  });
});

test('should set last item active on arrow up key press', async () => {
  const user = userEvent.setup();
  render(<ActionMenu {...defaultProps} />);

  const triggerButton = screen.getByRole('button', { name: 'Trigger' });

  triggerButton.focus();
  await user.keyboard('{ArrowUp}');

  await waitFor(() => {
    expect(screen.queryAllByRole('menuitem')[2]).toHaveClass(
      'ActionListItem--active'
    );
  });
});

test('should trigger onAction when an action list item is clicked', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList onAction={onAction}>
        <ActionListItem>One</ActionListItem>
        <ActionListItem>Two</ActionListItem>
        <ActionListItem>Three</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: 'One' }));

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('One', expect.anything());
  });
});

test('should trigger onAction when an action list item has actionKey and is clicked', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList onAction={onAction}>
        <ActionListItem actionKey="apple">🍎</ActionListItem>
        <ActionListItem actionKey="banana">🍌</ActionListItem>
        <ActionListItem actionKey="cantaloupe">🍈</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: '🍎' }));

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('apple', expect.anything());
  });
});

test('should trigger onAction when an action list item is clicked with keypress', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList onAction={onAction}>
        <ActionListItem>One</ActionListItem>
        <ActionListItem>Two</ActionListItem>
        <ActionListItem>Three</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('One', expect.anything());
  });
});

test('should trigger group onAction when an action list item is clicked', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  const notCalledOnAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListGroup label="Group One" onAction={onAction}>
          <ActionListItem>One</ActionListItem>
          <ActionListItem>Two</ActionListItem>
          <ActionListItem>Three</ActionListItem>
        </ActionListGroup>
        <ActionListGroup label="Group Two">
          <ActionListItem>Three</ActionListItem>
          <ActionListItem>Four</ActionListItem>
          <ActionListItem>Five</ActionListItem>
        </ActionListGroup>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: 'One' }));

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('One', expect.anything());
    expect(notCalledOnAction).not.toHaveBeenCalled();
  });
});

test('should trigger onAction when an action list item has actionKey and is clicked', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListGroup label="Group One" onAction={onAction}>
          <ActionListItem actionKey="apple">🍎</ActionListItem>
          <ActionListItem actionKey="banana">🍌</ActionListItem>
          <ActionListItem actionKey="cantaloupe">🍈</ActionListItem>
        </ActionListGroup>
        <ActionListGroup label="Group Two">
          <ActionListItem actionKey="dragonfruit">🐉</ActionListItem>
          <ActionListItem actionKey="elderberry">🫐</ActionListItem>
          <ActionListItem actionKey="kiwi">🥝</ActionListItem>
        </ActionListGroup>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: '🍎' }));

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('apple', expect.anything());
  });
});

test('should trigger group onAction when an action list item is clicked with keypress', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  const notCalledOnAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListGroup label="Group One" onAction={onAction}>
          <ActionListItem>One</ActionListItem>
          <ActionListItem>Two</ActionListItem>
          <ActionListItem>Three</ActionListItem>
        </ActionListGroup>
        <ActionListGroup label="Group Two">
          <ActionListItem>Three</ActionListItem>
          <ActionListItem>Four</ActionListItem>
          <ActionListItem>Five</ActionListItem>
        </ActionListGroup>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledWith('One', expect.anything());
    expect(notCalledOnAction).not.toHaveBeenCalled();
  });
});

test('should trigger item onAction when an action list item is clicked', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListItem onAction={onAction}>One</ActionListItem>
        <ActionListItem>Two</ActionListItem>
        <ActionListItem>Three</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: 'One' }));
  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await user.click(screen.getByRole('menuitem', { name: 'Two' }));

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

test('should trigger item onAction when an action list item is clicked with keypress', async () => {
  const user = userEvent.setup();
  const onAction = jest.fn();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListItem onAction={onAction}>One</ActionListItem>
        <ActionListItem>Two</ActionListItem>
        <ActionListItem>Three</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(onAction).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');
  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await user.keyboard('{ArrowDown}');
  await user.keyboard('{Enter}');

  await waitFor(() => {
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

test('should stop menu from opening if event is default prevented', () => {
  render(<ActionMenu {...defaultProps} />);

  const trigger = screen.getByRole('button', { name: 'Trigger' });
  const menu = screen.queryByRole('menu', { hidden: true });

  trigger.focus();
  const event = createEvent.click(trigger);
  event.preventDefault();
  fireEvent(trigger, event);

  expect(menu).not.toBeVisible();
});

test('should support className prop', () => {
  render(
    <ActionMenu
      data-testid="actionmenu"
      className="bananas"
      {...defaultProps}
    />
  );
  expect(screen.getByTestId('actionmenu')).toHaveClass('ActionMenu', 'bananas');
});

test('should support ref prop', () => {
  const ref = createRef<HTMLDivElement>();
  render(<ActionMenu ref={ref} data-testid="actionmenu" {...defaultProps} />);

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.getByTestId('actionmenu'));
});

test('should support portal prop', async () => {
  const portal = document.createElement('div');

  render(
    <ActionMenu portal={portal} data-testid="actionmenu" {...defaultProps} />
  );

  const actionMenuInPortal = await findByTestId(portal, 'actionmenu');
  expect(actionMenuInPortal).toBeTruthy();
});

test('should have no axe violations', async () => {
  const { container } = render(<ActionMenu {...defaultProps} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when open', async () => {
  const user = userEvent.setup();
  const { container } = render(<ActionMenu {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(await screen.findByRole('menu')).toBeVisible();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when open with groups', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListGroup label="Group Label">
          <ActionListItem>Group Item 1</ActionListItem>
          <ActionListItem>Group Item 2</ActionListItem>
          <ActionListItem>Group Item 3</ActionListItem>
        </ActionListGroup>
        <ActionListItem>Item 1</ActionListItem>
        <ActionListItem>Item 2</ActionListItem>
        <ActionListItem>Item 3</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(await screen.findByRole('menu')).toBeVisible();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when open with selections', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <ActionMenu {...defaultProps}>
      <ActionList selectionType="single">
        <ActionListGroup label="Single Selections" selectionType="single">
          <ActionListItem>Single Item 1</ActionListItem>
          <ActionListItem selected>Single Item 2</ActionListItem>
          <ActionListItem disabled>Single Item 3</ActionListItem>
        </ActionListGroup>
        <ActionListGroup label="Multiple Selections" selectionType="multiple">
          <ActionListItem>Multiple Item 1</ActionListItem>
          <ActionListItem selected>Multiple Item 2</ActionListItem>
          <ActionListItem disabled>Multiple Item 3</ActionListItem>
        </ActionListGroup>
        <ActionListItem>Item 1</ActionListItem>
        <ActionListItem selected>Item 2</ActionListItem>
        <ActionListItem disabled>Item 3</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(await screen.findByRole('menu')).toBeVisible();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should have no axe violations when open with descriptions', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListGroup label="Single Selections" selectionType="single">
          <ActionListItem description="description">
            Single Item 1
          </ActionListItem>
          <ActionListItem description="description" selected>
            Single Item 2
          </ActionListItem>
          <ActionListItem description="description" disabled>
            Single Item 3
          </ActionListItem>
        </ActionListGroup>
        <ActionListGroup label="Multiple Selections" selectionType="multiple">
          <ActionListItem description="description">
            Multiple Item 1
          </ActionListItem>
          <ActionListItem description="description" selected>
            Multiple Item 2
          </ActionListItem>
          <ActionListItem description="description" disabled>
            Multiple Item 3
          </ActionListItem>
        </ActionListGroup>
        <ActionListItem description="description">Item 1</ActionListItem>
        <ActionListItem description="description" selected>
          Item 2
        </ActionListItem>
        <ActionListItem description="description" disabled>
          Item 3
        </ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(await screen.findByRole('menu')).toBeVisible();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
