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

test('should render button by default', async () => {
  const wrapper = mount(<IconButton icon="pencil" label="Edit" />);
  await update(wrapper);
  const button = wrapper.find('button');
  expect(button.exists()).toBe(true);
  expect(button.prop('type')).toBe('button');
  expect(button.prop('tabIndex')).toBe(0);
  expect(button.prop('role')).toBeUndefined();
});

test('should render a "as" an anchor', async () => {
  const wrapper = mount(<IconButton icon="pencil" label="Link" as="a" />);
  await update(wrapper);
  const a = wrapper.find('a');
  expect(a.exists()).toBe(true);
  expect(a.role).toBeUndefined();
});

test('adds aria-disabled when disabled is passed in for something other than a button', async () => {
  const wrapper = mount(
    <IconButton icon="pencil" label="Link" as="a" disabled />
  );
  await update(wrapper);
  const a = wrapper.find('a');
  expect(a.exists()).toBe(true);
  expect(a.prop('aria-disabled')).toBe(true);
});

test('should add button role when the component is not a link or a button', async () => {
  const CustomButton = React.forwardRef(function Link(props, ref) {
    return <div id="innerElement" ref={ref} {...props}></div>;
  });
  const wrapper = mount(
    <IconButton icon="pencil" label="Edit" as={CustomButton} />
  );
  await update(wrapper);
  const customButton = wrapper.find('#innerElement');
  expect(customButton.exists()).toBe(true);
  expect(customButton.prop('role')).toBe('button');
});

test('should add link role when the component is like a Link but not an anchor', async () => {
  const Link = React.forwardRef(function Link(props, ref) {
    return <div id="innerElement" ref={ref} {...props}></div>;
  });
  const wrapper = mount(
    <IconButton icon="pencil" label="Edit" as={Link} to="/testing" />
  );
  await update(wrapper);
  const link = wrapper.find('#innerElement');
  expect(link.exists()).toBe(true);
  expect(link.prop('role')).toBe('link');
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

test('should not render tooltip when disabled prop is true', async () => {
  const wrapper = mount(
    <IconButton icon="pencil" label="Edit" disabled={true} />
  );
  await update(wrapper);
  expect(wrapper.find('Tooltip').exists()).toBe(false);
  const button = wrapper.find('button');
  expect(button.prop('tabIndex')).toBe(-1);
});
