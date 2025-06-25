import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    <Select
      {...defaultProps}
      {...otherProps}
      defaultValue="Bill"
      options={options}
    />
  );
};

test('Should render the expected UI elements', () => {
  withCustomOptions();

  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getAllByRole('option')[0]).toHaveClass('Field__option');
  expect(screen.getAllByRole('option')).toHaveLength(4);
  expect(screen.queryByText('Required')).toBeNull();
  expect(screen.queryByText('Error')).toBeNull();
  expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
  expect(
    screen.getByText(defaultProps.name).parentElement?.parentElement
  ).toHaveClass('Field__select');
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

  const options = screen.getAllByRole('option');
  const expectedAccessibleNames = ['a', 'b', 'c'];

  expect(options).toHaveLength(3);
  expect(screen.getByText('b')).toBeInTheDocument();
  options.forEach((option, index) => {
    expect(option).toHaveAccessibleName(expectedAccessibleNames[index]);
  });
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
  const options = screen.getAllByRole('option');
  const expectedAccessibleNames = ['a', 'b', 'c'];

  expect(options).toHaveLength(3);
  expect(screen.getByText('b')).toBeInTheDocument();
  options.forEach((option, index) => {
    expect(option).toHaveAccessibleName(expectedAccessibleNames[index]);
  });
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
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription(errorText);
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

test('Should render a ReactNode as a description', () => {
  const description = 'Test description';
  withCustomOptions({ description: <span>{description}</span> });
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription(description);
});

test('Should return no axe violations', async () => {
  const opts = [
    { key: '1', value: 'Bar' },
    { key: '2', value: 'Foo' },
    { key: '3', value: 'Far' },
    { key: '4', value: 'Fan' },
    { key: '5', value: 'Fun' }
  ];

  const select = <Select {...defaultProps} defaultValue="Bar" options={opts} />;

  const { container } = render(select);
  expect(await axe(container)).toHaveNoViolations();
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
    <Select {...defaultProps} disabled defaultValue="Bar" options={opts} />
  );

  const { container } = render(disabledSelect);
  expect(await axe(container)).toHaveNoViolations();
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
    <Select {...defaultProps} required defaultValue="Bar" options={opts} />
  );

  const { container } = render(requiredSelect);
  expect(await axe(container)).toHaveNoViolations();
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
    <Select
      {...defaultProps}
      required
      error="Bananananas"
      defaultValue="Bar"
      options={opts}
    />
  );

  const { container } = render(errorSelect);
  expect(await axe(container)).toHaveNoViolations();
});

test('Should return no axe violations for select with description', async () => {
  const { container } = withCustomOptions({
    description: 'Test description'
  });

  expect(await axe(container)).toHaveNoViolations();
});
