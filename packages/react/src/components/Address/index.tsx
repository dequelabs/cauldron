import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface AddressProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
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

type AddressLineProps = React.HTMLAttributes<HTMLElement>;

export const AddressLine = ({
  children,
  className,
  ...other
}: AddressLineProps) =>
  children ? (
    <div className={classNames('Address__line', className)} {...other}>
      {children}
    </div>
  ) : null;

AddressLine.displayName = 'AddressLine';
AddressLine.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

interface AddressCityStateZipProps extends React.HTMLAttributes<HTMLElement> {
  city: React.ReactNode;
  state: React.ReactNode;
  zip: React.ReactNode;
}

export const AddressCityStateZip = ({
  city,
  state,
  zip,
  className,
  ...other
}: AddressCityStateZipProps) =>
  city || state || zip ? (
    <div
      className={classNames('Address__city-state-zip', className)}
      {...other}
    >
      {[[city, state].filter(Boolean).join(', '), zip]
        .filter(Boolean)
        .join(' ')}
    </div>
  ) : null;

AddressCityStateZip.displayName = 'AddressCityStateZip';
AddressCityStateZip.propTypes = {
  city: PropTypes.node,
  state: PropTypes.node,
  zip: PropTypes.node,
  className: PropTypes.string
};
