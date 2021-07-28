import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from '../../../../src/components/DescriptionList';
import axe from '../../../axe';

describe('DescriptionList components', () => {
  test('renders the description list semantics', () => {
    const list = shallow(<DescriptionList>a</DescriptionList>);
    const term = shallow(<DescriptionTerm>a</DescriptionTerm>);
    const details = shallow(<DescriptionDetails>a</DescriptionDetails>);

    expect(list.is('dl')).toBe(true);
    expect(term.is('dt')).toBe(true);
    expect(details.is('dd')).toBe(true);
  });

  test('DescriptionList handles collapsed prop', () => {
    const defaultList = shallow(<DescriptionList>a</DescriptionList>);
    const collapsedList = shallow(
      <DescriptionList collapsed>a</DescriptionList>
    );

    expect(defaultList.is('.DescriptionList--collapsed')).toBe(false);
    expect(collapsedList.is('.DescriptionList--collapsed')).toBe(true);
  });

  test('passes classNames through', () => {
    const list = shallow(<DescriptionList className="a">a</DescriptionList>);
    const term = shallow(<DescriptionTerm className="b">b</DescriptionTerm>);
    const details = shallow(
      <DescriptionDetails className="c">c</DescriptionDetails>
    );

    expect(list.is('.a')).toBe(true);
    expect(term.is('.b')).toBe(true);
    expect(details.is('.c')).toBe(true);
  });

  test('passes props through', () => {
    const list = shallow(<DescriptionList data-foo="list">a</DescriptionList>);
    const term = shallow(<DescriptionTerm data-foo="term">a</DescriptionTerm>);
    const details = shallow(
      <DescriptionDetails data-foo="detail">a</DescriptionDetails>
    );

    expect(list.is('[data-foo="list"]')).toBe(true);
    expect(term.is('[data-foo="term"]')).toBe(true);
    expect(details.is('[data-foo="detail"]')).toBe(true);
  });

  test('returns no axe violations', async () => {
    const list = mount(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>details</DescriptionDetails>
        </DescriptionListItem>
      </DescriptionList>
    );

    expect(await axe(list.html())).toHaveNoViolations();
  });
});
