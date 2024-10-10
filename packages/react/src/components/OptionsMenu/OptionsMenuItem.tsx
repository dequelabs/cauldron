import React, { forwardRef } from 'react';

export interface OptionsMenuItemProps
  extends Pick<
    React.HTMLAttributes<HTMLLIElement>,
    Exclude<keyof React.HTMLAttributes<HTMLLIElement>, 'onSelect'>
  > {
  disabled?: boolean;
  className?: string;
  menuItemRef?: React.Ref<HTMLLIElement>;
  onSelect: (e: React.MouseEvent<HTMLElement>) => void;
}

function OptionsMenuItemComponent({
  disabled,
  className,
  menuItemRef,
  onSelect = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  ...other
}: OptionsMenuItemProps) {
  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (!disabled) {
      onSelect(event);
    }
  }

  return (
    // keydown happens in OptionsMenu which proxies to click
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      role="menuitem"
      ref={menuItemRef}
      aria-disabled={disabled}
      onClick={handleClick}
      className={className}
      {...other}
    />
  );
}

const OptionsMenuItem = forwardRef<HTMLLIElement, OptionsMenuItemProps>(
  ({ ...props }, ref) => (
    <OptionsMenuItemComponent menuItemRef={ref} {...props} />
  )
);

OptionsMenuItem.displayName = 'OptionsMenuItem';

export default OptionsMenuItem;
