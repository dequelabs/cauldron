import React from 'react';
import { mount } from 'enzyme';
import Dialog from 'src/components/Dialog';
import axe from '../../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('returns null if passed a falsey "show" prop', () => {
  expect.assertions(1);
  const dialog = mount(<Dialog {...defaults}>{'hello'}</Dialog>);

  expect(dialog.html()).toBe(null);
});

test('focuses heading when mounted with a truthy "show" prop', done => {
  const dialog = mount(
    <Dialog {...defaults} show={true}>
      {'hello'}
    </Dialog>
  );

  setTimeout(() => {
    // setting timeout to wait for fade-in (like the src does)
    expect(document.activeElement).toBe(dialog.instance().heading);
    dialog.unmount();
    done();
  }, 10);
});

test('focuses heading when "show" prop is updated from falsey to truthy', done => {
  const dialog = mount(<Dialog {...defaults}>{'hello'}</Dialog>);

  dialog.setProps({ show: true }, () => {
    setTimeout(() => {
      expect(document.activeElement).toBe(dialog.instance().heading);
      dialog.unmount();
      done();
    }, 10);
  });
});

test('calls onClose when a "show" prop is updated from truthy to falsey', () => {
  const onClose = jest.fn();
  const dialog = mount(
    <Dialog {...defaults} show={true} onClose={onClose}>
      {'hello'}
    </Dialog>
  );

  dialog.setProps({ show: false });
  expect(onClose).toBeCalled();
});

test('calls onClose when clicked outside', () => {
  const onClose = jest.fn();
  const dialog = mount(
    <Dialog {...defaults} show={true} onClose={onClose}>
      {'hello'}
    </Dialog>
  );

  dialog.instance().handleClickOutside();

  expect(onClose).toBeCalled();
});

test('supports the "dialogRef" prop', () => {
  const called = jest.fn();
  expect.assertions(1);
  const dialogRef = called;
  const dialog = mount(
    <Dialog {...defaults} show={true} dialogRef={dialogRef}>
      {'Hi'}
    </Dialog>
  );
  expect(called).toBeCalled();
  dialog.unmount();
});

test('passes additional props through to dialog element', () => {
  const onKeyDown = jest.fn();
  const dialog = mount(
    <Dialog {...defaults} show={true} data-foo="true" onKeyDown={onKeyDown}>
      {'hi'}
    </Dialog>
  );

  dialog.find('[role="dialog"]').simulate('keydown', { which: 9 });

  expect(onKeyDown).toBeCalled();
  expect(dialog.find('[data-foo="true"]').exists()).toBeTruthy();
});

test('does not render the close button given a thruthy "forceAction" prop', () => {
  expect.assertions(1);
  const dialog = mount(
    <Dialog {...defaults} show={true} forceAction={true}>
      {'hello'}
    </Dialog>
  );

  expect(dialog.find('.Modal__close').exists()).toBeFalsy();
  dialog.unmount();
});

test('supports heading from text', async () => {
  const dialog = mount(
    <Dialog {...defaults} heading={'hello title'} show={true}>
      {'body'}
    </Dialog>
  );
  expect(dialog.find('h2').exists()).toBe(true);
  expect(dialog.find('h2').text()).toEqual('hello title');
});

test('supports heading from options', async () => {
  const dialog = mount(
    <Dialog {...defaults} heading={{ text: 'hello title', level: 3 }} show={true}>
      {'body'}
    </Dialog>
  );
  expect(dialog.find('h3').exists()).toBe(true);
  expect(dialog.find('h3').text()).toEqual('hello title');
});

test('should return no axe violations', async () => {
  const dialog = mount(
    <Dialog {...defaults} show={true}>
      Hello Dialog
    </Dialog>
  );
  expect(await axe(dialog.html())).toHaveNoViolations();
});
