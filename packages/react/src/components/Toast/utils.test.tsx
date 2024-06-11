import React from 'react';
import { render } from '@testing-library/react';
import { tabIndexHandler } from './utils';

let toast: HTMLElement | null;
let targets: HTMLElement[];

beforeEach(() => {
  const { container } = render(
    <div>
      <div className="toaster"></div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="zero" tabIndex={0}></div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="minus-one" tabIndex={-1}></div>
    </div>
  );

  toast = container.querySelector('.toaster');
  targets = Array.from(container.querySelectorAll('.zero, .minus-one'));
});

afterEach(() => {
  toast = null;
  targets = [];
});

test('should properly reset tabIndex', () => {
  targets.forEach((target) => {
    target.setAttribute('data-cached-tabindex', target.tabIndex.toString());
    target.tabIndex = -1;
  });

  if (toast) {
    tabIndexHandler(true, toast);
  }

  expect(targets[0].tabIndex).toBe(0);
  expect(targets[1].tabIndex).toBe(-1);
});

test('should properly set data-cached-tabindex / tabIndex', () => {
  if (toast) {
    tabIndexHandler(false, toast);
  }
  expect(targets[0].tabIndex).toBe(-1);
  expect(targets[0].getAttribute('data-cached-tabindex')).toBe('0');
});
