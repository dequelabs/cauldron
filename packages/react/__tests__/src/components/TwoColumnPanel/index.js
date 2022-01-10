import React from 'react';
import { mount } from 'enzyme';
import {
  TwoColumnPanel,
  ColumnLeft,
  ColumnRight,
  ColumnHeader,
  ColumnGroupHeader
} from 'src/components/RadioGroup';
import axe from '../../../axe';

test('should render TwoColumnPanel', async () => {
  const wrapper = mount(
    <TwoColumnPanel>
      <ColumnLeft>
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight>
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );
  expect(wrapper.find('.TwoColumnPanel').exists()).toBeTruthy();
});

test('should return no axe violations', async () => {
  const wrapper = mount(
    <TwoColumnPanel>
      <ColumnLeft>
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight>
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );
  expect(await axe(wrapper.html())).toHaveNoViolations();
});
