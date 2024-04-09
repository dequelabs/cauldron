import React from 'react';
import { render, screen } from '@testing-library/react';
import Notice from './';
import axe from '../../axe';

test('should handle rendering without errors', () => {
  render(<Notice data-testid="notice" title={'test'} />);

  expect(screen.getByTestId('notice')).toBeInTheDocument();
});

test('should render with defaults when no props are passed in', () => {
  render(
    <Notice data-testid="notice" title="">
      child
    </Notice>
  );

  expect(screen.getByTestId('notice')).toHaveTextContent('child');
});

test('should render the correct default icon for a given type', () => {
  render(<Notice data-testid="notice" type="caution" title="Boom!" />);

  expect(screen.getByTestId('notice')).toHaveClass('Notice--caution');
  expect(
    screen.getByTestId('notice').querySelector('.Icon.Icon--caution')
  ).toBeInTheDocument();
});

test('should return correctly with props passed in', () => {
  render(
    <Notice data-testid="notice" type="info" title="foo">
      bar
    </Notice>
  );

  expect(screen.getByTestId('notice')).toHaveTextContent('foo');
  expect(screen.getByTestId('notice')).toHaveTextContent('bar');
});

test('should render with the correct icon when a valid icon type string is passed in', () => {
  render(
    <Notice data-testid="notice" type="info" icon="bolt" title="Dynamo!" />
  );

  expect(screen.getByTestId('notice')).toHaveClass('Notice--info');
  expect(
    screen.getByTestId('notice').querySelector('.Icon.Icon--bolt')
  ).toBeInTheDocument();
});

test('should render only a title when no children are passed in', () => {
  render(<Notice data-testid="notice" title="foo" />);

  expect(screen.getByTestId('notice')).toHaveTextContent('foo');
});

test('should allow title prop for any valid ContentNode element', () => {
  render(
    <Notice title={<h2>foo</h2>}>
      <span>bar</span>
    </Notice>
  );

  expect(screen.getByRole('heading', { name: 'foo' })).toBeInTheDocument();
});

test('should allow a ref to be forwarded', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(<Notice data-testid="notice" ref={ref} title={''} />);

  expect(screen.getByTestId('notice')).toBeInTheDocument();
  expect(ref.current).toBeTruthy();
});

test('should return no axe violations with type="info"', async () => {
  const { container } = render(
    <Notice type="info" title="foo">
      bar
    </Notice>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with type="caution"', async () => {
  const { container } = render(
    <Notice type="caution" title="foo">
      bar
    </Notice>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations with type="danger"', async () => {
  const { container } = render(
    <Notice type="danger" title="foo">
      bar
    </Notice>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
