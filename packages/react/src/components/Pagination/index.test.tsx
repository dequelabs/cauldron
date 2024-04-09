import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { usePagination } from './';
import axe from '../../axe';

test('should set `thin` variant when thin prop is provided', () => {
  render(<Pagination totalItems={18} currentPage={1} thin />);
  expect(screen.getByRole('list').parentElement).toHaveClass(
    'Pagination--thin'
  );
});

test('should disable first/prev page buttons', () => {
  const onFirstPageClick = jest.fn();
  const onPreviousPageClick = jest.fn();

  render(
    <Pagination
      totalItems={18}
      currentPage={1}
      onFirstPageClick={onFirstPageClick}
      onPreviousPageClick={onPreviousPageClick}
    />
  );

  expect(screen.getAllByRole('button')[0]).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  expect(screen.getAllByRole('button')[1]).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  expect(screen.getAllByRole('button')[2]).toHaveAttribute(
    'aria-disabled',
    'false'
  );
  expect(screen.getAllByRole('button')[3]).toHaveAttribute(
    'aria-disabled',
    'false'
  );

  fireEvent.click(screen.getAllByRole('button')[0]);
  fireEvent.click(screen.getAllByRole('button')[1]);

  expect(onFirstPageClick).not.toHaveBeenCalled();
  expect(onPreviousPageClick).not.toHaveBeenCalled();
});

test('should disable last/next page buttons', () => {
  const onNextPageClick = jest.fn();
  const onLastPageClick = jest.fn();

  render(
    <Pagination
      totalItems={18}
      currentPage={2}
      onNextPageClick={onNextPageClick}
      onLastPageClick={onLastPageClick}
    />
  );

  expect(screen.getAllByRole('button')[0]).toHaveAttribute(
    'aria-disabled',
    'false'
  );
  expect(screen.getAllByRole('button')[1]).toHaveAttribute(
    'aria-disabled',
    'false'
  );
  expect(screen.getAllByRole('button')[2]).toHaveAttribute(
    'aria-disabled',
    'true'
  );
  expect(screen.getAllByRole('button')[3]).toHaveAttribute(
    'aria-disabled',
    'true'
  );

  fireEvent.click(screen.getAllByRole('button')[2]);
  fireEvent.click(screen.getAllByRole('button')[3]);

  expect(onNextPageClick).not.toHaveBeenCalled();
  expect(onLastPageClick).not.toHaveBeenCalled();
});

test('should support custom status label text', () => {
  render(
    <Pagination totalItems={18} statusLabel={<div id="foo">hello world</div>} />
  );

  expect(screen.getByText('hello world')).toHaveAttribute('id', 'foo');
  expect(screen.getByRole('log')).toHaveTextContent('hello world');
});

test('should call on { Next, Previous, First, Last } click as expected', () => {
  const onNextPageClick = jest.fn();
  const onPreviousPageClick = jest.fn();
  const onFirstPageClick = jest.fn();
  const onLastPageClick = jest.fn();

  render(
    <Pagination
      totalItems={500}
      currentPage={3}
      itemsPerPage={10}
      onNextPageClick={onNextPageClick}
      onPreviousPageClick={onPreviousPageClick}
      onFirstPageClick={onFirstPageClick}
      onLastPageClick={onLastPageClick}
    />
  );

  fireEvent.click(screen.getAllByRole('button')[0]);
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).not.toHaveBeenCalled();
  expect(onNextPageClick).not.toHaveBeenCalled();
  expect(onLastPageClick).not.toHaveBeenCalled();

  fireEvent.click(screen.getAllByRole('button')[1]);
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).toHaveBeenCalledTimes(1);
  expect(onNextPageClick).not.toHaveBeenCalled();
  expect(onLastPageClick).not.toHaveBeenCalled();

  fireEvent.click(screen.getAllByRole('button')[2]);
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).toHaveBeenCalledTimes(1);
  expect(onNextPageClick).toHaveBeenCalledTimes(1);
  expect(onLastPageClick).not.toHaveBeenCalled();

  fireEvent.click(screen.getAllByRole('button')[3]);
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).toHaveBeenCalledTimes(1);
  expect(onNextPageClick).toHaveBeenCalledTimes(1);
  expect(onLastPageClick).toHaveBeenCalledTimes(1);
});

test('should render the expected default status label', () => {
  render(<Pagination totalItems={500} currentPage={3} itemsPerPage={17} />);
  expect(screen.getByRole('log')).toHaveTextContent('Showing 35 to 51 of 500');
});

test('should initialize and handle pagesize change as expected', () => {
  let testPagination = null;
  let testPageStatus = null;

  const PaginationWithHook1 = () => {
    const [pageSize, setPageSize] = useState(10);
    const { pagination, pageStatus } = usePagination({
      totalItems: 500,
      initialPage: 3,
      initialPageSize: pageSize
    });

    testPagination = pagination;
    testPageStatus = pageStatus;

    function onPageSizeChange() {
      setPageSize(25);
      pageStatus && pageStatus.setCurrentPage(1);
    }

    return (
      <div>
        <button onClick={onPageSizeChange}>25</button>
        <Pagination {...pagination} />
      </div>
    );
  };

  render(<PaginationWithHook1 />);

  expect(testPagination).toMatchObject({
    totalItems: 500,
    currentPage: 3,
    itemsPerPage: 10
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 3,
    pageStart: 21,
    pageEnd: 30
  });

  fireEvent.click(screen.getAllByRole('button')[3]);

  expect(testPageStatus).toMatchObject({
    currentPage: 4,
    pageStart: 31,
    pageEnd: 40
  });

  fireEvent.click(screen.getAllByRole('button')[0]);

  expect(testPagination).toMatchObject({
    itemsPerPage: 25,
    currentPage: 1
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 1,
    pageStart: 1,
    pageEnd: 25
  });
});

test('should initialize and call on { Next, Previous, First, Last } click as expected', () => {
  let testPagination;
  let testPageStatus;

  const PaginationWithHook = () => {
    const { pagination, pageStatus } = usePagination({
      totalItems: 500,
      initialPage: 3
    });

    testPagination = pagination;
    testPageStatus = pageStatus;

    return <Pagination {...pagination} />;
  };

  render(<PaginationWithHook />);

  expect(testPagination).toMatchObject({
    totalItems: 500,
    currentPage: 3,
    itemsPerPage: 10
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 3,
    pageStart: 21,
    pageEnd: 30
  });

  fireEvent.click(screen.getAllByRole('button')[1]);

  expect(testPageStatus).toMatchObject({
    currentPage: 2,
    pageStart: 11,
    pageEnd: 20
  });

  fireEvent.click(screen.getAllByRole('button')[2]);

  expect(testPageStatus).toMatchObject({
    currentPage: 3,
    pageStart: 21,
    pageEnd: 30
  });

  fireEvent.click(screen.getAllByRole('button')[0]);

  expect(testPageStatus).toMatchObject({
    currentPage: 1,
    pageStart: 1,
    pageEnd: 10
  });

  fireEvent.click(screen.getAllByRole('button')[3]);

  expect(testPageStatus).toMatchObject({
    currentPage: 50,
    pageStart: 491,
    pageEnd: 500
  });
});

test('returns no axe violations', async () => {
  const { container } = render(<Pagination totalItems={500} currentPage={3} />);
  expect(await axe(container)).toHaveNoViolations();
});
