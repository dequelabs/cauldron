import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from './';
import axe from '../../axe';

describe('DescriptionList components', () => {
  test('renders a dl element', () => {
    render(<DescriptionList data-testid="dl">a</DescriptionList>);
    expect(screen.getByTestId('dl').tagName).toBe('DL');
    expect(screen.getByTestId('dl')).toBeInTheDocument();
  });

  test('renders a dt element', () => {
    render(<DescriptionTerm>a</DescriptionTerm>);
    expect(screen.getByRole('term')).toBeInTheDocument();
  });

  test('renders a dd element', () => {
    render(<DescriptionDetails>a</DescriptionDetails>);
    expect(screen.getByRole('definition')).toBeInTheDocument();
  });

  test('handles uncollapsed prop', () => {
    render(<DescriptionList data-testid="dl">a</DescriptionList>);
    expect(screen.getByTestId('dl')).not.toHaveClass(
      'DescriptionList--collapsed'
    );
  });

  test('handles collapsed prop', () => {
    render(
      <DescriptionList data-testid="dl" collapsed>
        a
      </DescriptionList>
    );
    expect(screen.getByTestId('dl')).toHaveClass('DescriptionList--collapsed');
  });

  test('passes classNames through', () => {
    render(<DescriptionList className="a">a</DescriptionList>);
    expect(screen.getByText(/a/i)).toHaveClass('a');

    render(<DescriptionTerm className="b">b</DescriptionTerm>);
    expect(screen.getByText(/b/i)).toHaveClass('b');

    render(<DescriptionDetails className="c">c</DescriptionDetails>);
    expect(screen.getByText(/c/i)).toHaveClass('c');
  });

  test('passes props through', () => {
    render(
      <DescriptionList data-testid="dl" data-foo="list">
        a
      </DescriptionList>
    );
    render(
      <DescriptionTerm data-testid="term" data-foo="term">
        a
      </DescriptionTerm>
    );
    render(
      <DescriptionDetails data-testid="detail" data-foo="detail">
        a
      </DescriptionDetails>
    );

    expect(screen.getByTestId('dl')).toHaveAttribute('data-foo', 'list');
    expect(screen.getByRole('term')).toHaveAttribute('data-foo', 'term');
    expect(screen.getByRole('definition')).toHaveAttribute(
      'data-foo',
      'detail'
    );
  });

  test('returns no axe violations', async () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>details</DescriptionDetails>
        </DescriptionListItem>
      </DescriptionList>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
