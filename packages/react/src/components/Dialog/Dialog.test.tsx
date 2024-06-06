import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { spy } from 'sinon';
import Dialog, { DialogContent, DialogFooter } from './';
import axe from '../../axe';
import { userEvent } from '@testing-library/user-event';

const defaultProps: Omit<React.ComponentProps<typeof Dialog>, 'children'> = {
  show: true,
  heading: {
    text: 'dialog title',
    level: 2
  }
};

afterEach(() => (document.body.innerHTML = ''));

test('should render dialog', () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  expect(dialog).toHaveTextContent('Test Dialog');
});

test('should hide outside content when shown', async () => {
  const div = document.createElement('div');
  div.innerHTML = 'content';
  div.setAttribute('data-testid', 'outside');
  document.body.appendChild(div);
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  await waitFor(() =>
    expect(screen.getByTestId('outside')).toHaveAttribute('aria-hidden', 'true')
  );
});

test('should not hide outside content when not shown', async () => {
  const div = document.createElement('div');
  div.innerHTML = 'content';
  div.setAttribute('data-testid', 'outside');
  document.body.appendChild(div);
  render(
    <Dialog {...defaultProps} show={false}>
      Test Dialog
    </Dialog>
  );
  await waitFor(() =>
    expect(screen.getByTestId('outside')).not.toHaveAttribute(
      'aria-hidden',
      'true'
    )
  );
});

test('should not render dialog when passed a falsey "show" prop', () => {
  render(
    <Dialog {...defaultProps} show={false}>
      Test Dialog
    </Dialog>
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('should focus heading when rendered', async () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  await waitFor(() =>
    expect(
      within(screen.getByRole('dialog')).queryByRole('heading', {
        name: (defaultProps.heading as Record<string, unknown>).text as string
      })
    ).toHaveFocus()
  );
});

test('should focus heading when show prop is updated', async () => {
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
  await waitFor(() =>
    expect(
      within(screen.getByRole('dialog')).queryByRole('heading', {
        name: (defaultProps.heading as Record<string, unknown>).text as string
      })
    ).toHaveFocus()
  );
});

test('should have accessible name from heading', () => {
  render(<Dialog {...defaultProps}>Test Dialog</Dialog>);
  expect(screen.queryByRole('dialog')).toHaveAccessibleName(
    (defaultProps.heading as Record<string, unknown>).text
  );
});

// TODO: Figure out why this test doesn't run
test.skip('should call "onClose" when clicked outside', async () => {
  const user = userEvent.setup();
  const onClose = spy();
  render(
    <Dialog {...defaultProps} onClose={onClose}>
      Test Dialog
    </Dialog>
  );

  expect(onClose.notCalled).toBeTruthy();
  await user.click(document.body);
  await waitFor(() => expect(onClose.calledOnce).toBeTruthy());
});

test('should not call "onClose" when dialog is not currently shown', async () => {
  const user = userEvent.setup();
  const onClose = spy();
  render(
    <Dialog {...defaultProps} onClose={onClose} show={false}>
      Test Dialog
    </Dialog>
  );

  await user.click(document.body);
  await waitFor(() => expect(onClose.notCalled).toBeTruthy());
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

test('should support portal element', async () => {
  const element = document.createElement('div');
  render(
    <Dialog {...defaultProps} show>
      Test Dialog
    </Dialog>
  );
  waitFor(() => expect(within(element).getByRole('dialog')).toBeTruthy());
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

test('should set alignment on dialog content', () => {
  const { rerender } = render(
    <DialogContent data-testid="footer" align="left" />
  );
  const footer = screen.getByTestId('footer');
  expect(footer).toHaveClass('text--align-left');
  rerender(<DialogContent align="center" />);
  expect(footer).toHaveClass('text--align-center');
  rerender(<DialogContent align="right" />);
  expect(footer).toHaveClass('text--align-right');
});

test('should set alignment on dialog footer', () => {
  const { rerender } = render(
    <DialogFooter data-testid="footer" align="left" />
  );
  const footer = screen.getByTestId('footer');
  expect(footer).toHaveClass('text--align-left');
  rerender(<DialogFooter align="center" />);
  expect(footer).toHaveClass('text--align-center');
  rerender(<DialogFooter align="right" />);
  expect(footer).toHaveClass('text--align-right');
});

test('should return no axe violations', async () => {
  const { container } = render(<Dialog {...defaultProps}>Hello!</Dialog>);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
