import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { createSandbox } from 'sinon';
import {
  default as TwoColumnPanel,
  ColumnLeft,
  ColumnRight,
  ColumnHeader,
  ColumnGroupHeader
} from 'src/components/TwoColumnPanel';
import SkipLink from 'src/components/SkipLink';
import axe from '../../../axe';

const sandbox = createSandbox();
const mediaAddEventListener = sandbox.stub();
const noop = () => {};
const matchMedia = {
  matches: false,
  addEventListener: mediaAddEventListener
};

beforeEach(() => {
  window.matchMedia = window.matchMedia || noop;
  sandbox.stub(window, 'matchMedia').returns(matchMedia);
});

afterEach(() => {
  sandbox.restore();
});

test('should render TwoColumnPanel', () => {
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
  expect(wrapper.find('ColumnLeft').exists()).toBeTruthy();
  expect(wrapper.find('ColumnRight').exists()).toBeTruthy();
  expect(
    wrapper.find('ColumnRight button[aria-expanded]').prop('aria-expanded')
  ).toBeTruthy();
  const id = wrapper.find('ColumnLeft').prop('id');
  expect(
    wrapper.find('ColumnRight button[aria-expanded]').prop('aria-controls')
  ).toEqual(id);
});

test('should render collapsed TwoColumnPanel', () => {
  window.matchMedia.withArgs('(max-width: 45rem)').returns({
    matches: true,
    addEventListener: noop
  });
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
  expect(wrapper.find('ColumnLeft').exists()).toBeFalsy();
  expect(wrapper.find('ColumnRight').exists()).toBeTruthy();
  expect(
    wrapper.find('ColumnRight button[aria-expanded]').prop('aria-expanded')
  ).toBeFalsy();
});

test('should accept a skip link', () => {
  const wrapper = mount(
    <TwoColumnPanel skipLink={<SkipLink target="#my-target" />}>
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
        <div id="my-target">1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  expect(wrapper.find('.SkipLink').exists()).toBeTruthy();
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
  expect(await axe(document.body.innerHTML)).toHaveNoViolations();
});
