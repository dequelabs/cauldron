import React from 'react';
import axe from '../../../axe';
import { shallow, mount } from 'enzyme';
import LoaderOverlay from '../../../../src/components/LoaderOverlay';

test('handles classNames/additional attributes properly', () => {
  const loaderOverlay = mount(
    <LoaderOverlay className="baz" role="alert" label="loading" />
  );
  const node = loaderOverlay.getDOMNode();
  expect(node.classList.contains('baz')).toBe(true);
  expect(node.classList.contains('Loader__overlay')).toBe(true);
  expect(node.getAttribute('role')).toBe('alert');
});

test('handles variants', () => {
  const small = mount(
    <LoaderOverlay
      className="baz"
      role="alert"
      label="loading"
      variant="small"
    />
  );
  const large = mount(
    <LoaderOverlay
      className="baz"
      role="alert"
      label="loading"
      variant="large"
    />
  );
  const smallNode = small.getDOMNode();
  const largeNode = large.getDOMNode();

  expect(smallNode.classList.contains('Loader__overlay--small')).toBe(true);
  expect(largeNode.classList.contains('Loader__overlay--large')).toBe(true);
});

test('handles focus', () => {
  const loaderOverlay = mount(
    <LoaderOverlay
      className="baz"
      role="alert"
      label="loading"
      focusOnInitialRender
    >
      Some text
    </LoaderOverlay>
  );

  setTimeout(() => {
    expect(document.activeElement).toBe(loaderOverlay.getDOMNode());
  });
});

test('handles not being focused', () => {
  const loaderOverlay = mount(
    <LoaderOverlay className="baz" role="alert" label="loading">
      Some text
    </LoaderOverlay>
  );

  setTimeout(() => {
    expect(document.activeElement).not.toBe(loaderOverlay.getDOMNode());
  });
});

test('handles being passed a ref', () => {
  const loaderRef = React.createRef(null);

  const loaderOverlay = mount(
    <LoaderOverlay className="baz" role="alert" label="loading" ref={loaderRef}>
      Some text
    </LoaderOverlay>
  );

  setTimeout(() => {
    expect(document.activeElement).toStrictEqual(loaderOverlay.getDOMNode());
  });
});

test('traps focus', () => {
  const loaderOverlay = shallow(
    <LoaderOverlay className="baz" role="alert" label="loading" focusTrap>
      Some text
    </LoaderOverlay>
  );

  expect(loaderOverlay.find('FocusTrap').exists()).toBe(true);
});

test('returns no axe violations', async () => {
  const loaderOverlay = shallow(<LoaderOverlay>Hello world</LoaderOverlay>);

  expect(await axe(loaderOverlay.html())).toHaveNoViolations();
});
