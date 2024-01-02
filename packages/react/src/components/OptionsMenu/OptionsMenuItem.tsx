import React from 'react';

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

class OptionsMenuItemComponent extends React.Component<OptionsMenuItemProps> {
  static defaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSelect: () => {}
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const { disabled, onSelect } = this.props;
    if (!disabled) {
      onSelect(event);
    }
  };

  render() {
    const { handleClick, props } = this;
    const { menuItemRef, disabled, onSelect, ...other } = props;
    return (
      // keydown happens in OptionsMenu which proxies to click
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <li
        role="menuitem"
        ref={menuItemRef}
        aria-disabled={disabled}
        onClick={handleClick}
        {...other}
      />
    );
  }
}

export default React.forwardRef(function OptionsMenuItem(
  props: OptionsMenuItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  return <OptionsMenuItemComponent menuItemRef={ref} {...props} />;
});
