import React from 'react';
import { mount } from 'enzyme';
import Modal from 'src/components/Modal';
import axe from '../../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('returns null if passed a falsey "show" prop', () => {
  const modal = mount(<Modal {...defaults}>{'hello'}</Modal>);
  expect(modal.html()).toBe('');
});

test('shows modal if passed a truthy "show" prop', () => {
  const modal = mount(
    <Modal {...defaults} show={true}>
      {'hello'}
    </Modal>
  );
  expect(modal.find('.Modal').exists()).toBe(true);
});

test('shows info-modal if passed variant of info', () => {
  const modal = mount(
    <Modal {...defaults} show={true} variant="info">
      {'hello'}
    </Modal>
  );
  expect(modal.find('.Modal--info').exists()).toBe(true);
});

test('should return no axe violations', async () => {
  const modal = mount(
    <Modal show={true} heading={'title'}>
      Hello!
    </Modal>
  );
  const infoModal = mount(
    <Modal {...defaults} show={true} variant="info">
      {'hello'}
    </Modal>
  );

  expect(await axe(modal.html())).toHaveNoViolations();
  expect(await axe(infoModal.html())).toHaveNoViolations();
});
