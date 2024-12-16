import React, { useState } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import Pagination, { usePagination } from './';
import axe from '../../axe';

test('should set `thin` variant when thin prop is provided', async () => {
  render(<Pagination totalItems={18} currentPage={1} thin />);
  const list = await screen.findByRole('list');
  expect(list.parentElement).toHaveClass('Pagination--thin');
});

test('should disable first/prev page buttons', async () => {
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

  const buttons = await screen.findAllByRole('button');

  expect(buttons[0]).toHaveAttribute('aria-disabled', 'true');
  expect(buttons[1]).toHaveAttribute('aria-disabled', 'true');
  expect(buttons[2]).toHaveAttribute('aria-disabled', 'false');
  expect(buttons[3]).toHaveAttribute('aria-disabled', 'false');

  await act(async () => {
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });

  expect(onFirstPageClick).not.toHaveBeenCalled();
  expect(onPreviousPageClick).not.toHaveBeenCalled();
});

test('should disable last/next page buttons', async () => {
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

  const buttons = await screen.findAllByRole('button');

  expect(buttons[0]).toHaveAttribute('aria-disabled', 'false');
  expect(buttons[1]).toHaveAttribute('aria-disabled', 'false');
  expect(buttons[2]).toHaveAttribute('aria-disabled', 'true');
  expect(buttons[3]).toHaveAttribute('aria-disabled', 'true');

  await act(async () => {
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
  });

  expect(onNextPageClick).not.toHaveBeenCalled();
  expect(onLastPageClick).not.toHaveBeenCalled();
});

test('should support custom status label text', async () => {
  render(
    <Pagination totalItems={18} statusLabel={<div id="foo">hello world</div>} />
  );

  const element = await screen.findByText('hello world');
  expect(element).toHaveAttribute('id', 'foo');
  const log = await screen.findByRole('log');
  expect(log).toHaveTextContent('hello world');
});

test('should call on { Next, Previous, First, Last } click as expected', async () => {
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

  const buttons = await screen.findAllByRole('button');

  await act(async () => {
    fireEvent.click(buttons[0]);
  });
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).not.toHaveBeenCalled();
  expect(onNextPageClick).not.toHaveBeenCalled();
  expect(onLastPageClick).not.toHaveBeenCalled();

  await act(async () => {
    fireEvent.click(buttons[1]);
  });
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).toHaveBeenCalledTimes(1);
  expect(onNextPageClick).not.toHaveBeenCalled();
  expect(onLastPageClick).not.toHaveBeenCalled();

  await act(async () => {
    fireEvent.click(buttons[2]);
  });
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).toHaveBeenCalledTimes(1);
  expect(onNextPageClick).toHaveBeenCalledTimes(1);
  expect(onLastPageClick).not.toHaveBeenCalled();

  await act(async () => {
    fireEvent.click(buttons[3]);
  });
  expect(onFirstPageClick).toHaveBeenCalledTimes(1);
  expect(onPreviousPageClick).toHaveBeenCalledTimes(1);
  expect(onNextPageClick).toHaveBeenCalledTimes(1);
  expect(onLastPageClick).toHaveBeenCalledTimes(1);
});

test('should render the expected default status label', async () => {
  render(<Pagination totalItems={500} currentPage={3} itemsPerPage={17} />);
  const log = await screen.findByRole('log');
  expect(log).toHaveTextContent('Showing 35 to 51 of 500');
});

test('should initialize and handle pagesize change as expected', async () => {
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

  const buttons = await screen.findAllByRole('button');

  await act(async () => {
    fireEvent.click(buttons[3]);
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 4,
    pageStart: 31,
    pageEnd: 40
  });

  await act(async () => {
    fireEvent.click(buttons[0]);
  });

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

test('should initialize and call on { Next, Previous, First, Last } click as expected', async () => {
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

  const buttons = await screen.findAllByRole('button');

  await act(async () => {
    fireEvent.click(buttons[1]);
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 2,
    pageStart: 11,
    pageEnd: 20
  });

  await act(async () => {
    fireEvent.click(buttons[2]);
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 3,
    pageStart: 21,
    pageEnd: 30
  });

  await act(async () => {
    fireEvent.click(buttons[0]);
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 1,
    pageStart: 1,
    pageEnd: 10
  });

  await act(async () => {
    fireEvent.click(buttons[3]);
  });

  expect(testPageStatus).toMatchObject({
    currentPage: 50,
    pageStart: 491,
    pageEnd: 500
  });
});

test('returns no axe violations', async () => {
  const { container } = render(<Pagination totalItems={500} currentPage={3} />);
  await waitFor(() => {
    expect(container).toBeInTheDocument();
  });
  expect(await axe(container)).toHaveNoViolations();
});

test('should show start and end pagination buttons when hideStartEndPagination is not provided', async () => {
  render(<Pagination totalItems={18} currentPage={1} />);

  const firstPage = await screen.findByText('First page');
  const previousPage = await screen.findByText('Previous page');
  const nextPage = await screen.findByText('Next page');
  const lastPage = await screen.findByText('Last page');

  expect(firstPage).toBeInTheDocument();
  expect(previousPage).toBeInTheDocument();
  expect(nextPage).toBeInTheDocument();
  expect(lastPage).toBeInTheDocument();
});

test('should hide start and end pagination buttons when hideStartEndPagination is true', async () => {
  render(<Pagination totalItems={18} currentPage={1} hideStartEndPagination />);

  const firstPage = screen.queryByText('First page');
  const lastPage = screen.queryByText('Last page');
  const previousPage = await screen.findByText('Previous page');
  const nextPage = await screen.findByText('Next page');

  expect(firstPage).not.toBeInTheDocument();
  expect(lastPage).not.toBeInTheDocument();
  expect(previousPage).toBeInTheDocument();
  expect(nextPage).toBeInTheDocument();
});
