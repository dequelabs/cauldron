import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server'; // convert the React element to HTML
import Select from './';
import axe from '../../axe';

const defaultProps = {
  name: 'Test Select',
  label: 'Test Select'
};

const withCustomOptions = (otherProps = {}) => {
  const options = [
    { key: '1', value: 'Fred' },
    { key: '2', value: 'Bill' },
    { key: '3', value: 'Ted' },
    { key: '4', value: 'Bob' }
  ];

  return render(
    <div>
      <Select
        {...defaultProps}
        {...otherProps}
        defaultValue="Bill"
        options={options}
      />
    </div>
  );
};

test('Should render the expected UI elements', () => {
  withCustomOptions();

  expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
  expect(
    screen.getByText(defaultProps.name).parentElement?.parentElement
  ).toHaveClass('Field__select');
  expect(screen.getAllByRole('option')[0]).toHaveClass('Field__option');
  expect(screen.getAllByRole('option')).toHaveLength(4);
  expect(screen.queryByText('Required')).toBeNull();
  expect(screen.queryByText('Error')).toBeNull();
});

test('Should set option attributes properly', () => {
  render(
    <Select
      {...defaultProps}
      defaultValue="a"
      options={[
        { key: '1', value: 'a' },
        { disabled: true, key: '2', value: 'b' },
        { key: '3', value: 'c' }
      ]}
    />
  );

  expect(screen.getAllByRole('option')).toHaveLength(3);
  expect(screen.getByText('b')).toBeInTheDocument();
});

test('Should pass ref properly', () => {
  const ref = React.createRef<HTMLSelectElement>();
  render(
    <Select
      {...defaultProps}
      id="test-id"
      ref={ref}
      defaultValue="a"
      options={[{ key: '1', value: 'a' }]}
    />
  );

  expect(ref.current).toBeInTheDocument();
  expect(ref.current).toHaveAttribute('id', 'test-id');
});

test('Should pass children properly', () => {
  render(
    <Select {...defaultProps} defaultValue="a">
      <option>a</option>
      <option disabled>b</option>
      <option>c</option>
    </Select>
  );

  expect(screen.getAllByRole('option')).toHaveLength(3);
  expect(screen.getByText('b')).toBeInTheDocument();
});

test('Should render required text', () => {
  withCustomOptions({ required: true });
  expect(screen.getByText('Required')).toBeInTheDocument();

  withCustomOptions({ required: true, requiredText: 'Bananas' });
  expect(screen.getByText('Bananas')).toBeInTheDocument();
});

test('Should handle errors', () => {
  const errorText = 'ErR0r';
  withCustomOptions({ error: errorText });

  expect(screen.getByText(errorText)).toBeInTheDocument();
  expect(screen.getByText(errorText)).toHaveAttribute(
    'id',
    screen.getByText(errorText).id
  );
  expect(screen.getByRole('combobox')).toHaveAttribute(
    'aria-describedby',
    screen.getByText(errorText).id
  );
  expect(screen.getByText(defaultProps.name).parentElement).toHaveClass(
    'Field__label',
    'Field__label--has-error'
  );
  expect(screen.getByRole('combobox').parentElement).toHaveClass(
    'Field__select--wrapper',
    'Field--has-error'
  );
});

test('Should support "controlled" select', () => {
  const { rerender } = render(
    <Select
      {...defaultProps}
      value="Far"
      options={[
        { key: '1', value: 'Bar' },
        { key: '2', value: 'Foo' },
        { key: '3', value: 'Far' },
        { key: '4', value: 'Fan' },
        { key: '5', value: 'Fun' }
      ]}
    />
  );

  expect(
    screen.getByRole('combobox', { name: /test select/i })
  ).toHaveDisplayValue('Far');

  rerender(
    <Select
      {...defaultProps}
      value="Bar"
      options={[
        { key: '1', value: 'Bar' },
        { key: '2', value: 'Foo' },
        { key: '3', value: 'Far' },
        { key: '4', value: 'Fan' },
        { key: '5', value: 'Fun' }
      ]}
    />
  );

  expect(
    screen.getByRole('combobox', { name: /test select/i })
  ).toHaveDisplayValue('Bar');
});

test('Should fire onChange when change occurs', () => {
  const onChange = jest.fn();

  render(
    <Select
      {...defaultProps}
      onChange={onChange}
      options={[
        { key: '1', value: 'Bar' },
        { key: '2', value: 'Foo' }
      ]}
    />
  );

  fireEvent.change(screen.getByRole('combobox'));
  expect(onChange).toHaveBeenCalled();
});

test('Should render a ReactNode as a label', () => {
  withCustomOptions({ label: <span>Foo</span> });
  expect(screen.getByText('Foo')).toBeInTheDocument();
});

test('Should return no axe violations', async () => {
  const opts = [
    { key: '1', value: 'Bar' },
    { key: '2', value: 'Foo' },
    { key: '3', value: 'Far' },
    { key: '4', value: 'Fan' },
    { key: '5', value: 'Fun' }
  ];

  const select = (
    <div>
      <Select {...defaultProps} defaultValue="Bar" options={opts} />
    </div>
  );

  const html = renderToString(select);
  expect(await axe(html)).toHaveNoViolations();
});

test('Should return no axe violations for a disabled select', async () => {
  const opts = [
    { key: '1', value: 'Bar' },
    { key: '2', value: 'Foo' },
    { key: '3', value: 'Far' },
    { key: '4', value: 'Fan' },
    { key: '5', value: 'Fun' }
  ];

  const disabledSelect = (
    <div>
      <Select {...defaultProps} disabled defaultValue="Bar" options={opts} />
    </div>
  );

  const html = renderToString(disabledSelect);
  expect(await axe(html)).toHaveNoViolations();
});

test('Should return no axe violations for a required select', async () => {
  const opts = [
    { key: '1', value: 'Bar' },
    { key: '2', value: 'Foo' },
    { key: '3', value: 'Far' },
    { key: '4', value: 'Fan' },
    { key: '5', value: 'Fun' }
  ];

  const requiredSelect = (
    <div>
      <Select {...defaultProps} required defaultValue="Bar" options={opts} />
    </div>
  );

  const html = renderToString(requiredSelect);
  expect(await axe(html)).toHaveNoViolations();
});

test('Should return no axe violations for an error select', async () => {
  const opts = [
    { key: '1', value: 'Bar' },
    { key: '2', value: 'Foo' },
    { key: '3', value: 'Far' },
    { key: '4', value: 'Fan' },
    { key: '5', value: 'Fun' }
  ];

  const errorSelect = (
    <div>
      <Select
        {...defaultProps}
        required
        error="Bananananas"
        defaultValue="Bar"
        options={opts}
      />
    </div>
  );

  const html = renderToString(errorSelect);
  expect(await axe(html)).toHaveNoViolations();
});
