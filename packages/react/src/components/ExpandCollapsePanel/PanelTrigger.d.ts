import React from 'react';
import PropTypes from 'prop-types';
export interface PanelTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ((props: { open: boolean }) => React.ReactNode) | React.ReactNode;
  open?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
declare function PanelTrigger({
  children,
  className,
  open,
  onClick,
  ...other
}: PanelTriggerProps): JSX.Element;
declare namespace PanelTrigger {
  var propTypes: {
    children: PropTypes.Requireable<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    open: PropTypes.Requireable<boolean>;
    onClick: PropTypes.Requireable<(...args: any[]) => any>;
    className: PropTypes.Requireable<string>;
  };
}
declare const _default: React.MemoExoticComponent<typeof PanelTrigger>;
export default _default;
