import React, { useState } from 'react';
import { mount } from 'enzyme';
import TextField from 'src/components/TextField';
import axe from '../../../axe';

test('using as controlled field does not maintain own state', () => {
  let input;
  const field = mount(
    <TextField label="Fred" value="" fieldRef={el => (input = el)} />
  );

  expect(input.value).toBe('');
  field.setProps({
    value: 'bar'
  });
  expect(input.value).toBe('bar');
  expect(field.state('value')).toBe('');
  expect(field.find('.Error').exists()).toBe(false);
});

test('onChange prop', () => {
  let input;
  const TextContainer = () => {
    const [textValue, setTextValue] = useState('');
    return (
      <>
        <div id="textValueDiv">{textValue}</div>
        <TextField
          label="Fred"
          value={textValue}
          onChange={changedValue => {
            setTextValue(changedValue);
          }}
          fieldRef={el => (input = el)}
        />
      </>
    );
  };

  const fieldContainer = mount(<TextContainer />);

  expect(fieldContainer.find('#textValueDiv').text()).toBe('');
  input.value = 'foo';
  fieldContainer.find('input').simulate('change');
  expect(fieldContainer.find('#textValueDiv').text()).toBe('foo');
});

test('using as uncontrolled field maintains own state', () => {
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

test('required renders required text', () => {
  const field = mount(
    <TextField label="Yo" required requiredText="This is required" />
  );

  expect(field.find('.Field__required-text').text()).toBe('This is required');
});

test('renders error when present', () => {
  const field = mount(<TextField label="Yo" error="Something is wrong" />);
  const errorElement = field.find('.Error');
  const errorElementId = errorElement.instance().id;
  expect(errorElement.text()).toBe('Something is wrong');
  expect(
    field
      .find('input')
      .getDOMNode()
      .getAttribute('aria-describedby')
  ).toBe(errorElementId);
  expect(
    field
      .find('input')
      .getDOMNode()
      .getAttribute('aria-invalid')
  ).toBe('true');
});

test('should return no axe violations', async () => {
  const field = mount(
    <TextField
      label="Fred"
      value=""
      required
      requiredText="This is required"
      error="Something is wrong"
      fieldRef={() => {}}
    />
  );

  expect(await axe(field.html())).toHaveNoViolations();
});
