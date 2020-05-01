import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { OptionsMenu } from '../..';

export interface OptionsMenuTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  triggerRef?: React.Ref<HTMLButtonElement>;
}

/**
 * The trigger button component to be used as the default component
 * that triggers the opening of an <OptionsMenu />.
 */
function OptionsMenuTriggerComponent({
  className,
  triggerRef,
  ...other
}: OptionsMenuTriggerProps) {
  return (
    <button
      type="button"
      ref={triggerRef}
      {...other}
      className={classNames('dqpl-options-menu-trigger', className)}
    />
  );
}

OptionsMenuTriggerComponent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  triggerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

export default React.forwardRef(function OptionsMenuTrigger(
  props: OptionsMenuTriggerProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return <OptionsMenuTriggerComponent {...props} triggerRef={ref} />;
});
