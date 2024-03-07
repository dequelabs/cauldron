import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from './';
import axe from '../../axe';

test('should set correct props for progress bar', () => {
  render(<ProgressBar aria-label="progress" progress={75} />);
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toBeInTheDocument();
  expect(progressBar).toHaveAttribute('aria-valuemin', '0');
  expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  expect(progressBar).toHaveAttribute('aria-label', 'progress');
});

test('should set default progress bar progress', () => {
  render(<ProgressBar aria-label="progress" progress={75} />);
  const progressBar = screen.getByRole('progressbar');
  const progressBarFill = progressBar.querySelector('.ProgressBar--fill');
  expect(progressBarFill).toHaveStyle({ width: '75%' });
});

test('should set custom progress bar progress', () => {
  render(
    <ProgressBar
      aria-label="progress"
      progressMin={0}
      progressMax={25}
      progress={5}
    />
  );
  const progressBar = screen.getByRole('progressbar');
  const progressBarFill = progressBar.querySelector('.ProgressBar--fill');
  expect(progressBarFill).toHaveStyle({ width: '20%' });
});

test('should return no axe violations', async () => {
  render(<ProgressBar aria-label="progress" progress={75} />);
  const results = await axe(screen.getByRole('progressbar'));
  expect(results).toHaveNoViolations();
});
