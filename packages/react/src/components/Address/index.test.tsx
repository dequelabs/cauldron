import React from 'react';
import { render, screen } from '@testing-library/react';
import { Address, AddressLine, AddressCityStateZip } from './';
import axe from '../../axe';

test('should render the address semantics', () => {
  render(<Address data-testid="address">a</Address>);
  expect(screen.getByTestId('address')).toBeInTheDocument();
});

test('should handle undefined props, ensuring that the address line is not rendered', () => {
  render(<AddressLine data-testid="line" />);
  expect(screen.queryByTestId('line')).toBeNull();
});

test('should handle undefined props, ensuring that the address city, state, and zip is not rendered', () => {
  render(
    <AddressCityStateZip
      data-testid="city-state-zip"
      city={undefined}
      state={undefined}
      zip={undefined}
    />
  );
  expect(screen.queryByTestId('city-state-zip')).toBeNull();
});

test('should pass className through', () => {
  render(
    <>
      <Address className="a">a</Address>
      <AddressLine className="b">b</AddressLine>
      <AddressCityStateZip
        className="c"
        city="Metrocity"
        state={undefined}
        zip={undefined}
      />
    </>
  );

  expect(screen.getByText('a')).toHaveClass('a');
  expect(screen.getByText('b')).toHaveClass('b');
  expect(screen.getByText('Metrocity')).toHaveClass('c');
});

test('should pass props through', () => {
  render(
    <>
      <Address data-foo="address">a</Address>
      <AddressLine data-foo="line">b</AddressLine>
      <AddressCityStateZip
        data-foo="city-state-zip"
        city="Metrocity"
        state={undefined}
        zip={undefined}
      />
    </>
  );

  expect(screen.getByText('a')).toHaveAttribute('data-foo', 'address');
  expect(screen.getByText('b')).toHaveAttribute('data-foo', 'line');
  expect(screen.getByText('Metrocity')).toHaveAttribute(
    'data-foo',
    'city-state-zip'
  );
});

test.each([
  ['Metrocity', undefined, undefined, 'Metrocity'],
  ['Metrocity', 'State of Mind', undefined, 'Metrocity, State of Mind'],
  ['Metrocity', 'State of Mind', '8675309', 'Metrocity, State of Mind 8675309'],
  ['Metrocity', undefined, '8675309', 'Metrocity 8675309'],
  [undefined, 'State of Mind', undefined, 'State of Mind'],
  [undefined, 'State of Mind', '8675309', 'State of Mind 8675309'],
  [undefined, undefined, '8675309', '8675309']
])(
  'should handle combinations with city: %s, state: %s, zip: %s, and expected: %s',
  (city, state, zip, expected) => {
    const { container } = render(
      <AddressCityStateZip city={city} state={state} zip={zip} />
    );

    expect(container).toHaveTextContent(expected);
  }
);

test('returns no axe violations', async () => {
  const { container } = render(
    <Address>
      <AddressLine>1234 ABC Drive</AddressLine>
      <AddressCityStateZip
        city="Metrocity"
        state="State of Mind"
        zip="8675309"
      />
    </Address>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
