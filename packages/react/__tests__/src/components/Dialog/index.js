import React from 'react';
import { setImmediate } from 'timers/promises';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  default as Dialog,
  DialogContent,
  DialogFooter
} from 'src/components/Dialog';
import axe from '../../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('returns null if passed a falsey "show" prop', () => {
  expect.assertions(1);
  const dialog = mount(<Dialog {...defaults}>{'hello'}</Dialog>);

  expect(dialog.html()).toBe(null);
});

test('focuses heading when mounted with a truthy "show" prop', (done) => {
  const dialog = mount(
    <Dialog {...defaults} show={true}>
      hello
    </Dialog>
  );

  setTimeout(() => {
    // setting timeout to wait for fade-in (like the src does)
    expect(document.activeElement).toBe(dialog.instance().heading);
    dialog.unmount();
    done();
  }, 10);
});

test('focuses heading when "show" prop is updated from falsey to truthy', (done) => {
  const dialog = mount(<Dialog {...defaults}>{'hello'}</Dialog>);

  dialog.setProps({ show: true }, () => {
    setTimeout(() => {
      expect(document.activeElement).toBe(dialog.instance().heading);
      dialog.unmount();
      done();
    }, 10);
  });
});

test('associates dialog with heading', () => {
  const dialog = mount(
    <Dialog {...defaults} show={true}>
      hello
    </Dialog>
  );
  expect(dialog.find('[role="dialog"]').prop('aria-labelledby')).toBeTruthy();
  expect(dialog.find('h2').prop('id')).toBeTruthy();
  expect(dialog.find('[role="dialog"]').prop('aria-labelledby')).toEqual(
    dialog.find('h2').prop('id')
  );
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

test('does not call onClose if the dialog is not currently shown', () => {
  const onClose = jest.fn();
  const dialog = mount(
    <Dialog {...defaults} show={false} onClose={onClose}>
      {'hello'}
    </Dialog>
  );

  dialog.instance().close();

  expect(onClose).not.toBeCalled();
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
    <Dialog
      {...defaults}
      heading={{ text: 'hello title', level: 3 }}
      show={true}
    >
      {'body'}
    </Dialog>
  );
  expect(dialog.find('h3').exists()).toBe(true);
  expect(dialog.find('h3').text()).toEqual('hello title');
});

test('deactivates aria isolate on unmount', async () => {
  const dialog = mount(
    <Dialog {...defaults} show={true}>
      {'body'}
    </Dialog>
  );

  const deactivate = sinon.spy();
  dialog.setState({ isolator: { deactivate, activate: () => {} } });
  dialog.update();

  expect(deactivate.notCalled).toBe(true);
  dialog.unmount();
  await setImmediate();
  expect(deactivate.called).toBe(true);
});

test('should set alignment on dialog content', () => {
  const wrapper = mount(<DialogContent align="left" />);

  expect(wrapper.find('.Dialog__content').hasClass('text--align-left')).toEqual(
    true
  );
  wrapper.setProps({ align: 'center' });
  expect(
    wrapper.find('.Dialog__content').hasClass('text--align-center')
  ).toEqual(true);
  wrapper.setProps({ align: 'right' });
  expect(
    wrapper.find('.Dialog__content').hasClass('text--align-right')
  ).toEqual(true);
});

test('should set alignment on dialog footer', async () => {
  const wrapper = mount(<DialogFooter align="left" />);

  expect(wrapper.find('.Dialog__footer').hasClass('text--align-left')).toEqual(
    true
  );
  wrapper.setProps({ align: 'center' });
  expect(
    wrapper.find('.Dialog__footer').hasClass('text--align-center')
  ).toEqual(true);
  wrapper.setProps({ align: 'right' });
  expect(wrapper.find('.Dialog__footer').hasClass('text--align-right')).toEqual(
    true
  );
});

test('should return no axe violations', async () => {
  const dialog = mount(
    <Dialog {...defaults} show={true}>
      Hello Dialog
    </Dialog>
  );
  expect(await axe(dialog.html())).toHaveNoViolations();
});
