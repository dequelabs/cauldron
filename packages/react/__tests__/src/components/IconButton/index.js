import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import IconButton from 'src/components/IconButton';
import axe from '../../../axe';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

test('should render button', async () => {
  const wrapper = mount(<IconButton icon="pencil" label="Edit" />);
  await update(wrapper);
  expect(wrapper.find('button').exists()).toBe(true);
});

test('should return no axe violations', async () => {
  const wrapper = mount(<IconButton icon="pencil" label="Edit" />);
  await update(wrapper);
  expect(await axe(wrapper.html())).toHaveNoViolations();
});

test('supports ref prop', done => {
  const ref = iconBtn => {
    iconBtn.expect(iconBtn).toBeNull();
    done();
  };

  mount(<IconButton icon="pencil" label="Edit" ref={ref} />);
});
