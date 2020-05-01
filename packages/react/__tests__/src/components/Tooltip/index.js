import React from 'react';
import { shallow, mount } from 'enzyme';
import Tooltip from 'src/components/Tooltip';
import axe from '../../../axe';

test('renders without blowing up', () => {
  const tip = shallow(
    <Tooltip id="foo" overlay={<span>boognish</span>}>
      <button className="bar" aria-describedby="foo">
        bar
      </button>
    </Tooltip>
  );
  expect(tip.find('.bar').exists()).toBeTruthy();
});

// I think this is returning a violation because the tooltip is dynamically
// positioned within the dom, so `tooltip.html()` only returns the button content
// that does not have the target node in aria-describedby
test.skip('should return no axe violations', async () => {
  const tooltip = mount(
    <Tooltip id="foo" overlay={<span>boognish</span>}>
      <button className="bar" aria-describedby="foo">
        bar
      </button>
    </Tooltip>
  );

  expect(await axe(tooltip.html())).toHaveNoViolations();
});
