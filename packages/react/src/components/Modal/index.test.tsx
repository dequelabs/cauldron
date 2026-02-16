import React from 'react';
import { render, screen } from '@testing-library/react';
import Modal, { ModalContent, ModalFooter } from './';
import axe from '../../axe';

const defaults = { show: false, heading: <span>Default Modal</span> };

test('should return null when passed a falsey "show" prop', () => {
  render(<Modal {...defaults}>Hi</Modal>);

  expect(screen.queryByRole('dialog')).toBeNull();
});

test('should return a dialog when passed a truthy "show" prop', () => {
  render(
    <Modal {...defaults} show={true}>
      Hi
    </Modal>
  );

  expect(screen.queryByRole('dialog')).toBeInTheDocument();
});

test('should show info-modal class if passed variant "info"', () => {
  render(
    <Modal {...defaults} show={true} variant="info">
      Hi
    </Modal>
  );

  expect(screen.queryByRole('dialog')).toHaveClass(
    'Dialog',
    'Modal',
    'Modal--info'
  );
});

test('should return no axe violations', async () => {
  const { container } = render(<Modal {...defaults}>Hi</Modal>);

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations with a passed a truthy "show" and no variant', async () => {
  const { container } = render(
    <Modal {...defaults} show={true}>
      Hi
    </Modal>
  );

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations with a passed a truthy "show" and passed variant="info"', async () => {
  const { container } = render(
    <Modal {...defaults} show={true} variant="info">
      Hi
    </Modal>
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations with long modal content', async () => {
  render(
    <Modal {...defaults} show={true}>
      <ModalContent>{createLongContent()}</ModalContent>
      <ModalFooter>
        <button>Ok</button>
      </ModalFooter>
    </Modal>
  );

  expect(document.querySelector('.Dialog__inner')).toBeInTheDocument();
  expect(document.querySelector('.Dialog__content')).toBeInTheDocument();

  expect(await axe(document.body)).toHaveNoViolations();
});

function createLongContent() {
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i}>Modal content here, get your modal content here!</p>
      ))}
    </>
  );
}
