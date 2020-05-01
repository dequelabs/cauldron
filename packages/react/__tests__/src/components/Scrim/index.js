import React from 'react';
import { shallow, mount } from 'enzyme';
import Scrim from '../../../../src/components/Scrim';

test('given a initial truthy `show` prop, fades scrim in', done => {
  const scrim = mount(<Scrim show={true} />);
  expect(scrim.state('animationClass')).toBe('dqpl-scrim-show');
  setTimeout(() => {
    // wait for setState to complete
    expect(scrim.state('animationClass')).toBe(
      'dqpl-scrim-show dqpl-scrim-fade-in'
    );
    done();
  });
});

test('given a `show` prop update from falsey to truthy, calls fadeIn', done => {
  const scrim = mount(<Scrim show={false} />);
  expect(scrim.state('animationClass')).toBe('');

  scrim.setProps({ show: true });
  expect(scrim.state('animationClass')).toBe('dqpl-scrim-show');
  setTimeout(() => {
    // wait for setState to complete
    expect(scrim.state('animationClass')).toBe(
      'dqpl-scrim-show dqpl-scrim-fade-in'
    );
    done();
  });
});

test('given a `show` props update from truthy to falsey, calls fadeOut', done => {
  const scrim = mount(<Scrim show={true} />);
  setTimeout(() => {
    // wait for setState to complete
    expect(scrim.state('animationClass')).toBe(
      'dqpl-scrim-show dqpl-scrim-fade-in'
    );

    scrim.setProps({ show: false });

    setTimeout(() => {
      expect(scrim.state('animationClass')).toBe('');
      done();
    }, 100);
  });
});

test('return null given a falsey `show` prop', () => {
  expect.assertions(1);
  const wrapper = shallow(<Scrim show={false} />);
  expect(wrapper.html()).toBe(null);
});
