import React from 'react';
import { mount } from 'enzyme';
import { TopBarTrigger } from 'src/components/TopBar/';
import axe from '../../../axe';

test('should return no axe violations', async () => {
  const item = mount(
    <ul role="menubar">
      <TopBarTrigger>Hamsam</TopBarTrigger>
    </ul>
  );
  expect(await axe(item.html())).toHaveNoViolations();
});
