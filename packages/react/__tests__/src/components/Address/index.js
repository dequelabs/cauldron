import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  Address,
  AddressLine,
  AddressCityStateZip
} from '../../../../src/components/Address';
import axe from '../../../axe';

describe('Address components', () => {
  test('renders the address emantics', () => {
    const address = shallow(<Address>a</Address>);

    expect(address.is('address')).toBe(true);
  });

  test('handles undefined props', () => {
    const addressLine = shallow(<AddressLine />);
    const addressCityStateZip = shallow(<AddressCityStateZip />);

    expect(addressLine.isEmptyRender()).toBe(true);
    expect(addressCityStateZip.isEmptyRender()).toBe(true);
  });

  test('passes classNames through', () => {
    const address = shallow(<Address className="a">a</Address>);
    const addressLine = shallow(<AddressLine className="b">b</AddressLine>);
    const addressCityStateZip = shallow(
      <AddressCityStateZip className="c" city="Metrocity">
        c
      </AddressCityStateZip>
    );

    expect(address.is('.a')).toBe(true);
    expect(addressLine.is('.b')).toBe(true);
    expect(addressCityStateZip.is('.c')).toBe(true);
  });

  test('passes props through', () => {
    const address = shallow(<Address data-foo="address">a</Address>);
    const addressLine = shallow(<AddressLine data-foo="line">a</AddressLine>);
    const addressCityStateZip = shallow(
      <AddressCityStateZip data-foo="city-state-zip" city="Metrocity" />
    );

    expect(address.is('[data-foo="address"]')).toBe(true);
    expect(addressLine.is('[data-foo="line"]')).toBe(true);
    expect(addressCityStateZip.is('[data-foo="city-state-zip"]')).toBe(true);
  });

  test('returns no axe violations', async () => {
    const address = mount(
      <Address>
        <AddressLine>1234 ABC Drive</AddressLine>
        <AddressCityStateZip
          city="Metrocity"
          state="State of Mind"
          zip="8675309"
        />
      </Address>
    );

    expect(await axe(address.html())).toHaveNoViolations();
  });

  test.each([
    ['Metrocity', undefined, undefined, 'Metrocity'],
    ['Metrocity', 'State of Mind', undefined, 'Metrocity, State of Mind'],
    [
      'Metrocity',
      'State of Mind',
      '8675309',
      'Metrocity, State of Mind 8675309'
    ],
    ['Metrocity', undefined, '8675309', 'Metrocity 8675309'],
    [undefined, 'State of Mind', undefined, 'State of Mind'],
    [undefined, 'State of Mind', '8675309', 'State of Mind 8675309'],
    [undefined, undefined, '8675309', '8675309']
  ])('handles %s, %s, and %s combinations', (city, state, zip, expected) => {
    const addressCityStateZip = shallow(
      <AddressCityStateZip city={city} state={state} zip={zip} />
    );

    expect(addressCityStateZip.text()).toBe(expected);
  });
});
