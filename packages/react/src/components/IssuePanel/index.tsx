import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '../IconButton';

const IssuePanel = ({
  className,
  title = '',
  actions,
  children
}: {
  className?: string;
  title?: string;
  actions?: typeof IconButton[];
  children: React.ReactNode;
}) => {
  return (
    <div className={classNames('IssuePanel', className)}>
      <div className="IssuePanel__Header">
        {title && <div className="IssuePanel__Header-title">{title}</div>}
        {actions && (
          <div className="IssuePanel__Header-actions">
            {actions as React.ReactNode}
          </div>
        )}
      </div>
      <div className="IssuePanel__Content">{children}</div>
    </div>
  );
};

IssuePanel.displayName = 'IssuePanel';
IssuePanel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default IssuePanel;
