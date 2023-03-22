import React from 'react';
import { Link } from 'react-router-dom';

// TEST
const FieldWrapNotice = () => (
  <p>
    <strong>NOTE:</strong> All form fields should be rendered as children of a{' '}
    <Link to="/components/FieldWrap">
      <code>{`<FieldWrap />`}</code> component
    </Link>
    . This means ALL fields in a form should be wrapped by 1 or more (in the
    case of "groups" of fields) FieldWrap components.
  </p>
);

export default FieldWrapNotice;
