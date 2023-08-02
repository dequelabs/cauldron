import React from 'react';
import { mount } from 'enzyme';
import {
  default as ExpandCollapsePanel,
  PanelTrigger
} from 'src/components/ExpandCollapsePanel';
import { createSandbox } from 'sinon';
import * as stylesheets from 'src/utils/stylesheets';

const sandbox = createSandbox();
const noop = () => {};
const matchMedia = {
  matches: false
};

let matchMediaStub;

beforeEach(() => {
  window.matchMedia = window.matchMedia || noop;
  matchMediaStub = sandbox.stub(window, 'matchMedia').returns(matchMedia);
});

afterEach(() => {
  jest.resetAllMocks();
  sandbox.restore();
});

const isVisible = element => {
  const node = element.getDOMNode().parentNode;
  // Ideally we would test against actual DOM, but short-cutting to use `is-hidden`
  // which should have the appropriate styles to be actually hidden
  return !node.classList.contains('is--hidden');
};

test('should render children', () => {
  const children = <div>Hello World</div>;
  const wrapper = mount(<ExpandCollapsePanel>{children}</ExpandCollapsePanel>);

  expect(wrapper.contains(children)).toBeTruthy();
});

test('should render multiple children', () => {
  const wrapper = mount(
    <ExpandCollapsePanel>
      <div>blue</div>
      <div>green</div>
    </ExpandCollapsePanel>
  );

  expect(wrapper.contains('blue')).toBeTruthy();
  expect(wrapper.contains('green')).toBeTruthy();
});

test('should passthrough props', () => {
  const wrapper = mount(
    <ExpandCollapsePanel foo="bar">
      <div data-test />
    </ExpandCollapsePanel>
  );

  expect(
    wrapper
      .find('[data-test]')
      .parent()
      .props().foo
  ).toBe('bar');
});

test('should have hidden content when collapsed', () => {
  const wrapper = mount(
    <ExpandCollapsePanel>
      <div data-test>foo</div>
    </ExpandCollapsePanel>
  );

  expect(isVisible(wrapper.find('[data-test]'))).toBeFalsy();
});

test('should have visible content when expanded', done => {
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={1}>
      <div data-test>foo</div>
    </ExpandCollapsePanel>
  );
  wrapper.instance().setState({ isOpen: true });

  setTimeout(() => {
    expect(isVisible(wrapper.find('[data-test]'))).toBeTruthy();
    done();
  });
});

test('should render PanelTrigger', () => {
  const wrapper = mount(
    <ExpandCollapsePanel>
      <PanelTrigger />
    </ExpandCollapsePanel>
  );
  const trigger = wrapper.find(PanelTrigger);
  expect(trigger).toBeTruthy();
  expect(trigger.props().open).toBeFalsy();
  expect(trigger.props().onClick).toBeTruthy();
});

test('should call onToggle when toggled', () => {
  const handleToggle = jest.fn();
  const wrapper = mount(
    <ExpandCollapsePanel onToggle={handleToggle}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div />
    </ExpandCollapsePanel>
  );

  // Manually calling the `onClick` prop here because of Enzyme oddness
  wrapper
    .find(PanelTrigger)
    .props()
    .onClick({ which: 1 });
  expect(handleToggle).toBeCalledWith(expect.objectContaining({ which: 1 }));
});

test('trigger should open panel collapsed panel', () => {
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={1}>
      <PanelTrigger />
      <div data-test />
    </ExpandCollapsePanel>
  );

  wrapper
    .find(PanelTrigger)
    .props()
    .onClick();

  setTimeout(() => {
    expect(isVisible(wrapper.find('[data-test]'))).toBeTruthy();
  });
});

test('trigger should close expanded panel', done => {
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={1}>
      <PanelTrigger />
      <div data-test />
    </ExpandCollapsePanel>
  );

  wrapper.setState({ isOpen: true });
  wrapper
    .find(PanelTrigger)
    .props()
    .onClick();

  setTimeout(() => {
    expect(isVisible(wrapper.find('[data-test]'))).toBeFalsy();
    done();
  });
});

test('should clean up injected styletags', done => {
  const cleanup = jest.spyOn(stylesheets, 'removeStyleTag');
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={1}>
      <PanelTrigger />
      <div />
    </ExpandCollapsePanel>
  );
  wrapper.setState({ isOpen: true });

  setTimeout(() => {
    wrapper.unmount();
    expect(cleanup).toBeCalled();
    done();
  });
});

test('should not run open animations if timing is not set', done => {
  const setStyle = jest.spyOn(stylesheets, 'setStyle');
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={0}>
      <PanelTrigger />
      <div data-test />
    </ExpandCollapsePanel>
  );
  wrapper
    .find(PanelTrigger)
    .props()
    .onClick();

  setTimeout(() => {
    expect(setStyle).not.toBeCalled();
    expect(isVisible(wrapper.find('[data-test]'))).toBeTruthy();
    done();
  });
});

test('should not run close animations if timing is not set', done => {
  const setStyle = jest.spyOn(stylesheets, 'setStyle');
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={0}>
      <PanelTrigger />
      <div data-test />
    </ExpandCollapsePanel>
  );
  wrapper.setState({ isOpen: true });
  wrapper
    .find(PanelTrigger)
    .props()
    .onClick();

  setTimeout(() => {
    expect(setStyle).not.toBeCalled();
    expect(isVisible(wrapper.find('[data-test]'))).toBeFalsy();
    done();
  });
});

test('should allow for controlled component', () => {
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={0} open={true}>
      <PanelTrigger />
      <div data-test />
    </ExpandCollapsePanel>
  );
  expect(wrapper.state()).toEqual({ controlled: true, isOpen: true });
  expect(isVisible(wrapper.find('[data-test]'))).toBeTruthy();
});

test('should be able to switch between controlled and uncontrolled component', () => {
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={0}>
      <PanelTrigger />
      <div data-test />
    </ExpandCollapsePanel>
  );
  expect(wrapper.state('controlled')).toBeFalsy();
  wrapper.setProps({ open: true });
  expect(wrapper.state('controlled')).toBeTruthy();
});

test('should not animate open when prefers reduced motion is enabled', () => {
  matchMediaStub
    .withArgs('(prefers-reduced-motion: reduce)')
    .returns({ matches: true });
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={500}>
      <div data-test>foo</div>
    </ExpandCollapsePanel>
  );

  wrapper.instance().setState({ isOpen: true });
  expect(wrapper.state('isAnimating')).toBeFalsy();
});

test('should not animate close when prefers reduced motion is enabled', () => {
  matchMediaStub
    .withArgs('(prefers-reduced-motion: reduce)')
    .returns({ matches: true });
  const wrapper = mount(
    <ExpandCollapsePanel animationTiming={500} open={true}>
      <div data-test>foo</div>
    </ExpandCollapsePanel>
  );

  wrapper.instance().setState({ isOpen: false });
  expect(wrapper.state('isAnimating')).toBeFalsy();
});
