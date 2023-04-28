import PropTypes from 'prop-types';

/**
 * This prop type is meant to ensure that a prop can actually be rendered as content.
 * It should match the ContentNode type in types.ts
 */
export const contentNode = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.element
]);
