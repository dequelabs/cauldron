import React from 'react';
import { render, screen } from '@testing-library/react';
import FieldGroup from './';
import axe from '../../axe';

test('should render FieldGroup with label and children', () => {
  render(
    <FieldGroup label="Group Label">
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
    </FieldGroup>
  );

  expect(
    screen.getByRole('group', { name: 'Group Label' })
  ).toBeInTheDocument();
  expect(screen.getByText('Group Label')).toBeInTheDocument();
});

test('should render with description', () => {
  render(
    <FieldGroup label="Group Label" description="Group Description">
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
    </FieldGroup>
  );

  expect(
    screen.getByRole('group', { description: 'Group Description' })
  ).toBeInTheDocument();
  expect(screen.getByText('Group Description')).toBeInTheDocument();
});

test('should set aria-describedby to both description and error IDs when both are provided', () => {
  render(
    <FieldGroup
      id="custom-id"
      label="Group Label"
      description="Group Description"
      error="Group Error"
    >
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  const group = screen.getByRole('group');
  expect(group).toHaveAccessibleDescription('Group Description Group Error');
});

test('should render with error message', () => {
  render(
    <FieldGroup
      label="Group Label"
      error="You must include both first and last name"
    >
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
    </FieldGroup>
  );

  const error = screen.getByText('You must include both first and last name');
  expect(error).toBeInTheDocument();
  expect(error).toHaveClass('Field__error');
});

test('should use provided id', () => {
  render(
    <FieldGroup
      id="custom-id"
      label="Group Label"
      description="Group Description"
    >
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  expect(screen.getByRole('group')).toHaveAttribute(
    'aria-labelledby',
    'custom-id-label'
  );
  expect(screen.getByText('Group Label')).toHaveAttribute(
    'id',
    'custom-id-label'
  );
  expect(screen.getByText('Group Description')).toHaveAttribute(
    'id',
    'custom-id-description'
  );
});

test('should generate ids when not provided', () => {
  render(
    <FieldGroup label="Group Label" description="Group Description">
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  const group = screen.getByRole('group');
  const labelText = screen.getByText('Group Label');
  const descriptionText = screen.getByText('Group Description');
  const labelId = group.getAttribute('aria-labelledby');
  const descriptionId = group.getAttribute('aria-describedby');

  expect(labelId).not.toBeFalsy();
  expect(descriptionId).not.toBeFalsy();

  expect(labelText.getAttribute('id')).toEqual(labelId);
  expect(descriptionText.getAttribute('id')).toEqual(descriptionId);
});

test('should support className', () => {
  render(
    <FieldGroup label="Group Label" className="custom-class">
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  expect(screen.getByRole('group')).toHaveClass('FieldGroup');
  expect(screen.getByRole('group')).toHaveClass('custom-class');
});

test('should forward additional props to fieldgroup element', () => {
  render(
    <FieldGroup
      label="Group Label"
      data-testid="custom-test-id"
      data-custom="custom-attribute"
    >
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  expect(screen.getByRole('group')).toHaveAttribute(
    'data-testid',
    'custom-test-id'
  );
  expect(screen.getByRole('group')).toHaveAttribute(
    'data-custom',
    'custom-attribute'
  );
});

test('should not show description when description is not provided', () => {
  render(
    <FieldGroup label="Personal Information">
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  expect(screen.getByRole('group')).not.toHaveAttribute('aria-describedby');
});

test('should pass ref to the fieldgroup element', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <FieldGroup ref={ref} label="Group Label">
      <input type="text" placeholder="First Name" />
    </FieldGroup>
  );

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveAttribute('role', 'group');
});

test('should return no axe violations with only label', async () => {
  const { container } = render(
    <FieldGroup label="Group Label">
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
    </FieldGroup>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with label and description', async () => {
  const { container } = render(
    <FieldGroup label="Group Label" description="Please enter your full name">
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
    </FieldGroup>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with label, description, and error', async () => {
  const { container } = render(
    <FieldGroup
      label="Group Label"
      description="Please enter your full name"
      error="You must include both first and last names"
    >
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
    </FieldGroup>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
