/**
 * Escape should close one layer at a time, innermost first.
 * See https://github.com/dequelabs/cauldron/issues/2567
 */
import React, { useRef, useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Combobox, { ComboboxOption } from '../components/Combobox';
import Drawer from '../components/Drawer';
import Modal, { ModalContent } from '../components/Modal';
import AnchoredOverlay from '../components/AnchoredOverlay';
import Popover from '../components/Popover';
import TwoColumnPanel, {
  ColumnLeft,
  ColumnRight
} from '../components/TwoColumnPanel';
import TooltipTabstop from '../components/TooltipTabstop';
import OptionsMenu, { OptionsMenuItem } from '../components/OptionsMenu';

type ContainerProps = {
  children: React.ReactNode;
  onClose: () => void;
};

/** Open on mount; closing reports to `onClose`. */
const useClosable = (onClose: () => void): [boolean, () => void] => {
  const [open, setOpen] = useState(true);
  return [
    open,
    () => {
      onClose();
      setOpen(false);
    }
  ];
};

const DrawerContainer = ({ children, onClose }: ContainerProps) => {
  const [open, close] = useClosable(onClose);
  return (
    <Drawer position="left" open={open} onClose={close}>
      {children}
    </Drawer>
  );
};

const ModalContainer = ({ children, onClose }: ContainerProps) => {
  const [open, close] = useClosable(onClose);
  return (
    <Modal heading="Modal" show={open} onClose={close}>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};

const AnchoredOverlayContainer = ({ children, onClose }: ContainerProps) => {
  const targetRef = useRef<HTMLButtonElement>(null);
  const [open, close] = useClosable(onClose);
  return (
    <>
      <button ref={targetRef}>target</button>
      <AnchoredOverlay target={targetRef} open={open} onOpenChange={close}>
        {open ? children : null}
      </AnchoredOverlay>
    </>
  );
};

const PopoverContainer = ({ children, onClose }: ContainerProps) => {
  const targetRef = useRef<HTMLButtonElement>(null);
  const [open, close] = useClosable(onClose);
  return (
    <>
      <button ref={targetRef}>target</button>
      <Popover
        variant="custom"
        aria-label="Popover"
        target={targetRef}
        show={open}
        onClose={close}
      >
        {children}
      </Popover>
    </>
  );
};

const TwoColumnPanelContainer = ({
  children
}: Pick<ContainerProps, 'children'>) => (
  <TwoColumnPanel data-testid="two-column-panel">
    <ColumnLeft aria-label="Sidebar">{children}</ColumnLeft>
    <ColumnRight aria-label="Content">
      <p>Content</p>
    </ColumnRight>
  </TwoColumnPanel>
);

const containers: Array<
  [string, (props: ContainerProps) => React.JSX.Element]
> = [
  ['Drawer', DrawerContainer],
  ['Modal', ModalContainer],
  ['AnchoredOverlay', AnchoredOverlayContainer],
  ['Popover', PopoverContainer]
];

const renderCombobox = () => (
  <Combobox label="Fruit">
    <ComboboxOption>Apple</ComboboxOption>
    <ComboboxOption>Banana</ComboboxOption>
  </Combobox>
);

// `hidden: true` because a container that wrongly closes hides its content,
// and we want the assertion on the container to report the failure.
const isListboxOpen = () =>
  screen
    .getByRole('combobox', { hidden: true })
    .getAttribute('aria-expanded') === 'true';

describe.each(containers)('%s', (_name, Container) => {
  test('Escape closes an open Combobox list before the container', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<Container onClose={onClose}>{renderCombobox()}</Container>);

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{ArrowDown}');
    expect(isListboxOpen()).toBe(true);

    await user.keyboard('{Escape}');
    expect(isListboxOpen()).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
    expect(combobox).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Escape closes a hovered Tooltip before the container', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Container onClose={onClose}>
        <TooltipTabstop tooltip="Hello Tooltip">show tooltip</TooltipTabstop>
      </Container>
    );

    await user.hover(
      screen.getByRole('button', { name: /show tooltip/i, hidden: true })
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('tooltip', { hidden: true })
    ).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('Escape closes an OptionsMenu before the container', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Container onClose={onClose}>
        <OptionsMenu trigger={(props) => <button {...props}>Options</button>}>
          <OptionsMenuItem onSelect={jest.fn()}>One</OptionsMenuItem>
        </OptionsMenu>
      </Container>
    );

    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menu')).toBeVisible();

    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('TwoColumnPanel (narrow screen)', () => {
  // every media query matches, so the panel uses its narrow-screen layout
  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
    const toggle = screen.getByRole('button', { name: 'Show Panel' });
    await user.click(toggle);
    await waitFor(() =>
      expect(screen.getByTestId('two-column-panel')).toHaveClass(
        'TwoColumnPanel--show'
      )
    );
    // Move the pointer off the toggle so its own tooltip closes; otherwise
    // that tooltip would rightly take the first Escape.
    await user.unhover(toggle);
    await waitFor(() =>
      expect(document.querySelector('.Tooltip:not(.Tooltip--hidden)')).toBe(
        null
      )
    );
  };

  const isPanelCollapsed = () =>
    screen
      .getByTestId('two-column-panel')
      .classList.contains('TwoColumnPanel--hide');

  test('Escape closes an open Combobox list before the left column', async () => {
    const user = userEvent.setup();
    render(
      <TwoColumnPanelContainer>{renderCombobox()}</TwoColumnPanelContainer>
    );
    await openPanel(user);

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.keyboard('{ArrowDown}');
    expect(isListboxOpen()).toBe(true);

    await user.keyboard('{Escape}');
    expect(isListboxOpen()).toBe(false);
    expect(isPanelCollapsed()).toBe(false);

    await user.keyboard('{Escape}');
    expect(isPanelCollapsed()).toBe(true);
  });

  test('Escape closes a hovered Tooltip before the left column', async () => {
    const user = userEvent.setup();
    render(
      <TwoColumnPanelContainer>
        <TooltipTabstop tooltip="Hello Tooltip">show tooltip</TooltipTabstop>
      </TwoColumnPanelContainer>
    );
    await openPanel(user);

    await user.hover(
      screen.getByRole('button', { name: /show tooltip/i, hidden: true })
    );
    expect(
      screen.getByRole('tooltip', { name: 'Hello Tooltip' })
    ).toBeVisible();

    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('tooltip', { name: 'Hello Tooltip' })
    ).not.toBeInTheDocument();
    expect(isPanelCollapsed()).toBe(false);
  });
});

describe('nested containers', () => {
  const PopoverInDrawer = ({
    onDrawerClose,
    onPopoverClose
  }: {
    onDrawerClose: () => void;
    onPopoverClose: () => void;
  }) => {
    const targetRef = useRef<HTMLButtonElement>(null);
    const [show, setShow] = useState(false);
    return (
      <DrawerContainer onClose={onDrawerClose}>
        <button ref={targetRef} onClick={() => setShow(true)}>
          open popover
        </button>
        <Popover
          variant="custom"
          aria-label="Popover"
          target={targetRef}
          show={show}
          onClose={() => {
            onPopoverClose();
            setShow(false);
          }}
        >
          <button>inside popover</button>
        </Popover>
      </DrawerContainer>
    );
  };

  test('Escape closes a Popover inside a Drawer before the Drawer', async () => {
    const user = userEvent.setup();
    const onDrawerClose = jest.fn();
    const onPopoverClose = jest.fn();
    render(
      <PopoverInDrawer
        onDrawerClose={onDrawerClose}
        onPopoverClose={onPopoverClose}
      />
    );

    act(() =>
      screen.getByRole('button', { name: 'open popover', hidden: true }).focus()
    );
    await user.keyboard('{Enter}');
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'inside popover', hidden: true })
      ).toHaveFocus()
    );

    await user.keyboard('{Escape}');
    expect(onPopoverClose).toHaveBeenCalledTimes(1);
    expect(onDrawerClose).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
  });
});
