import React from 'react';
import { mount } from 'enzyme';
import Stepper, { Step } from '../../../../src/components/Stepper';
import axe from '../../../axe';

test('Stepper: renders ol and children', () => {
  const stepper = mount(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );

  expect(stepper.find('ol').exists()).toBe(true);
  expect(stepper.find('li').length).toBe(2);
});

test('Stepper: passes className and other props through to <ol /> element', () => {
  const stepper = mount(
    <Stepper className="Foo" data-foo="7">
      <Step status="complete">Foo</Step>
    </Stepper>
  );
  const ol = stepper.find('ol').getDOMNode();

  expect(ol.classList.contains('Foo')).toBe(true);
  expect(ol.classList.contains('Stepper')).toBe(true);
  expect(ol.getAttribute('data-foo')).toBe('7');
});

test('Step: renders li and children', () => {
  const stepper = mount(
    <Step status="current">
      <span>Foo</span>
    </Step>
  );

  expect(stepper.find('li').exists()).toBe(true);
  expect(stepper.find('li span').exists()).toBe(true);
  expect(stepper.text()).toBe('Foo');
});

test('Step: renders tooltip tabstops', () => {
  const stepper = mount(<Step status="current" tooltip="bananas" />);
  expect(stepper.find('TooltipTabstop').exists()).toBe(true);
});

test('Step: manages aria-current attribute', () => {
  const stepper = mount(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );

  expect(
    stepper
      .find('li')
      .at(0)
      .prop('aria-current')
  ).toBe('false');
  expect(
    stepper
      .find('li')
      .at(1)
      .prop('aria-current')
  ).toBe('step');
});

test('should return no axe violations', async () => {
  const stepperWithChildren = mount(
    <Stepper>
      <Step status="complete">Foo</Step>
      <Step status="current">Bar</Step>
    </Stepper>
  );

  const stepperWithTooltip = mount(
    <Stepper>
      <Step status="complete" tooltip="bananas" />
      <Step status="current" tooltip="mangos" />
    </Stepper>
  );

  expect(await axe(stepperWithChildren.html())).toHaveNoViolations();
  expect(
    await axe(
      // since we're only passing the html of the mounted wrapper, here we add
      // the tooltips in manually because they are rendered in a portal outside
      // this wrapper
      `${stepperWithTooltip.html()}<div id="tooltip2">a</div><div id="tooltip3">b</div>`
    )
  ).toHaveNoViolations();
});
