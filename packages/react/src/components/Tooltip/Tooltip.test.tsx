import React, { createRef } from 'react';
import {
  render,
  screen,
  fireEvent,
  findByRole,
  waitFor,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spy } from 'sinon';
import { axe } from 'jest-axe';
import Tooltip, { TooltipHead, TooltipContent } from './';

type SetOptional<T, Keys extends keyof T> = Pick<Partial<T>, Keys> &
  Omit<T, Keys>;
interface RenderTooltipProps {
  buttonProps?: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps?: SetOptional<
    Omit<React.ComponentProps<typeof Tooltip>, 'target'>,
    'children'
  >;
}

const renderTooltip = ({
  buttonProps = {},
  tooltipProps = {}
}: RenderTooltipProps = {}) => {
  const ref = createRef<HTMLButtonElement>();
  const { children, ...props } = tooltipProps;
  return render(
    <>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Tooltip target={ref} defaultShow={true} {...props}>
        {children ?? 'Hello Tooltip'}
      </Tooltip>
    </>
  );
};

test('should render tooltip', async () => {
  renderTooltip();
  expect(
    await screen.findByRole('tooltip', { name: 'Hello Tooltip' })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('button', { name: 'button' })
  ).toHaveAccessibleDescription('Hello Tooltip');
});

test('should auto generate ids', async () => {
  renderTooltip();
  const button = await screen.findByRole('button');
  const tooltip = await screen.findByRole('tooltip');
  expect(tooltip.getAttribute('id')).toBeTruthy();
  expect(tooltip.getAttribute('id')).toEqual(
    button.getAttribute('aria-describedby')
  );
});

test('should not overwrite user provided ids', async () => {
  const buttonProps = { [`aria-describedby`]: 'foo tooltipid' };
  const tooltipProps = { id: 'tooltipid' };
  renderTooltip({ buttonProps, tooltipProps });
  expect((await screen.findByRole('tooltip')).getAttribute('id')).toEqual(
    'tooltipid'
  );
  expect(
    (await screen.findByRole('button')).getAttribute('aria-describedby')
  ).toEqual('foo tooltipid');
});

test('should show tooltip on target element focus', async () => {
  renderTooltip({ tooltipProps: { defaultShow: false } });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await act(async () => {
    await fireEvent.focusIn(screen.getByRole('button'));
  });
  waitFor(() => {
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  });
});

test('should show tooltip on target element hover', async () => {
  renderTooltip({ tooltipProps: { defaultShow: false } });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await act(async () => {
    await fireEvent.mouseEnter(screen.getByRole('button'));
  });
  waitFor(() => {
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  });
});

test('should hide tooltip on target element blur', async () => {
  renderTooltip({ tooltipProps: { defaultShow: false } });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await fireEvent.focusIn(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  await fireEvent.focusOut(screen.getByRole('button'));
  // Note: Tooltip does not immediately hide, but is delayed by 100ms
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

test('should hide tooltip on escape keypress', async () => {
  renderTooltip({ tooltipProps: { defaultShow: false } });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await fireEvent.focusIn(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('should fire the "cauldron:tooltip:show" custom event when tooltip is shown', async () => {
  const show = spy();
  renderTooltip();

  const button = await screen.findByRole('button');
  button.addEventListener('cauldron:tooltip:show', show);
  await fireEvent.focusIn(button);

  await waitFor(() => {
    expect(show.calledOnce).toBeTruthy();
  });
});

test('should fire the "cauldron:tooltip:hide" custom event when tooltip is hidden', async () => {
  const hide = spy();
  renderTooltip();

  const button = await screen.findByRole('button');
  button.addEventListener('cauldron:tooltip:hide', hide);
  await fireEvent.focusOut(button);

  await waitFor(() => {
    expect(hide.calledOnce).toBeTruthy();
  });
});

test('should support className prop', async () => {
  renderTooltip({ tooltipProps: { className: 'bananas' } });
  expect(await screen.findByRole('tooltip')).toHaveClass('Tooltip', 'bananas');
});

test('should support portal prop', async () => {
  const portal = document.createElement('div');
  renderTooltip({ tooltipProps: { portal } });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  const tooltipInPortal = await findByRole(portal, 'tooltip');
  expect(tooltipInPortal).toBeTruthy();
});

test('should support show prop', async () => {
  const ShowTooltip = ({ show }: { show?: boolean }) => {
    const ref = createRef<HTMLButtonElement>();
    return (
      <>
        <button ref={ref}>button</button>
        {show && (
          <Tooltip id="tooltip" target={ref} show={show}>
            Hello Tooltip
          </Tooltip>
        )}
      </>
    );
  };

  const { rerender } = render(<ShowTooltip show={true} />);
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  rerender(<ShowTooltip show={false} />);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('should support association prop', async () => {
  renderTooltip({ tooltipProps: { association: 'aria-labelledby' } });
  expect(await screen.findByRole('button')).toHaveAccessibleName(
    'Hello Tooltip'
  );
});

test('should not add association when association is set to "none"', async () => {
  renderTooltip({ tooltipProps: { association: 'none' } });
  const button = await screen.findByRole('button');
  expect(button).not.toHaveProperty('aria-describedby');
  expect(button).not.toHaveProperty('aria-labelledby');
});

test('should clean up association when tooltip is no longer rendered', async () => {
  const ShowTooltip = ({ show = true }: { show?: boolean }) => {
    const ref = createRef<HTMLButtonElement>();
    return (
      <>
        <button ref={ref}>button</button>
        {show && (
          <Tooltip id="tooltip" target={ref} show>
            Hello Tooltip
          </Tooltip>
        )}
      </>
    );
  };
  const { rerender } = render(<ShowTooltip />);
  expect(
    (await screen.findByRole('button')).getAttribute('aria-describedby')
  ).toContain('tooltip');
  rerender(<ShowTooltip show={false} />);
  expect(
    (await screen.findByRole('button')).getAttribute('aria-describedby')
  ).not.toContain('tooltip');
});

test('should return no axe violations with default variant', async () => {
  const { container } = renderTooltip();
  waitFor(() => {
    expect(container).toBeInTheDocument();
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with info variant', async () => {
  const { container } = renderTooltip({ tooltipProps: { variant: 'info' } });
  waitFor(() => {
    expect(container).toBeInTheDocument();
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with big variant', async () => {
  const children = (
    <>
      <TooltipHead>Head</TooltipHead>
      <TooltipContent>Content</TooltipContent>
    </>
  );
  const { container } = renderTooltip({
    tooltipProps: { variant: 'big', children }
  });
  waitFor(() => {
    expect(container).toBeInTheDocument();
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
