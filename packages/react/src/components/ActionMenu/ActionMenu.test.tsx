import React, { createRef } from 'react';
import {
  act,
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
import {
  ActionList,
  ActionListGroup,
  ActionListItem,
  ActionListLinkItem
} from '../ActionList';
import TopBar, { TopBarItem } from '../TopBar';
import MenuBar from '../MenuBar';

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

// From the pattern documented in docs/pages/components/TopBar.mdx
const defaultTopBarPatternProps: React.ComponentProps<typeof ActionMenu> = {
  ...defaultProps,
  tabIndex: -1,
  renderInTrigger: true,
  trigger: ({ ref, children, ...props }) => (
    // @ts-expect-error - TopBarItem expects menuitems to be <li>, ActionMenu expects triggers to be <button>
    <TopBarItem menuItemRef={ref} tabIndex={0} autoClickLink={false} {...props}>
      Trigger
      {children}
    </TopBarItem>
  ),
  children: (
    <ActionList>
      <ActionListLinkItem href="#target-1">Menu Link 1</ActionListLinkItem>
      <ActionListLinkItem href="#target-2">Menu Link 2</ActionListLinkItem>
      <ActionListLinkItem href="#target-3">Menu Link 3</ActionListLinkItem>
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

test('should tab to next element when using action list items', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ActionMenu {...defaultProps}>
        <ActionList>
          <ActionListItem>Item 1</ActionListItem>
          <ActionListItem>Item 2</ActionListItem>
          <ActionListItem>Item 3</ActionListItem>
        </ActionList>
      </ActionMenu>
      <button>Tab to me</button>
    </>
  );

  const menuTriggerButton = screen.getByRole('button', { name: 'Trigger' });
  const tabButton = screen.getByRole('button', { name: 'Tab to me' });
  await user.click(menuTriggerButton);

  await user.keyboard('{Tab}');

  await waitFor(() => {
    expect(tabButton).toHaveFocus();
  });
});

test('should tab to next element when using single select action list items', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ActionMenu {...defaultProps}>
        <ActionList selectionType="single">
          <ActionListItem selected>Item 1</ActionListItem>
          <ActionListItem>Item 2</ActionListItem>
          <ActionListItem>Item 3</ActionListItem>
        </ActionList>
      </ActionMenu>
      <button>Tab to me</button>
    </>
  );

  const menuTriggerButton = screen.getByRole('button', { name: 'Trigger' });
  const tabButton = screen.getByRole('button', { name: 'Tab to me' });
  await user.click(menuTriggerButton);

  await user.keyboard('{Tab}');

  await waitFor(() => {
    expect(tabButton).toHaveFocus();
  });
});

test('should tab to next element when using multi select action list items', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ActionMenu {...defaultProps}>
        <ActionList selectionType="multiple">
          <ActionListItem selected>Item 1</ActionListItem>
          <ActionListItem selected>Item 2</ActionListItem>
          <ActionListItem>Item 3</ActionListItem>
        </ActionList>
      </ActionMenu>
      <button>Tab to me</button>
    </>
  );

  const menuTriggerButton = screen.getByRole('button', { name: 'Trigger' });
  const tabButton = screen.getByRole('button', { name: 'Tab to me' });
  await user.click(menuTriggerButton);

  await user.keyboard('{Tab}');

  await waitFor(() => {
    expect(tabButton).toHaveFocus();
  });
});

test('should tab to next element when using action link items', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ActionMenu {...defaultProps}>
        <ActionList>
          <ActionListLinkItem href="#">Item 1</ActionListLinkItem>
          <ActionListLinkItem href="#">Item 2</ActionListLinkItem>
          <ActionListLinkItem href="#">Item 3</ActionListLinkItem>
        </ActionList>
      </ActionMenu>
      <button>Tab to me</button>
    </>
  );

  const menuTriggerButton = screen.getByRole('button', { name: 'Trigger' });
  const tabButton = screen.getByRole('button', { name: 'Tab to me' });
  await user.click(menuTriggerButton);

  await user.keyboard('{Tab}');

  await waitFor(() => {
    expect(tabButton).toHaveFocus();
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

test('should set matching active item on mnemonic key press', async () => {
  const user = userEvent.setup();
  render(
    <ActionMenu {...defaultProps}>
      <ActionList>
        <ActionListItem>Apple</ActionListItem>
        <ActionListItem>Banana</ActionListItem>
        <ActionListItem>Peach</ActionListItem>
        <ActionListItem disabled>Pear</ActionListItem>
        <ActionListItem>Apricot</ActionListItem>
      </ActionList>
    </ActionMenu>
  );

  const triggerButton = screen.getByRole('button', { name: 'Trigger' });

  triggerButton.focus();
  await user.keyboard('{ArrowDown}');

  // Apricot Active
  await user.keyboard('a');
  await waitFor(() => {
    expect(screen.queryAllByRole('menuitem')[4]).toHaveClass(
      'ActionListItem--active'
    );
  });

  // Apple Active
  await user.keyboard('a');
  await waitFor(() => {
    expect(screen.queryAllByRole('menuitem')[0]).toHaveClass(
      'ActionListItem--active'
    );
  });

  // Peach Active
  await user.keyboard('p');
  await waitFor(() => {
    expect(screen.queryAllByRole('menuitem')[2]).toHaveClass(
      'ActionListItem--active'
    );
  });

  // Pear Active
  await user.keyboard('p');
  await waitFor(() => {
    expect(screen.queryAllByRole('menuitem')[3]).toHaveClass(
      'ActionListItem--active'
    );
  });
});

// Regression test for cauldron#1993
test('should set first item active on open in TopBar+ActionMenu pattern', async () => {
  const user = userEvent.setup();
  render(
    <TopBar>
      <MenuBar>
        <ActionMenu {...defaultTopBarPatternProps} />
      </MenuBar>
    </TopBar>
  );

  await user.click(screen.getByRole('menuitem', { name: 'Trigger' }));

  await waitFor(() => {
    expect(screen.queryByRole('menuitem', { name: 'Menu Link 1' })).toHaveClass(
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

// Regression test for cauldron#1993
test('should not trigger action link items when toggling the open state in TopBar+ActionMenu pattern', async () => {
  const user = userEvent.setup();
  render(
    <TopBar>
      <MenuBar>
        <ActionMenu {...defaultTopBarPatternProps} />
      </MenuBar>
    </TopBar>
  );

  await user.click(screen.getByRole('menuitem', { name: 'Trigger' }));
  await user.click(screen.getByRole('menuitem', { name: 'Trigger' }));

  expect(window.location.hash).toBe('');
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

test('should support renderInTrigger prop', async () => {
  render(
    <ActionMenu
      {...defaultProps}
      data-testid="actionmenu"
      renderInTrigger={true}
      trigger={({ children }) => <button>Trigger{children}</button>}
    />
  );

  const actionMenu = screen.getByTestId('actionmenu');
  const trigger = screen.getByRole('button', { name: 'Trigger' });
  expect(trigger).toContainElement(actionMenu);
});

test('should not render menu inside trigger by default', async () => {
  render(
    <ActionMenu
      {...defaultProps}
      data-testid="actionmenu"
      /* omitting renderInTrigger */
      trigger={() => <button>Trigger</button>}
    />
  );

  const actionMenu = screen.getByTestId('actionmenu');
  const trigger = screen.getByRole('button', { name: 'Trigger' });
  expect(trigger).not.toContainElement(actionMenu);
});

test('should have no axe violations', async () => {
  const { container } = render(<ActionMenu {...defaultProps} />);

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

test('should have no axe violations when open', async () => {
  const user = userEvent.setup();
  const { container } = render(<ActionMenu {...defaultProps} />);

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  expect(await screen.findByRole('menu')).toBeVisible();

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
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

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
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

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
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

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

test('should have no axe violations in TopBar+ActionMenu pattern', async () => {
  const { container } = render(
    <TopBar>
      <MenuBar>
        <ActionMenu {...defaultTopBarPatternProps} />
      </MenuBar>
    </TopBar>
  );

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

test('should have no axe violations in TopBar+ActionMenu pattern when open', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <TopBar>
      <MenuBar>
        <ActionMenu {...defaultTopBarPatternProps} />
      </MenuBar>
    </TopBar>
  );

  await user.click(screen.getByRole('menuitem', { name: 'Trigger' }));
  expect(await screen.findByRole('menu')).toBeVisible();

  await act(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
