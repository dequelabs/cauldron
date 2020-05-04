import React from 'react';
import { mount } from 'enzyme';
import {
  default as OptionsMenu,
  OptionsMenuItem
} from 'src/components/OptionsMenu';
import axe from '../../../axe';

const defaultMenuProps = {
  // eslint-disable-next-line react/display-name
  trigger: props => (
    <button {...props} type="button">
      thingy
    </button>
  )
};

test('should call onSelect when menuitem is clicked', () => {
  const onSelect = jest.fn();
  const optionsMenu = mount(
    <OptionsMenu {...defaultMenuProps}>
      <OptionsMenuItem onSelect={onSelect}>option 1</OptionsMenuItem>
    </OptionsMenu>
  );
  optionsMenu.find('li').simulate('click', {});
  expect(onSelect).toBeCalled();
});

test('should not call onSelect when menuitem is disabled', () => {
  const onSelect = jest.fn();
  const optionsMenu = mount(
    <OptionsMenu {...defaultMenuProps}>
      <OptionsMenuItem onSelect={onSelect} disabled>
        option 1
      </OptionsMenuItem>
    </OptionsMenu>
  );
  optionsMenu.find('li').simulate('click');
  expect(onSelect).not.toBeCalled();
});

test('should return no axe violations', async () => {
  const optionsMenu = mount(
    <OptionsMenu {...defaultMenuProps}>
      <OptionsMenuItem>option 1</OptionsMenuItem>
      <OptionsMenuItem>option 2</OptionsMenuItem>
    </OptionsMenu>
  );
  expect(await axe(optionsMenu.html())).toHaveNoViolations();
});
