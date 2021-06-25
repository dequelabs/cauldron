import React from 'react';
import classNames from 'classnames';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
}

const TopBar = (props: TopBarProps) => {
  const { children, className, variant = 'dark', ...other } = props;
  return (
    <div
      className={classNames(className, {
        // TopBar's default style is dark mode
        TopBar: true,
        'TopBar--light': variant === 'light'
      })}
      {...other}
    >
      {children}
    </div>
  );
};

export default TopBar;
