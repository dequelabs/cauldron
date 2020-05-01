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
declare const _default: React.ForwardRefExoticComponent<OptionsMenuItemProps &
  React.RefAttributes<HTMLLIElement>>;
export default _default;
