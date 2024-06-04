import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { spy } from 'sinon';
import Dialog, { DialogFooter } from './';
import axe from '../../axe';

const defaultProps: Omit<React.ComponentProps<typeof Dialog>, 'children'> = {
  show: true,
  heading: {
    text: 'dialog title',
    level: 2
  }
};

test('should render dialog', () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  expect(dialog).toHaveTextContent('Test Dialog');
});

test('should not render dialog when passed a falsey "show" prop', () => {
  render(
    <Dialog {...defaultProps} show={false}>
      Test Dialog
    </Dialog>
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('should focus heading when rendered', () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  expect(
    within(screen.getByRole('dialog')).queryByRole('heading', {
      name: (defaultProps.heading as any).text
    })
  ).toHaveFocus();
});

test('should focus heading when show prop is updated', () => {
  const { rerender } = render(
    <Dialog {...defaultProps} show={false}>
      Test Dialog
    </Dialog>
  );
  rerender(
    <Dialog {...defaultProps} show={true}>
      Test Dialog
    </Dialog>
  );
  expect(
    within(screen.getByRole('dialog')).queryByRole('heading', {
      name: (defaultProps.heading as any).text
    })
  ).toHaveFocus();
});

test('should have accessible name from heading', () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  expect(screen.queryByRole('dialog')).toHaveAccessibleName(
    (defaultProps.heading as any).text
  );
});

test('should call "onClose" when clicked outside', () => {
  const onClose = spy();
  render(
    <Dialog {...defaultProps} onClose={onClose}>
      Test Dialog
    </Dialog>
  );

  expect(onClose.notCalled).toBeTruthy();
  const event = new MouseEvent('click', { bubbles: true });
  fireEvent(document.body, event);
  expect(onClose.calledOnce).toBeTruthy();
});

test('should not call "onClose" when dialog is not currently shown', () => {
  const onClose = spy();
  render(
    <Dialog {...defaultProps} onClose={onClose} show={false}>
      Test Dialog
    </Dialog>
  );

  const event = new MouseEvent('click', { bubbles: true });
  fireEvent(document.body, event);
  expect(onClose.notCalled).toBeTruthy();
});

test('should support className prop', () => {
  render(
    <Dialog {...defaultProps} className="bananas">
      Test Dialog
    </Dialog>
  );
  expect(screen.queryByRole('dialog')).toHaveClass('Dialog', 'bananas');
});

test('should support dialogRef prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Dialog {...defaultProps} dialogRef={ref}>
      Test Dialog
    </Dialog>
  );
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.queryByRole('dialog'));
});

test('should support pass through props', () => {
  render(
    <Dialog {...defaultProps} data-foo="true">
      Test Dialog
    </Dialog>
  );
  expect(screen.queryByRole('dialog')).toHaveAttribute('data-foo', 'true');
});

test('should render close button', () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  expect(
    within(screen.getByRole('dialog')).queryByRole('button', { name: 'Close' })
  ).toBeInTheDocument();
});

test('should not render close button when forceAction is true', () => {
  render(
    <Dialog {...defaultProps} forceAction>
      Test Dialog
    </Dialog>
  );
  expect(
    within(screen.getByRole('dialog')).queryByRole('button', { name: 'Close' })
  ).not.toBeInTheDocument();
});

test('should render heading from text', () => {
  render(
    <Dialog {...defaultProps} heading="title">
      Test Dialog
    </Dialog>
  );
  expect(
    within(screen.getByRole('dialog')).queryByRole('heading', {
      level: 2,
      name: 'title'
    })
  ).toBeInTheDocument();
});

test('should render heading from object', () => {
  render(
    <Dialog {...defaultProps} heading={{ text: 'title', level: 2 }}>
      Test Dialog
    </Dialog>
  );
  expect(
    within(screen.getByRole('dialog')).queryByRole('heading', {
      level: 2,
      name: 'title'
    })
  ).toBeInTheDocument();
});

test('should deactivate aria-isolate on unmount', () => {
  // todo
});

test('should set alignment on dialog footer', () => {
  const { container, rerender } = render(<DialogFooter align="left" />);
  expect(container).toHaveClass('text--align-left');
  rerender(<DialogFooter align="center" />);
  expect(container).toHaveClass('text--align-center');
  rerender(<DialogFooter align="right" />);
  expect(container).toHaveClass('text--align-right');
});

test('should return no axe violations', async () => {
  const { container } = render(<Dialog {...defaultProps}>Hello!</Dialog>);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
