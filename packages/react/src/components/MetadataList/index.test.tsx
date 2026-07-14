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

  test.each([
    ['MetadataList', MetadataList, 'DL'],
    ['MetadataListItem', MetadataListItem, 'DIV'],
    ['MetadataListLabel', MetadataListLabel, 'DT'],
    ['MetadataListValue', MetadataListValue, 'DD']
  ] as const)(
    '%s passes className, props, and ref through',
    (_, Component, tagName) => {
      const ref = React.createRef<HTMLElement>();
      render(
        <Component
          data-testid="element"
          className="a"
          data-foo="bar"
          ref={ref as never}
        >
          a
        </Component>
      );

      const element = screen.getByTestId('element');
      expect(element.tagName).toBe(tagName);
      expect(element).toHaveClass('a');
      expect(element).toHaveAttribute('data-foo', 'bar');
      expect(ref.current).toBe(element);
    }
  );

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
