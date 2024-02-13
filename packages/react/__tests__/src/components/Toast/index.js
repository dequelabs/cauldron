import React from 'react';
import { setImmediate } from 'timers/promises';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Toast from 'src/components/Toast';
import axe from '../../../axe';

const defaultProps = {
  type: 'confirmation',
  show: false
};

beforeEach(() => {
  document.activeElement.blur();
});

test('handles initial show prop on mount', (done) => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>,
    { attachTo: mountElement }
  );

  setTimeout(() => {
    expect(document.activeElement).toBe(wrapper.find('.Toast').getDOMNode());
    expect(wrapper.find('.Toast').hasClass('FadeIn--flex')).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('handles transition from falsey show to truthy show prop', (done) => {
  const wrapper = mount(<Toast {...defaultProps}>{'hi'}</Toast>);
  expect(wrapper.find('.Toast').hasClass('FadeIn--flex')).toBeFalsy();

  wrapper.setProps({ show: true });

  setTimeout(() => {
    wrapper.update();
    expect(wrapper.find('.Toast').hasClass('FadeIn--flex')).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('handles transition from truthy show to falsey show prop', (done) => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  expect(wrapper.find('.Toast').hasClass('is--hidden')).toBeFalsy();
  wrapper.setProps({ show: false });

  setTimeout(() => {
    // there is a bug relating to enzyme's hasClass so I am forced to use `getDOMNode()` here
    // see https://github.com/airbnb/enzyme/issues/1170
    expect(
      wrapper.find('.Toast').getDOMNode().classList.contains('is--hidden')
    ).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('renders children within the "Toast__message-content" div', () => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      <strong>YO!</strong>
    </Toast>
  );

  expect(wrapper.find('.Toast__message-content strong').text()).toBe('YO!');
});

test('confirmation renders the expected UI and icon', () => {
  const confirmation = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  expect(confirmation.find('.Toast.Toast--success').exists()).toBeTruthy();
  expect(confirmation.find('Icon').at(0).prop('type')).toBe('check-circle');
});

test('confirmation renders the expected UI and icon', () => {
  const confirmation = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  expect(confirmation.find('.Toast.Toast--success').exists()).toBeTruthy();
  expect(confirmation.find('Icon').at(0).prop('type')).toBe('check-circle');
});

test('caution renders the expected UI and icon', () => {
  const caution = mount(
    <Toast {...defaultProps} show type="caution">
      {'hi'}
    </Toast>
  );
  expect(caution.find('.Toast.Toast--warning').exists()).toBeTruthy();
  expect(caution.find('Icon').at(0).prop('type')).toBe('caution');
});

test('error renders the expected UI and icon', () => {
  const caution = mount(
    <Toast {...defaultProps} show type="error">
      {'hi'}
    </Toast>
  );
  expect(caution.find('.Toast.Toast--error').exists()).toBeTruthy();
  expect(caution.find('Icon').at(0).prop('type')).toBe('caution');
});

test('info renders the expected UI and icon', () => {
  const info = mount(
    <Toast {...defaultProps} show type="info">
      {'hi'}
    </Toast>
  );
  expect(info.find('.Toast.Toast--info').exists()).toBeTruthy();
  expect(info.find('Icon').at(0).prop('type')).toBe('info-circle-alt');
});

test('action-needed renders epxected UI, icon, and scrim (no close)', (done) => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true} type={'action-needed'}>
      {'hi'}
    </Toast>
  );

  setTimeout(() => {
    expect(wrapper.find('.Toast.Toast--error').exists()).toBeTruthy();
    expect(wrapper.find('Icon').at(0).prop('type')).toBe('no');
    expect(wrapper.find('.Toast__dismiss').exists()).toBeFalsy();
    expect(wrapper.find('.Scrim--light').exists()).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('clicking the dismiss button properly dismisses toast', (done) => {
  let called = false;
  const wrapper = mount(
    <Toast {...defaultProps} show={true} onDismiss={() => (called = true)}>
      {'hi'}
    </Toast>
  );
  wrapper.find('.Toast__dismiss').simulate('click');
  setTimeout(() => {
    expect(called).toBe(true);
    done();
  }, 10);
});

test('toast should be focused by default', (done) => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>,
    { attachTo: mountElement }
  );
  setTimeout(() => {
    expect(wrapper.getDOMNode()).toBe(document.activeElement);
    done();
  }, 10);
});

test('toast should not be focused with falsey focus prop', (done) => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  mount(
    <Toast {...defaultProps} show={true} focus={false}>
      {'hi'}
    </Toast>,
    { attachTo: mountElement }
  );
  setTimeout(() => {
    expect(document.body).toBe(document.activeElement);
    done();
  }, 10);
});

test('deactivates aria isolate on unmount', async () => {
  const dialog = mount(
    <Toast {...defaultProps} type="action-needed" show={true}>
      {'body'}
    </Toast>
  );

  const deactivate = sinon.spy();
  dialog.setState({ isolator: { deactivate, activate: () => {} } });
  dialog.update();

  expect(deactivate.notCalled).toBe(true);
  dialog.unmount();
  await setImmediate();
  expect(deactivate.called).toBe(true);
});

test('should return no axe violations', async () => {
  const confirmation = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  const caution = mount(
    <Toast {...defaultProps} type="caution" show={true}>
      {'hi'}
    </Toast>
  );
  const error = mount(
    <Toast {...defaultProps} type="error" show={true}>
      {'hi'}
    </Toast>
  );
  const actionNeeded = mount(
    <Toast {...defaultProps} type="action-needed" show={true}>
      {'hi'}
    </Toast>
  );
  const info = mount(
    <Toast {...defaultProps} type="info" show={true}>
      {'hi'}
    </Toast>
  );

  expect(await axe(confirmation.html())).toHaveNoViolations();
  expect(await axe(caution.html())).toHaveNoViolations();
  expect(await axe(error.html())).toHaveNoViolations();
  expect(await axe(actionNeeded.html())).toHaveNoViolations();
  expect(await axe(info.html())).toHaveNoViolations();
});

test('dismiss control is not rendered when dismissible is `false`', (done) => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true} type="info" dismissible={false}>
      {'hi'}
    </Toast>
  );

  setTimeout(() => {
    expect(wrapper.find('.Toast__dismiss').exists()).toBeFalsy();
    done();
  }); // wait for animation timeouts / async setState calls
});
