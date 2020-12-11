import React from 'react';
import { shallow } from 'enzyme';
import Line from '../../../../src/components/Line';
import axe from '../../../axe';

test('passes classNames through', () => {
  const link = shallow(<Line className="baz" />);
  expect(link.is('.baz')).toBe(true);
});

test('should return no axe violations', async () => {
  const link = shallow(<Line />);
  expect(await axe(link.html())).toHaveNoViolations();
});
