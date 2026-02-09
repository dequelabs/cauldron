import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useFocusTrap from './useFocusTrap';

const ComponentOutsideFocusTrap = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <button>outside before</button>
      {children}
      <button>outside after</button>
    </>
  );
};

const ComponentWithFocusableElements = ({
  disableFocusTrap = false
}: {
  disableFocusTrap?: boolean;
}) => {
  const containerRef = React.useRef(null);

  useFocusTrap(containerRef, {
    returnFocus: true,
    disabled: disableFocusTrap
  });

  return (
    <div ref={containerRef}>
      <button>first</button>
      <button>bananas</button>
      <button>last</button>
    </div>
  );
};

const ComponentWithInitialFocus = () => {
  const containerRef = React.useRef(null);
  const initialFocusRef = React.useRef(null);

  useFocusTrap(containerRef, {
    initialFocusElement: initialFocusRef
  });

  return (
    <div ref={containerRef}>
      <button>first</button>
      <button ref={initialFocusRef}>initial focus</button>
      <button>last</button>
    </div>
  );
};

const ComponentWithReturnElement = ({
  disableFocusTrap = false
}: {
  disableFocusTrap?: boolean;
}) => {
  const containerRef = React.useRef(null);
  const returnFocusElement = React.useRef(null);

  useFocusTrap(containerRef, {
    returnFocus: true,
    returnFocusElement,
    disabled: disableFocusTrap
  });

  return (
    <>
      <button>before</button>
      <div ref={containerRef}>
        <button>first</button>
        <button>bananas</button>
        <button>last</button>
      </div>
      <button ref={returnFocusElement}>return focus element</button>
    </>
  );
};

describe('useFocusTrap', () => {
  test('should trap focus within container', async () => {
    render(
      <ComponentOutsideFocusTrap>
        <ComponentWithFocusableElements />
      </ComponentOutsideFocusTrap>
    );

    const buttons = screen.getAllByRole('button');

    // First element should be focused initially
    expect(buttons[1]).toHaveFocus();

    // Tab forward through elements
    await userEvent.tab();
    expect(buttons[2]).toHaveFocus();
    await userEvent.tab();
    expect(buttons[3]).toHaveFocus();

    // Should wrap to first element
    await userEvent.tab();
    expect(buttons[1]).toHaveFocus();

    // Tab backward should wrap to last element
    await userEvent.tab({ shift: true });
    expect(buttons[3]).toHaveFocus();
  });

  test('should focus initial element with element ref', () => {
    render(
      <ComponentOutsideFocusTrap>
        <ComponentWithInitialFocus />
      </ComponentOutsideFocusTrap>
    );

    const initialButton = screen.getByRole('button', { name: 'initial focus' });
    expect(initialButton).toHaveFocus();
  });

  test('should allow for the trap to be enabled/disabled', async () => {
    const { rerender } = render(
      <ComponentOutsideFocusTrap>
        <ComponentWithFocusableElements disableFocusTrap />
      </ComponentOutsideFocusTrap>
    );

    const buttonBefore = screen.getByRole('button', { name: 'outside before' });
    const buttonAfter = screen.getByRole('button', { name: 'outside after' });

    // Initially not trapped
    await userEvent.tab();
    expect(buttonBefore).toHaveFocus();

    rerender(
      <ComponentOutsideFocusTrap>
        <ComponentWithFocusableElements disableFocusTrap={false} />
      </ComponentOutsideFocusTrap>
    );

    // Focus should be trapped
    const trappedButton = screen.getByRole('button', { name: 'first' });
    expect(trappedButton).toHaveFocus();

    // Check to see if tabbing remains within the trap
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(trappedButton).toHaveFocus();

    // Disable trap
    rerender(
      <ComponentOutsideFocusTrap>
        <ComponentWithFocusableElements disableFocusTrap />
      </ComponentOutsideFocusTrap>
    );

    // Should be able to focus outside button
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(buttonAfter).toHaveFocus();
  });

  test('should restore focus when unmounted', () => {
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { unmount } = render(<ComponentWithFocusableElements />);
    expect(outsideButton).not.toHaveFocus();

    unmount();
    expect(outsideButton).toHaveFocus();

    document.body.removeChild(outsideButton);
  });

  test('should handle nested focus traps', () => {
    const NestedTraps = () => {
      const outerRef = React.useRef(null);
      const innerRef = React.useRef(null);

      useFocusTrap(outerRef);
      useFocusTrap(innerRef);

      return (
        <div ref={outerRef}>
          <button>outer</button>
          <div ref={innerRef}>
            <button>inner</button>
          </div>
        </div>
      );
    };

    render(<NestedTraps />);

    const innerButton = screen.getByRole('button', { name: 'inner' });
    expect(innerButton).toHaveFocus();
  });

  test('should call focus with preventScroll when trap activates so opening overlay does not scroll the page', () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

    render(
      <ComponentOutsideFocusTrap>
        <ComponentWithFocusableElements />
      </ComponentOutsideFocusTrap>
    );

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });

  test('should return focus to specified returnFocusElement', async () => {
    const { rerender } = render(
      <ComponentWithReturnElement disableFocusTrap />
    );

    const buttonBefore = screen.getByRole('button', { name: 'before' });
    const buttonAfter = screen.getByRole('button', {
      name: 'return focus element'
    });

    await userEvent.tab();
    expect(buttonBefore).toHaveFocus();

    rerender(<ComponentWithReturnElement disableFocusTrap={false} />);
    rerender(<ComponentWithReturnElement disableFocusTrap={true} />);

    expect(buttonAfter).toHaveFocus();
  });
});
