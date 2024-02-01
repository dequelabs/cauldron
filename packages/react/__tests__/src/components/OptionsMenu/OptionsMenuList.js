import React from 'react';
import { mount } from 'enzyme';
import { OptionsMenuList } from 'src/components/OptionsMenu';
import axe from '../../../axe';

const [space, enter, down, esc, tab] = [32, 13, 40, 27, 9];
const noop = () => {};

const defaultProps = {
  onClose: noop
};

test('should render children', () => {
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  expect(wrapper.find('li')).toHaveLength(2);
});

test('should not render falsy children', () => {
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      {false && <li>option 2</li>}
      <li>option 3</li>
    </OptionsMenuList>
  );
  expect(wrapper.find('li')).toHaveLength(2);
});

test('handles up/down keydowns', () => {
  expect.assertions(3);
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  expect(wrapper.state('itemIndex')).toBe(0);

  const li = wrapper.find('li').at(0).getDOMNode();

  li.dispatchEvent(
    new KeyboardEvent('keydown', { which: down, bubbles: true })
  );
  expect(wrapper.state('itemIndex')).toBe(1);

  li.dispatchEvent(
    new KeyboardEvent('keydown', { which: down, bubbles: true })
  );
  expect(wrapper.state('itemIndex')).toBe(0); // circular
});

test('calls onClose given escape keydown', () => {
  const onClose = jest.fn();
  const wrapper = mount(
    <OptionsMenuList show={true} onClose={onClose}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  wrapper
    .find('li')
    .at(0)
    .getDOMNode()
    .dispatchEvent(new KeyboardEvent('keydown', { which: esc, bubbles: true }));

  expect(onClose).toBeCalled();
});

test('calls onClose given a tab keydown', () => {
  const onClose = jest.fn();
  const wrapper = mount(
    <OptionsMenuList show={true} onClose={onClose}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  wrapper
    .find('li')
    .at(0)
    .getDOMNode()
    .dispatchEvent(new KeyboardEvent('keydown', { which: tab, bubbles: true }));

  expect(onClose).toBeCalled();
});

test('calls onClose when clicked outside', () => {
  const onClose = jest.fn();
  const wrapper = mount(
    <OptionsMenuList show={true} onClose={onClose}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  wrapper.instance().handleClickOutside();

  expect(onClose).toBeCalled();
});

test('handles enter / space keydowns', () => {
  expect.assertions(1);
  const clickHandler = jest.fn();
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  const element = wrapper.find('li').at(0).getDOMNode();
  element.addEventListener('click', clickHandler);
  wrapper
    .find('li')
    .at(0)
    .getDOMNode()
    .dispatchEvent(
      new KeyboardEvent('keydown', { which: enter, bubbles: true })
    );

  expect(clickHandler).toBeCalled();
});

test('fires onSelect when menu item is clicked', () => {
  const onSelect = jest.fn();
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  const item = wrapper.find('li').at(0);
  const itemNode = item.getDOMNode();
  item.simulate('click', { target: itemNode });

  expect(onSelect).toBeCalled();
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ target: itemNode })
  );
});

test('fires onSelect when menu item is selected with space', () => {
  const onSelect = jest.fn();
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  const item = wrapper.find('li').at(0);
  const itemNode = item.getDOMNode();

  // Synthetic events that call delegated events apparently don't bubble correctly in enzyme
  itemNode.addEventListener('click', (event) => {
    item.simulate('click', event);
  });

  item
    .getDOMNode()
    .dispatchEvent(
      new KeyboardEvent('keydown', { which: space, bubbles: true })
    );

  expect(onSelect).toBeCalled();
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ target: itemNode })
  );
});

test('fires onSelect when menu item is selected with enter', () => {
  const onSelect = jest.fn();
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  const item = wrapper.find('li').at(0);
  const itemNode = item.getDOMNode();

  // Synthetic events that call delegated events apparently don't bubble correctly in enzyme
  itemNode.addEventListener('click', (event) => {
    item.simulate('click', event);
  });

  item
    .getDOMNode()
    .dispatchEvent(
      new KeyboardEvent('keydown', { which: enter, bubbles: true })
    );

  expect(onSelect).toBeCalled();
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ target: itemNode })
  );
});

test('fires onClose when menu item is selected', () => {
  const onClose = jest.fn();
  const wrapper = mount(
    <OptionsMenuList onClose={onClose}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  wrapper.find('li').at(0).simulate('click');

  expect(onClose).toBeCalled();
});

test('does not fire onClose when menu item is selected and default prevented', () => {
  const onClose = jest.fn();
  const wrapper = mount(
    <OptionsMenuList onClose={onClose}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  wrapper.find('li').at(0).simulate('click', { defaultPrevented: true });

  expect(onClose).not.toBeCalled();
});

test('does not fire onClose when menu item is selected and closeOnSelect is false', () => {
  const onClose = jest.fn();
  const wrapper = mount(
    <OptionsMenuList onClose={onClose} closeOnSelect={false}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  wrapper.find('li').at(0).simulate('click');

  expect(onClose).not.toBeCalled();
});

test('should click child links when clicking on list item', () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <OptionsMenuList {...defaultProps}>
      <li>
        <a href="#foo">Click me!</a>
      </li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  const item = wrapper.find('li').at(0);
  wrapper.find('a').getDOMNode().addEventListener('click', onClick);
  item.simulate('click');

  expect(onClick).toBeCalledTimes(1);
});

test('should click child links with keypress events', () => {
  const onClick = jest.fn();
  const wrapper = mount(
    <OptionsMenuList {...defaultProps}>
      <li>
        <a href="#foo">Click me!</a>
      </li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  const item = wrapper.find('li').at(0);
  wrapper.find('a').getDOMNode().addEventListener('click', onClick);
  item
    .getDOMNode()
    .addEventListener('click', (event) => item.simulate('click', event));
  item
    .getDOMNode()
    .dispatchEvent(
      new KeyboardEvent('keydown', { which: enter, bubbles: true })
    );

  expect(onClick).toBeCalledTimes(1);
});

test('should passthrough classname to menuitem', () => {
  const optionsMenu = mount(
    <OptionsMenuList {...defaultProps}>
      <li className="foo">option 1</li>
    </OptionsMenuList>
  );
  const menuItem = optionsMenu.find('li');
  expect(menuItem.hasClass('foo')).toBeTruthy();
  expect(menuItem.hasClass('OptionsMenu__list-item')).toBeTruthy();
});

test('handles updates to `itemIndex` state', () => {
  const mountElement = document.createElement('div');
  document.body.appendChild(mountElement);
  expect.assertions(1);
  const wrapper = mount(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>,
    { attachTo: mountElement }
  );
  // focus the first item
  wrapper.find('li').at(0).getDOMNode().focus();
  wrapper.setState({ itemIndex: 1 });
  expect(document.activeElement).toBe(wrapper.find('li').at(1).getDOMNode());
});

test('should return no axe violations', async () => {
  const optionsMenu = mount(
    <OptionsMenuList {...defaultProps}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );
  expect(await axe(optionsMenu.html())).toHaveNoViolations();
});
