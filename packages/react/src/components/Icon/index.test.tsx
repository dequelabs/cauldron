import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import Icon from './';

test('handles classNames properly', () => {
  const { container } = render(<Icon type="add-user" className="baz" />);
  expect(container.firstChild).toHaveClass('Icon--add-user baz');
});

test('sets aria-hidden to "true" if no label is passed', () => {
  const { container } = render(<Icon type="bolt" />);
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector('.Offscreen')).toBeNull();
});

test('sets aria-hidden to "false" if a label is passed and sets offscreen label value', () => {
  const { container } = render(<Icon type="check" label="Fred" />);
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'false');
  expect(container.querySelector('.Offscreen')).toHaveTextContent('Fred');
});

test('should support ref prop', () => {
  const ref = createRef<HTMLDivElement>();
  render(<Icon type="close" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
