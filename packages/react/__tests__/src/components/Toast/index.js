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
    expect(document.activeElement).toBe(
      wrapper.find('.dqpl-toast').getDOMNode()
    );
    expect(
      wrapper.find('.dqpl-toast').hasClass('dqpl-fadein-flex')
    ).toBeTruthy();
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
  expect(wrapper.find('.dqpl-toast').hasClass('dqpl-fadein-flex')).toBeFalsy();

  wrapper.setProps({ show: true });

  setTimeout(() => {
    wrapper.update();
    expect(
      wrapper.find('.dqpl-toast').hasClass('dqpl-fadein-flex')
    ).toBeTruthy();
    done();
  }); // wait for animation timeouts / async setState calls
});

test('handles transition from truthy show to falsey show prop', done => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true}>
      {'hi'}
    </Toast>
  );
  expect(wrapper.find('.dqpl-toast').hasClass('dqpl-hidden')).toBeFalsy();
  wrapper.setProps({ show: false });

  setTimeout(() => {
    // there is a bug relating to enzyme's hasClass so I am forced to use `getDOMNode()` here
    // see https://github.com/airbnb/enzyme/issues/1170
    expect(
      wrapper
        .find('.dqpl-toast')
        .getDOMNode()
        .classList.contains('dqpl-hidden')
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
  expect(
    confirmation.find('.dqpl-toast.dqpl-toast-success').exists()
  ).toBeTruthy();
  expect(confirmation.find('.fa-info-circle').exists()).toBeTruthy();

  const caution = mount(
    <Toast {...defaultProps} type={'caution'} show={true}>
      {'hi'}
    </Toast>
  );
  expect(caution.find('.dqpl-toast.dqpl-toast-warning').exists()).toBeTruthy();
  expect(caution.find('.fa-warning').exists()).toBeTruthy();

  const actionNeeded = mount(
    <Toast {...defaultProps} type={'action-needed'} show={true}>
      {'hi'}
    </Toast>
  );
  expect(
    actionNeeded.find('.dqpl-toast.dqpl-toast-error').exists()
  ).toBeTruthy();
  expect(actionNeeded.find('.fa-minus-circle').exists()).toBeTruthy();
});

test('handles "action-needed" type', done => {
  const wrapper = mount(
    <Toast {...defaultProps} show={true} type={'action-needed'}>
      {'hi'}
    </Toast>
  );

  setTimeout(() => {
    expect(wrapper.find('.dqpl-toast-dismiss').exists()).toBeFalsy();
    expect(wrapper.find('.dqpl-scrim-light').exists()).toBeTruthy();
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
  wrapper.find('.dqpl-toast-dismiss').simulate('click');
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
