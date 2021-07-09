import React, { useRef, MutableRefObject } from 'react';
import Tooltip, { TooltipProps } from '../Tooltip';
import classnames from 'classnames';

type TooltipTabstopProps = Omit<TooltipProps, 'target'> & {
  children: React.ReactNode;
  tooltip: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

/**
 * The button's sole purpose is to provide an interactive tabstop for a tooltip. aria-disabled is used to:
 *   - Allow the button to be keyboard focusable
 *   - Inform AT users that clicking the button does not perform any action
 *   - Is prevented as a focusable control to trigger the associated tooltip
 */
function TooltipTabstop({
  children,
  className,
  tooltip,
  variant,
  association,
  show,
  placement,
  portal,
  hideElementOnHidden,
  ...buttonProps
}: TooltipTabstopProps) {
  const buttonRef = useRef() as MutableRefObject<HTMLButtonElement>;
  return (
    <React.Fragment>
      <button
        type="button"
        ref={buttonRef}
        aria-disabled="true"
        className={classnames('TooltipTabstop', className)}
        {...buttonProps}
      >
        {children}
      </button>
      <Tooltip
        target={buttonRef}
        variant={variant}
        association={association}
        show={show}
        placement={placement}
        portal={portal}
        hideElementOnHidden={hideElementOnHidden}
      >
        {tooltip}
      </Tooltip>
    </React.Fragment>
  );
}

TooltipTabstop.displayName = 'TooltipTabstop';

export default TooltipTabstop;
