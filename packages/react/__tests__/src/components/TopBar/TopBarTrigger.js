import React from 'react';
import { mount } from 'enzyme';
import { TopBarTrigger } from 'src/components/TopBar/';

test('handles enter/space keydowns', () => {
  let clicked = false;
  let keyed = false;
  const e = { which: 13, preventDefault: () => {} };
  const wrapper = mount(
    <TopBarTrigger
      onClick={() => (clicked = true)}
      onKeyDown={() => (keyed = true)}
    />
  );
  // ENTER
  wrapper.instance().onKeyDown(e);
  expect(clicked).toBeTruthy();
  expect(keyed).toBeTruthy();
  // reset
  clicked = false;
  keyed = false;
  // SPACE
  wrapper.instance().onKeyDown({ ...e, which: 32 });
  expect(clicked).toBeTruthy();
  expect(keyed).toBeTruthy();
});
