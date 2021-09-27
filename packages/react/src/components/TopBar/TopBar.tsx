import React from 'react';
import classNames from 'classnames';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TopBar = (props: TopBarProps) => {
  const { children, className, ...other } = props;
  return (
    <div
      className={classNames(className, {
        // TopBar's default style is dark mode
        TopBar: true
      })}
      {...other}
    >
      {children}
    </div>
  );
};

export default TopBar;
