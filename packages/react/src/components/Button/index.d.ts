import React from 'react';
import PropTypes from 'prop-types';
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'link';
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
}
/**
 * The dqpl button component
 * @prop {String}       variant  visual appearance of the button
 * @prop {String|Object} children   Any desired child content of the button (a string of text or node(s))
 *
 * NOTE: All other props (i.e. onClick) passed will be applied to the dqpl button element
 * NOTE: to support stuff like refs, avoiding a stateless component
 */
export default class Button extends React.Component<ButtonProps> {
  static defaultProps: {
    variant: string;
    buttonRef: () => void;
  };
  static propTypes: {
    variant: PropTypes.Requireable<string>;
    children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    className: PropTypes.Requireable<string>;
    buttonRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
  };
  static displayName: string;
  render(): JSX.Element;
}
