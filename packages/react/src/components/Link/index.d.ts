import React from 'react';
import PropTypes from 'prop-types';
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkRef?: React.Ref<HTMLAnchorElement>;
  variant?: 'button';
}
declare const Link: {
  ({ children, linkRef, className, variant, ...other }: LinkProps): JSX.Element;
  propTypes: {
    children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    className: PropTypes.Requireable<string>;
    variant: PropTypes.Requireable<string>;
    linkRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
  };
  displayName: string;
};
export default Link;
