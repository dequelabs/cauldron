import React from 'react';
import { mount } from 'enzyme';
import TextField from 'src/components/TextField';
import axe from '../../../axe';

test('controlled field', () => {
  let input;
  const field = mount(
    <TextField label="Fred" value="" fieldRef={el => (input = el)} />
  );

  expect(input.value).toBe('');
  field.setProps({
    value: 'bar'
  });
  expect(input.value).toBe('bar');
});

test('uncontrolled field', () => {
  let input;
  const field = mount(
    <TextField label="Fred" defaultValue="foo" fieldRef={el => (input = el)} />
  );

  expect(input.value).toBe('foo');
  input.value = 'bar';
  field.instance().onChange({});
  expect(field.state('value')).toBe('bar');
});

test('multiline=true renders textarea', done => {
  mount(
    <TextField
      multiline
      label="Yo"
      fieldRef={element => {
        expect(element.tagName).toBe('TEXTAREA');
        done();
      }}
    />
  );
});

test('multiline=false renders input', done => {
  mount(
    <TextField
      label="Yo"
      fieldRef={element => {
        expect(element.tagName).toBe('INPUT');
        done();
      }}
    />
  );
});

test('should return no axe violations', async () => {
  const field = mount(<TextField label="Fred" value="" fieldRef={() => {}} />);

  expect(await axe(field.html())).toHaveNoViolations();
});
