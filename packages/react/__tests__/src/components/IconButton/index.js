import React, { useRef } from 'react';
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

test('supports ref prop', async () => {
  const TestElement = () => {
    const ref = useRef(null);
    return (
      <>
        <IconButton id="test-id" icon="pencil" label="Edit" ref={ref} />
        <button
          id="test-button"
          onClick={() => {
            ref.current.focus();
          }}
        >
          Test
        </button>
      </>
    );
  };

  const mountedElement = mount(<TestElement />);
  await update(mountedElement);
  mountedElement.find('#test-button').simulate('click');
  expect(document.activeElement.id).toBe('test-id');
});

test('should not render tooltip when disabled prop is true and render label as aria-label', async () => {
  const wrapper = mount(
    <IconButton icon="pencil" label="Edit" disabled={true} />
  );
  await update(wrapper);
  expect(wrapper.find('Tooltip').exists()).toBe(false);
  expect(wrapper.find('button').prop('aria-label')).toBe('Edit');
});
