import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

interface SimpleTagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: undefined;
}

interface DismissTagProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant: 'dismiss';
  onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ToggleTagProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant: 'toggle';
  toggleState: boolean;
  buttonLabel: string;
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleOnText?: string;
  toggleOffText?: string;
}

type TagProps = SimpleTagProps | ToggleTagProps | DismissTagProps;

interface TagLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const TagLabel = ({ children, className, ...other }: TagLabelProps) => (
  <div className={classNames('Tag__label', className)} {...other}>
    {children}
  </div>
);
TagLabel.displayName = 'TagLabel';
TagLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

const Tag = (props: TagProps) => {
  // render dismiss Tag
  if (props.variant === 'dismiss') {
    const [show, setShow] = useState(true);
    const { children, className, onDismiss, ...other } = props;
    const handleDismiss = (event: React.MouseEvent<HTMLButtonElement>) => {
      setShow(false);
      if (onDismiss) {
        onDismiss(event);
      }
    };

    return (
      <button
        className={classNames('Tag', 'Tag--dismiss', className, {
          'Tag--hidden': !show
        })}
        onClick={handleDismiss}
        {...other}
      >
        {children}
        <Icon type="close" />
      </button>
    );
  }

  // render toggle Tag
  if (props.variant === 'toggle') {
    const {
      children,
      className,
      toggleState,
      buttonLabel,
      onToggle,
      toggleOnText = 'ON',
      toggleOffText = 'OFF',
      ...other
    } = props;

    return (
      <button
        className={classNames('Tag', 'Tag--toggle', className)}
        role="switch"
        aria-label={buttonLabel}
        aria-checked={toggleState}
        onClick={onToggle}
        {...other}
      >
        {children}
        <span>{toggleState ? toggleOnText : toggleOffText}</span>
      </button>
    );
  }

  // render simple Tag
  const { className, children, ...other } = props;
  return (
    <div className={classNames('Tag', className)} {...other}>
      {children}
    </div>
  );
};

Tag.displayName = 'Tag';
Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.string,
  onDismiss: PropTypes.func,
  toggleState: PropTypes.bool,
  buttonLabel: PropTypes.string,
  onToggle: PropTypes.func,
  toggleOnText: PropTypes.string,
  toggleOffText: PropTypes.string
};
export default Tag;
