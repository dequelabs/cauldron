import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  MetadataList,
  MetadataListItem,
  MetadataListLabel,
  MetadataListValue
} from './';
import axe from '../../axe';

describe('MetadataList components', () => {
  test('renders a dl element', () => {
    render(<MetadataList data-testid="dl">a</MetadataList>);
    expect(screen.getByTestId('dl').tagName).toBe('DL');
    expect(screen.getByTestId('dl')).toBeInTheDocument();
  });

  test('renders a dt element', () => {
    render(<MetadataListLabel>a</MetadataListLabel>);
    expect(screen.getByRole('term')).toBeInTheDocument();
  });

  test('renders a dd element', () => {
    render(<MetadataListValue>a</MetadataListValue>);
    expect(screen.getByRole('definition')).toBeInTheDocument();
  });

  test('defaults to horizontal orientation', () => {
    render(<MetadataList data-testid="dl">a</MetadataList>);
    expect(screen.getByTestId('dl')).toHaveClass('MetadataList--horizontal');
  });

  test('handles vertical orientation prop', () => {
    render(
      <MetadataList data-testid="dl" orientation="vertical">
        a
      </MetadataList>
    );
    expect(screen.getByTestId('dl')).toHaveClass('MetadataList--vertical');
    expect(screen.getByTestId('dl')).not.toHaveClass(
      'MetadataList--horizontal'
    );
  });

  test('passes classNames through', () => {
    render(<MetadataList className="a">a</MetadataList>);
    expect(screen.getByText(/a/i)).toHaveClass('a');

    render(<MetadataListItem className="b">b</MetadataListItem>);
    expect(screen.getByText(/b/i)).toHaveClass('b');

    render(<MetadataListLabel className="c">c</MetadataListLabel>);
    expect(screen.getByText(/c/i)).toHaveClass('c');

    render(<MetadataListValue className="d">d</MetadataListValue>);
    expect(screen.getByText(/d/i)).toHaveClass('d');
  });

  test('passes props through', () => {
    render(
      <MetadataList data-testid="dl" data-foo="list">
        a
      </MetadataList>
    );
    render(<MetadataListItem data-testid="item" data-foo="item" />);
    render(<MetadataListLabel data-foo="label">a</MetadataListLabel>);
    render(<MetadataListValue data-foo="value">a</MetadataListValue>);

    expect(screen.getByTestId('dl')).toHaveAttribute('data-foo', 'list');
    expect(screen.getByTestId('item')).toHaveAttribute('data-foo', 'item');
    expect(screen.getByRole('term')).toHaveAttribute('data-foo', 'label');
    expect(screen.getByRole('definition')).toHaveAttribute('data-foo', 'value');
  });

  test('returns no axe violations', async () => {
    const { container } = render(
      <MetadataList>
        <MetadataListItem>
          <MetadataListLabel>Label</MetadataListLabel>
          <MetadataListValue>Value</MetadataListValue>
        </MetadataListItem>
      </MetadataList>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
