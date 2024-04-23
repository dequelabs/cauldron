import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TagButton from './';
import { IconType } from '../Icon';
import axe from '../../axe';

type TagButtonProps = {
  icon: IconType;
  label: string;
  value: string;
  onClick: () => void;
};

const defaultProps: TagButtonProps = {
  icon: 'pencil',
  label: 'Label: ',
  value: 'value',
  onClick: () => console.log('test')
};

const renderDefaultTagButton = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(<TagButton {...mergedProps} />);
};

test('should render a button', () => {
  renderDefaultTagButton();

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('button')).not.toHaveAttribute('role');
  expect(screen.getByRole('button')).toHaveTextContent('Label: value');
});

test('should support className prop', () => {
  renderDefaultTagButton({ className: 'foo' });

  expect(screen.getByRole('button')).toHaveClass('foo');
});

test('should support onClick prop', () => {
  const action = jest.fn();

  renderDefaultTagButton({ onClick: action });

  fireEvent.click(screen.getByRole('button'));

  expect(action).toHaveBeenCalled();
});

test('should render an icon in the button', () => {
  renderDefaultTagButton();

  expect(screen.getByRole('button').lastChild).toHaveClass(
    'Icon',
    'Icon--pencil',
    'TagButton__icon'
  );
});

test('returns no axe violations', async () => {
  const { container } = renderDefaultTagButton();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
