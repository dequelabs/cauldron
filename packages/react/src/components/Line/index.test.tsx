import React from 'react';
import { render } from '@testing-library/react';
import Line from './index';
import axe from '../../axe';

test('passes classNames through', () => {
  const { container } = render(<Line className="baz" />);
  expect(container.firstChild).toHaveClass('Line', 'baz');
});

test('should return no axe violations', async () => {
  const { container } = render(<Line />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
