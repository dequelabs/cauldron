import React from 'react';
import { mount } from 'enzyme';
import OptionsMenu from 'src/components/OptionsMenu';
import axe from '../../../axe';

const trigger = props => (
  <button data-trigger type="button" {...props}>
    foo
  </button>
);

const [down] = [40];

test('should render children', () => {
  const wrapper = mount(
    <OptionsMenu trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );
  expect(wrapper.find('li')).toHaveLength(2);
});

test('should render trigger prop', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );
  expect(optionsMenu.find('[data-trigger]')).toHaveLength(1);
});

test('should toggle menu on trigger clicks', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = optionsMenu.find('[data-trigger]');
  button.simulate('click');
  expect(optionsMenu.state('show')).toBeTruthy();
  button.simulate('click');
  expect(optionsMenu.state('show')).toBeFalsy();
});

test('should click trigger with down key on trigger', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );
  const button = optionsMenu.find('[data-trigger]');
  const onClick = jest.spyOn(button.getDOMNode(), 'click');
  button.simulate('keydown', { which: down, target: button.getDOMNode() });
  expect(onClick).toBeCalled();
});

test('should focus trigger on close', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );
  const button = optionsMenu.find('[data-trigger]');
  const focus = jest.spyOn(button.getDOMNode(), 'focus');
  optionsMenu.instance().handleClose();
  expect(focus).toBeCalled();
});

test('should call onClose when closed', () => {
  const onClose = jest.fn();
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger} onClose={onClose}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );
  optionsMenu.setState({ show: true });
  optionsMenu.find('.foo').simulate('click');
  expect(onClose).toBeCalled();
});

test('should return no axe violations', async () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );
  expect(await axe(optionsMenu.html())).toHaveNoViolations();
});

test('should pass className through to OptionsMenuWrapper', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger} className="foo bar">
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(optionsMenu.find('.OptionsMenu.foo.bar').exists()).toBe(true);
});

test('should set ClickOutsideListener events to false when OptionsMenu is not shown', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger} show={false}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );
  expect(
    optionsMenu.find('ClickOutsideListener').prop('mouseEvent')
  ).toBeFalsy();
  expect(
    optionsMenu.find('ClickOutsideListener').prop('touchEvent')
  ).toBeFalsy();
});

test('should set ClickOutsideListener events to default values when OptionsMenu is shown', () => {
  const optionsMenu = mount(
    <OptionsMenu trigger={trigger} show={true}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );
  expect(optionsMenu.find('ClickOutsideListener').prop('mouseEvent')).toEqual(
    'click'
  );
  expect(optionsMenu.find('ClickOutsideListener').prop('touchEvent')).toEqual(
    'touchend'
  );
});
