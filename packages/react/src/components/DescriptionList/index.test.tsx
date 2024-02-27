import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from './index';
import axe from '../../axe';

describe('DescriptionList components', () => {
  test('renders a dl element', () => {
    const { container } = render(<DescriptionList>a</DescriptionList>);
    const dl = container.querySelector('dl');
    expect(dl).toBeInTheDocument();
  });

  test('renders a dt element', () => {
    const { container } = render(<DescriptionTerm>a</DescriptionTerm>);
    const dt = container.querySelector('dt');
    expect(dt).toBeInTheDocument();
  });

  test('renders a dd element', () => {
    const { container } = render(<DescriptionDetails>a</DescriptionDetails>);
    const dd = container.querySelector('dd');
    expect(dd).toBeInTheDocument();
  });

  test('handles uncollapsed prop', () => {
    const { container } = render(<DescriptionList>a</DescriptionList>);
    const dl = container.querySelector('dl');
    expect(dl).not.toHaveClass('DescriptionList--collapsed');
  });

  test('handles collapsed prop', () => {
    const { container } = render(
      <DescriptionList collapsed>a</DescriptionList>
    );
    const dl = container.querySelector('dl');
    expect(dl).toHaveClass('DescriptionList--collapsed');
  });

  test('passes classNames through', () => {
    render(<DescriptionList className="a">a</DescriptionList>);
    const dl = screen.getByText('a');
    expect(dl).toHaveClass('a');

    render(<DescriptionTerm className="b">b</DescriptionTerm>);
    const dt = screen.getByText('b');
    expect(dt).toHaveClass('b');

    render(<DescriptionDetails className="c">c</DescriptionDetails>);
    const dd = screen.getByText('c');
    expect(dd).toHaveClass('c');
  });

  test('passes props through', () => {
    const dl = render(
      <DescriptionList data-testid="list" data-foo="list">
        a
      </DescriptionList>
    );
    const dt = render(
      <DescriptionTerm data-testid="term" data-foo="term">
        a
      </DescriptionTerm>
    );
    const dd = render(
      <DescriptionDetails data-testid="detail" data-foo="detail">
        a
      </DescriptionDetails>
    );

    expect(dl.getByTestId('list')).toHaveAttribute('data-foo', 'list');
    expect(dt.getByTestId('term')).toHaveAttribute('data-foo', 'term');
    expect(dd.getByTestId('detail')).toHaveAttribute('data-foo', 'detail');
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
