import React from 'react';
import { mount } from 'enzyme';
import ProgressBar from 'src/components/ProgressBar';
import axe from '../../../axe';

test('should set correct props for progress bar', () => {
  const wrapper = mount(<ProgressBar aria-label="progress" progress={75} />);
  const progressBar = wrapper.find('.ProgressBar');
  expect(progressBar.prop('role')).toEqual('progressbar');
  expect(progressBar.prop('aria-valuemin')).toEqual(0);
  expect(progressBar.prop('aria-valuemax')).toEqual(100);
  expect(progressBar.prop('aria-valuenow')).toEqual(75);
  expect(progressBar.prop('aria-label')).toEqual('progress');
});

test('should set default progress bar progress', () => {
  const wrapper = mount(<ProgressBar aria-label="progress" progress={75} />);
  const progressBar = wrapper.find('.ProgressBar--fill');
  expect(progressBar.prop('style').width).toEqual('75%');
});

test('should set custom progress bar progress', () => {
  const wrapper = mount(
    <ProgressBar
      aria-label="progress"
      progressMin={0}
      progressMax={25}
      progress={5}
    />
  );
  const progressBar = wrapper.find('.ProgressBar--fill');
  expect(progressBar.prop('style').width).toEqual('20%');
});

test('should return no axe violations', async () => {
  const progressBar = mount(
    <ProgressBar aria-label="progress" progress={75} />
  );
  expect(await axe(progressBar.html())).toHaveNoViolations();
});
