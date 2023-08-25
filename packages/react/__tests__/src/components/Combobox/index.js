import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import {
  default as Combobox,
  ComboboxGroup,
  ComboboxItem
} from 'src/components/Combobox';

const simulateKeydown =
  (wrapper, key) =>
  (event = {}) => {
    wrapper.simulate('keydown', { key, ...event });
    wrapper.update();
  };

test.todo('should render combobox with items');

test.todo('should render combobox with children');

test.todo('should render combobox with groups');

test.todo('should open combobox listbox on click');

test.todo('should open combobox listbox on focus');

test.todo('should open combobox listbox on keypress');

test.todo('should close combobox listbox on "esc" keypress');

test.todo('should close combobox listbox on "blur"');

test.todo('should close combobox listbox when selecting option via click');

test.todo(
  'should not close combobox listbox when selecting option via keypress'
);

test.todo('should render all options when autocomplete="none"');

test.todo('should render matching options when autocomplete="manual"');

test.todo(
  'should render results not found when no options match when autocomplete="manual"'
);

test.todo('should render matching options when autocomplete="automatic"');

test.todo(
  'should render results not found when no options match when autocomplete="automatic"'
);

test.todo(
  'should set first active descendent when autocomplete="automatic" on open'
);

test.todo('should use id from props when set');

test.todo('should set selected value with "defaultValue" prop');

test.todo('should set selected value with "value" prop');
