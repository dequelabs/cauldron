import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface AddressProps {
  children: React.ReactNode;
  className?: string;
}

export const Address = ({ children, className, ...other }: AddressProps) => (
  <address className={classNames('Address', className)} {...other}>
    {children}
  </address>
);

Address.displayName = 'Address';
Address.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

interface AddressLineProps {
  children?: React.ReactNode;
  className?: string;
}

export const AddressLine = ({
  children,
  className,
  ...other
}: AddressLineProps) =>
  !!children && (
    <div className={classNames('Address__line', className)} {...other}>
      {children}
    </div>
  );

AddressLine.displayName = 'AddressLine';
AddressLine.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

interface AddressCityStateZipProps {
  city: React.ReactNode;
  state: React.ReactNode;
  zip: React.ReactNode;
  className?: string;
}

export const AddressCityStateZip = ({
  city,
  state,
  zip,
  className,
  ...other
}: AddressCityStateZipProps) =>
  !!(city || state || zip) && (
    <div
      className={classNames('Address__city-state-zip', className)}
      {...other}
    >
      {[[city, state].filter(Boolean).join(', '), zip]
        .filter(Boolean)
        .join(' ')}
    </div>
  );

AddressCityStateZip.displayName = 'AddressCityStateZip';
AddressCityStateZip.propTypes = {
  city: PropTypes.node,
  state: PropTypes.node,
  zip: PropTypes.node,
  className: PropTypes.string
};
