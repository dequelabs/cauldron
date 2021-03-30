import React from 'react';
import axe from '../../../axe';
import { shallow, mount } from 'enzyme';
import LoaderOverlay from '../../../../src/components/LoaderOverlay';

test('handles classNames/additional attributes properly', () => {
  const loaderOverlay = mount(
    <LoaderOverlay className="baz" role="alert">
      Loading...
    </LoaderOverlay>
  );
  const node = loaderOverlay.getDOMNode();
  expect(node.classList.contains('baz')).toBe(true);
  expect(node.classList.contains('Loader__overlay')).toBe(true);
  expect(node.getAttribute('role')).toBe('alert');
});

test('returns no axe violations', async () => {
  const loaderOverlay = shallow(<LoaderOverlay>Hello world</LoaderOverlay>);

  expect(await axe(loaderOverlay.html())).toHaveNoViolations();
});
