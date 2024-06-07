import React from 'react';
import { render } from '@testing-library/react';
import TopBarTrigger from './TopBarTrigger';
import axe from '../../axe';

test('should return no axe violations', async () => {
  const { container } = render(
    <ul role="menubar">
      <TopBarTrigger>Hamsam</TopBarTrigger>
    </ul>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
