import React from 'react';
import { mount } from 'enzyme';
import Toast from 'src/components/Toast';
import axe from '../../../axe';

const defaultProps = {
  type: 'confirmation',
  show: false
};

test('handles initial show prop on mount', done => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );

  setTimeout(() => {
    expect(document.activeElement).toBe(wrapper.find('.Toast').getDOMNode());
    expect(wrapper.find('.Toast').hasClass('FadeIn--flex')).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('handles autoHide properly', done => {
  let called = false;
  mount(
    <Toast
      {...defaultProps}
      show={true}
      autoHide={10}
      onDismiss={() => (called = true)}
    >
      {'hi'}
    </Toast>
  );
  setTimeout(() => {
    expect(called).toBe(true);
    done();
  }, 100);
});

test('handles transition from falsey show to truthy show prop', done => {
  const wrapper = mount(<Toast {...defaultProps}>{'hi'}</Toast>);
  expect(wrapper.find('.Toast').hasClass('FadeIn--flex')).toBeFalsy();

  wrapper.setProps({ show: true });

  setTimeout(() => {
    wrapper.update();
    expect(wrapper.find('.Toast').hasClass('FadeIn--flex')).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('handles transition from truthy show to falsey show prop', done => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  expect(wrapper.find('.Toast').hasClass('Hidden')).toBeFalsy();
  wrapper.setProps({ show: false });

  setTimeout(() => {
    // there is a bug relating to enzyme's hasClass so I am forced to use `getDOMNode()` here
    // see https://github.com/airbnb/enzyme/issues/1170
    expect(
      wrapper
        .find('.Toast')
        .getDOMNode()
        .classList.contains('Hidden')
    ).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('renders the expected UI (icons classNames etc)', () => {
  expect.assertions(6);

  const confirmation = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  expect(confirmation.find('.Toast.Toast--success').exists()).toBeTruthy();
  expect(confirmation.find('.fa-info-circle').exists()).toBeTruthy();

  const caution = mount(
    <Toast {...defaultProps} type={'caution'} show={true}>
      {'hi'}
    </Toast>
  );
  expect(caution.find('.Toast.Toast--warning').exists()).toBeTruthy();
  expect(caution.find('.fa-warning').exists()).toBeTruthy();

  const actionNeeded = mount(
    <Toast {...defaultProps} type={'action-needed'} show={true}>
      {'hi'}
    </Toast>
  );
  expect(actionNeeded.find('.Toast.Toast--error').exists()).toBeTruthy();
  expect(actionNeeded.find('.fa-minus-circle').exists()).toBeTruthy();
});

test('handles "action-needed" type', done => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true} type={'action-needed'}>
      {'hi'}
    </Toast>
  );

  setTimeout(() => {
    expect(wrapper.find('.Toast__dismiss').exists()).toBeFalsy();
    expect(wrapper.find('.Scrim--light').exists()).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('clicking the dismiss button properly dismisses toast', done => {
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

test('should return no axe violations', async () => {
  const toast = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );

  expect(await axe(toast.html())).toHaveNoViolations();
});
