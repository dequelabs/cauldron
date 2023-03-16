import React from 'react';
import { mount } from 'enzyme';
import IconImpact from '../../../../src/components/IconImpact';

const verifyIconImpactWithoutTooltip = (impact, icon) => {
  const container = mount(<IconImpact impact={impact} showTooltip={false} />);
  expect(container.find('Icon').props('type')).toEqual({
    type: icon
  });
  expect(container.find('.IconImpact').props().className).toBe(
    `IconImpact IconImpact--${impact}`
  );
};

describe('IconImpact', () => {
  test('passes className through', () => {
    const container = mount(
      <IconImpact className="foo" impact="critical" showTooltip={false} />
    );
    expect(container.find('.IconImpact').props().className).toBe(
      'IconImpact IconImpact--critical foo'
    );
  });

  describe('without tooltip', () => {
    test('correct icon used for critical impact', () => {
      verifyIconImpactWithoutTooltip('critical', 'chevron-double-up');
    });
    test('correct icon used for serious impact', () => {
      verifyIconImpactWithoutTooltip('serious', 'chevron-up');
    });
    test('correct icon used for moderate impact', () => {
      verifyIconImpactWithoutTooltip('moderate', 'chevron-down');
    });
    test('correct icon used for minor impact', () => {
      verifyIconImpactWithoutTooltip('minor', 'chevron-double-down');
    });
  });
});
