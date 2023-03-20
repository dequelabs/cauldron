import PropTypes from 'prop-types';

export const contentNode = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.element
]);
