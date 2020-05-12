import React from 'react';
import { shallow, mount } from 'enzyme';
import Link from '../../../../src/components/Link';
import axe from '../../../axe';

test('passes classNames through', () => {
  const link = shallow(<Link className="baz" />);
  expect(link.is('.baz')).toBe(true);
});

test('supports linkRef', () => {
  let element;
  mount(<Link linkRef={el => (element = el)} />);
  expect(element instanceof HTMLAnchorElement).toBe(true);
});

test('passes arbitrary props through', () => {
  const link = shallow(<Link aria-label="hi">bye</Link>);
  expect(link.is('[aria-label="hi"]')).toBe(true);
  expect(link.text()).toBe('bye');
});

test('handles variant="button"', () => {
  const link = shallow(<Link variant="button">hi</Link>);
  expect(link.is('.Button--primary')).toBe(true);
});

test('should return no axe violations', async () => {
  const link = shallow(<Link href="#">hello</Link>);
  expect(await axe(link.html())).toHaveNoViolations();
});
