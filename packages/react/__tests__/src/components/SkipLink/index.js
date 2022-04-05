import React from 'react';
import { mount } from 'enzyme';
import SkipLink from 'src/components/SkipLink';
import axe from '../../../axe';

test('onClick queries the document for the target and focuses it', () => {
  expect.assertions(2);

  const target = window.document.createElement('div');
  target.id = 'skip-target';
  window.document.body.appendChild(target);
  const wrapper = mount(<SkipLink target={'#skip-target'} />);

  wrapper.find('.SkipLink__link').simulate('click');

  expect(document.activeElement).toBe(target);
  expect(target.tabIndex).toBe(-1);
});

test('onFocus sets `currentClass` state properly', done => {
  const wrapper = mount(<SkipLink target={'#skip-target'} />);
  wrapper.instance().onFocus();

  // accounts for async setState calls (including the 2nd one with a timeout)
  setTimeout(() => {
    const node = wrapper.getDOMNode(); // enzyme is silly about hasClass on the wrapper itself
    expect(node.classList.contains('SkipLink--active')).toBeTruthy();
    expect(node.classList.contains('SkipLink--fade')).toBeTruthy();
    done();
  }, 100);
});

test('onBlur sets `currentClass` state properly', done => {
  const wrapper = mount(<SkipLink target={'#skip-target'} />);
  wrapper.instance().onFocus(); // trigger the adding of the classes
  wrapper.instance().onBlur();

  // accounts for async setState calls (including the 2nd one with a timeout)
  setTimeout(() => {
    const node = wrapper.getDOMNode(); // enzyme is silly about hasClass on the wrapper itself
    expect(node.classList.contains('SkipLink--active')).toBeFalsy();
    expect(node.classList.contains('SkipLink--fade')).toBeFalsy();
    done();
  }, 100);
});

test('should return no axe violations', async () => {
  const skiplink = mount(<SkipLink target="#skip-target" />);
  expect(await axe(skiplink.html())).toHaveNoViolations();
});

test('passes props through to the nav element', () => {
  const skipLink = mount(
    <SkipLink target="#skip-target" aria-label="Skip to my lou" />
  );
  expect(
    skipLink
      .find('nav')
      .getDOMNode()
      .getAttribute('aria-label')
  ).toBe('Skip to my lou');
});
