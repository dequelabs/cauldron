import React, { useState } from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogCloseButton
} from './';
import { useDialogContext } from './DialogContext';
import TooltipTabstop from '../TooltipTabstop';
import axe from '../../axe';

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

test('should call "onClose" when clicked outside', async () => {
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

describe('when "forceAction" is false', () => {
  test('it should call "onClose" when escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Dialog {...defaultProps} onClose={onClose} forceAction={false}>
        Test Dialog
      </Dialog>
    );

    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('when "forceAction" is true', () => {
  test('it should not call "onClose" when escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Dialog {...defaultProps} onClose={onClose} forceAction={true}>
        Test Dialog
      </Dialog>
    );

    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('when a tooltip is rendered within the dialog', () => {
  const renderTooltipInDialog = () => {
    const CustomTooltipDialog = () => {
      const [show, setShow] = useState(true);

      return (
        <Dialog
          heading={'Tooltip Dialog'}
          show={show}
          onClose={() => setShow(false)}
        >
          <TooltipTabstop tooltip="Hello Tooltip">show tooltip</TooltipTabstop>
        </Dialog>
      );
    };

    const user = userEvent.setup();

    render(<CustomTooltipDialog />);

    const dialog = screen.getByRole('dialog', { name: /tooltip dialog/i });
    const button = screen.getByRole('button', { name: /show tooltip/i });
    const getTooltip = () =>
      screen.queryByRole('tooltip', { name: /hello tooltip/i });

    return { user, dialog, button, getTooltip };
  };

  test('it should close the tooltip but not the dialog on escape', async () => {
    const { user, dialog, button, getTooltip } = renderTooltipInDialog();

    expect(dialog).toBeVisible();
    expect(getTooltip()).not.toBeInTheDocument();

    await user.hover(button);

    expect(getTooltip()).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(getTooltip()).not.toBeInTheDocument();
    expect(dialog).toBeVisible();
  });
});

test('should return no axe violations', async () => {
  const { container } = render(<Dialog {...defaultProps}>Hello!</Dialog>);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

describe('custom header', () => {
  test('should render custom header with DialogHeader, DialogHeading, and DialogCloseButton', async () => {
    render(
      <Dialog show>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton />
        </DialogHeader>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).queryByRole('heading', { name: 'Custom Heading' })
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByRole('button', { name: 'Close' })
    ).toBeInTheDocument();
  });

  test('should focus custom heading when rendered', async () => {
    render(
      <Dialog show>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton />
        </DialogHeader>
      </Dialog>
    );

    await waitFor(() =>
      expect(
        within(screen.getByRole('dialog')).queryByRole('heading', {
          name: 'Custom Heading'
        })
      ).toHaveFocus()
    );
  });

  test('should call onClose when custom close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Dialog show onClose={onClose}>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton />
        </DialogHeader>
      </Dialog>
    );

    const closeButton = within(screen.getByRole('dialog')).getByRole('button', {
      name: 'Close'
    });
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should not render custom close button when forceAction is true', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => null);
    render(
      <Dialog show forceAction>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton />
        </DialogHeader>
      </Dialog>
    );

    expect(
      within(screen.getByRole('dialog')).queryByRole('button', {
        name: 'Close'
      })
    ).not.toBeInTheDocument();
    consoleWarn.mockRestore();
  });

  test('should render DialogCloseButton with custom children', () => {
    render(
      <Dialog show>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton>Dismiss</DialogCloseButton>
        </DialogHeader>
      </Dialog>
    );

    expect(
      within(screen.getByRole('dialog')).queryByRole('button', {
        name: 'Dismiss'
      })
    ).toBeInTheDocument();
  });

  test('should use closeButtonText prop for DialogCloseButton', () => {
    render(
      <Dialog show closeButtonText="Dismiss Dialog">
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton />
        </DialogHeader>
      </Dialog>
    );

    expect(
      within(screen.getByRole('dialog')).queryByRole('button', {
        name: 'Dismiss Dialog'
      })
    ).toBeInTheDocument();
  });

  test('should support custom heading level via level prop', () => {
    render(
      <Dialog show>
        <DialogHeader>
          <DialogHeading level={4}>Custom Level Heading</DialogHeading>
        </DialogHeader>
      </Dialog>
    );

    expect(
      within(screen.getByRole('dialog')).queryByRole('heading', {
        level: 4,
        name: 'Custom Level Heading'
      })
    ).toBeInTheDocument();
  });

  test('should inherit heading level from Dialog heading prop', () => {
    render(
      <Dialog show heading={{ text: 'Title', level: 3 }}>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );

    expect(
      within(screen.getByRole('dialog')).queryByRole('heading', {
        level: 3,
        name: 'Title'
      })
    ).toBeInTheDocument();
  });
});

describe('useDialogContext', () => {
  test('should throw error when used outside of Dialog', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    const InvalidComponent = () => {
      useDialogContext();
      return null;
    };

    expect(() => render(<InvalidComponent />)).toThrow(
      'Dialog compound components must be rendered within a Dialog'
    );

    consoleError.mockRestore();
  });
});

describe('development warning', () => {
  test('should warn when no heading is provided and no DialogHeading is rendered', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => null);

    render(
      <Dialog show>
        <DialogContent>Content without heading</DialogContent>
      </Dialog>
    );

    expect(consoleWarn).toHaveBeenCalledWith(
      'Dialog: No heading provided. When using a custom header, include a DialogHeading component for accessibility.'
    );

    consoleWarn.mockRestore();
  });

  test('should not warn when DialogHeading is provided in custom header', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => null);

    render(
      <Dialog show>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
        </DialogHeader>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );

    expect(consoleWarn).not.toHaveBeenCalled();

    consoleWarn.mockRestore();
  });

  test('should warn when DialogCloseButton is used with forceAction', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => null);

    render(
      <Dialog show forceAction>
        <DialogHeader>
          <DialogHeading>Custom Heading</DialogHeading>
          <DialogCloseButton />
        </DialogHeader>
      </Dialog>
    );

    expect(consoleWarn).toHaveBeenCalledWith(
      'DialogCloseButton: Component will not render because forceAction is true. Remove DialogCloseButton from your custom header when using forceAction.'
    );

    consoleWarn.mockRestore();
  });
});
