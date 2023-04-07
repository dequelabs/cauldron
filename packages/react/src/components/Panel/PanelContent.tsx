import React, { ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export interface PanelContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

const PanelContent = ({
  children,
  className,
  padding = true,
  ...otherProps
}: PanelContentProps) => {
  return (
    <div
      className={classNames('Panel__Content', className, {
        ['Panel__Content--padding']: padding
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
};

PanelContent.displayName = 'PanelContent';

PanelContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.bool
};

export default PanelContent;
