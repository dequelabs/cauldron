import { useState } from 'react';

interface Options {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
}

interface PaginationResults {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onNextPageClick: () => void;
  onPreviousPageClick: () => void;
  onFirstPageClick: () => void;
  onLastPageClick: () => void;
}

// PageStatus has some built-in redundancy to prevent a user from
// needing to pull extra data out of the PaginationResults object
interface PageStatus {
  currentPage: number;
  pageStart: number;
  pageEnd: number;
}

export const usePagination = ({
  totalItems,
  initialPageSize = 10,
  initialPage = 1
}: Options): [PaginationResults, PageStatus] => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const pageStart = currentPage * initialPageSize - initialPageSize + 1;
  const pageEnd = Math.min(pageStart + initialPageSize - 1, totalItems);

  const onFirstPageClick = () => setCurrentPage(1);
  const onPreviousPageClick = () => setCurrentPage(currentPage - 1);
  const onNextPageClick = () => setCurrentPage(currentPage + 1);
  const onLastPageClick = () =>
    setCurrentPage(Math.ceil(totalItems / initialPageSize));

  const pagination: PaginationResults = {
    totalItems,
    currentPage,
    itemsPerPage: initialPageSize,
    onFirstPageClick,
    onPreviousPageClick,
    onNextPageClick,
    onLastPageClick
  };

  const pageStatus: PageStatus = {
    currentPage,
    pageStart,
    pageEnd
  };

  return [pagination, pageStatus];
};
