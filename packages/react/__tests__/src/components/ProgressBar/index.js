import React from 'react';
import { mount } from 'enzyme';
import ProgressBar from 'src/components/ProgressBar';
import axe from '../../../axe';

test('should set correct props for progress bar', () => {
  const wrapper = mount(<ProgressBar label="progress" progress={75} />);
  const progressBar = wrapper.find('.ProgressBar');
  expect(progressBar.prop('role')).toEqual('progressbar');
  expect(progressBar.prop('aria-valuemin')).toEqual(0);
  expect(progressBar.prop('aria-valuemax')).toEqual(100);
  expect(progressBar.prop('aria-valuenow')).toEqual(75);
  expect(progressBar.prop('aria-label')).toEqual('progress');
});

test('should return no axe violations', async () => {
  const progressBar = mount(<ProgressBar label="progress" progress={75} />);
  expect(await axe(progressBar.html())).toHaveNoViolations();
});
