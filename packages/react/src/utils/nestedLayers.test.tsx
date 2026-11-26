/**
 * Overlays portaled out of a container (Popover, Tooltip, menus, a portaled
 * Combobox list, a nested Modal) still belong to it: clicks, focus and
 * screen reader isolation treat them as inside.
 */
import React, { useRef, useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Combobox, { ComboboxOption } from '../components/Combobox';
import Drawer from '../components/Drawer';
import Modal, { ModalContent } from '../components/Modal';
import AnchoredOverlay from '../components/AnchoredOverlay';
import Popover from '../components/Popover';
import TooltipTabstop from '../components/TooltipTabstop';

const PopoverInDrawer = ({ onDrawerClose }: { onDrawerClose: () => void }) => {
  const targetRef = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  return (
    <Drawer position="left" open onClose={onDrawerClose}>
      <button ref={targetRef} onClick={() => setShow(true)}>
        open popover
      </button>
      <Popover
        variant="custom"
        aria-label="Popover"
        target={targetRef}
        show={show}
        onClose={() => setShow(false)}
      >
        <button>inside popover</button>
        <TooltipTabstop tooltip="Hello Tooltip">show tooltip</TooltipTabstop>
      </Popover>
    </Drawer>
  );
};

const OverlayInModal = () => {
  const targetRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <Modal heading="Modal" show onClose={() => null}>
      <ModalContent>
        <button ref={targetRef} onClick={() => setOpen(true)}>
          open overlay
        </button>
        <AnchoredOverlay target={targetRef} open={open} onOpenChange={setOpen}>
          <button>inside overlay</button>
        </AnchoredOverlay>
      </ModalContent>
    </Modal>
  );
};

const ModalInDrawer = ({ onDrawerClose }: { onDrawerClose: () => void }) => {
  const [show, setShow] = useState(false);
  return (
    <Drawer position="left" open onClose={onDrawerClose}>
      <button onClick={() => setShow(true)}>open modal</button>
      <Modal heading="Nested modal" show={show} onClose={() => setShow(false)}>
        <ModalContent>
          <button>inside modal</button>
        </ModalContent>
      </Modal>
    </Drawer>
  );
};

describe('click outside', () => {
  test('a click inside a Popover does not close the Drawer around it', async () => {
    const user = userEvent.setup();
    const onDrawerClose = jest.fn();
    render(<PopoverInDrawer onDrawerClose={onDrawerClose} />);

    await user.click(screen.getByRole('button', { name: 'open popover' }));
    await user.click(
      screen.getByRole('button', { name: 'inside popover', hidden: true })
    );
    expect(onDrawerClose).not.toHaveBeenCalled();
  });

  test('a click inside a nested Modal does not close the Drawer', async () => {
    const user = userEvent.setup();
    const onDrawerClose = jest.fn();
    render(<ModalInDrawer onDrawerClose={onDrawerClose} />);

    await user.click(screen.getByRole('button', { name: 'open modal' }));
    await user.click(
      screen.getByRole('button', { name: 'inside modal', hidden: true })
    );
    expect(onDrawerClose).not.toHaveBeenCalled();
  });

  test('picking an option of a portaled Combobox list does not close the Drawer', async () => {
    const user = userEvent.setup();
    const onDrawerClose = jest.fn();
    render(
      <Drawer position="left" open onClose={onDrawerClose}>
        <Combobox label="Fruit" portal={document.body}>
          <ComboboxOption>Apple</ComboboxOption>
          <ComboboxOption>Banana</ComboboxOption>
        </Combobox>
      </Drawer>
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onDrawerClose).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('Banana');
  });
});

describe('focus trap', () => {
  test('focus can move into an overlay without its own trap inside a Modal', async () => {
    const user = userEvent.setup();
    render(<OverlayInModal />);
    // the modal moves focus to its heading after it opens
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Modal' })).toHaveFocus()
    );

    await user.click(screen.getByRole('button', { name: 'open overlay' }));
    const inside = screen.getByRole('button', {
      name: 'inside overlay',
      hidden: true
    });
    await user.click(inside);
    expect(inside).toHaveFocus();
  });

  test('focus returns into the outer trap when the element to return to is <body>', async () => {
    const user = userEvent.setup();
    const onDrawerClose = jest.fn();
    render(<ModalInDrawer onDrawerClose={onDrawerClose} />);

    // Safari does not focus a button on click, so focus can be on <body>
    // when the nested modal opens
    const openModal = screen.getByRole('button', { name: 'open modal' });
    act(() => {
      openModal.click();
      (document.activeElement as HTMLElement | null)?.blur();
    });
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Nested modal', hidden: true })
      ).toHaveFocus()
    );

    await user.keyboard('{Escape}');
    expect(document.activeElement).not.toBe(document.body);
    await user.keyboard('{Escape}');
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
  });
});

describe('screen reader isolation', () => {
  test('a Tooltip inside a Popover is not hidden from assistive technology', async () => {
    const user = userEvent.setup();
    render(<PopoverInDrawer onDrawerClose={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'open popover' }));
    await user.hover(
      screen.getByRole('button', { name: 'show tooltip', hidden: true })
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hello Tooltip');
  });

  test('a portaled Combobox list inside a Modal is not hidden from assistive technology', async () => {
    const user = userEvent.setup();
    render(
      <Modal heading="Modal" show onClose={() => null}>
        <ModalContent>
          <Combobox label="Fruit" portal={document.body}>
            <ComboboxOption>Apple</ComboboxOption>
          </Combobox>
        </ModalContent>
      </Modal>
    );
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Modal' })).toHaveFocus()
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
