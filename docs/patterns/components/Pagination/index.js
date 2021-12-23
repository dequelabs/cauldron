import React, { useState } from 'react';
import Demo from '../../../Demo';
import { Pagination } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const PaginationDemo = () => {
  const totalItems = 111;
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(3);
  const itemStart = currentPage * itemsPerPage - itemsPerPage + 1;
  const itemEnd = Math.min(itemStart + itemsPerPage - 1, totalItems);

  const onNextPageClick = () => setCurrentPage(currentPage + 1);
  const onFirstPageClick = () => setCurrentPage(1);
  const onPreviousPageClick = () => setCurrentPage(currentPage - 1);
  const onLastPageClick = () => setCurrentPage(5);

  return (
    <div>
      <Demo
        component={Pagination}
        states={[
          { totalItems: 15 },
          // TODO: don't render this when in light mode?
          { totalItems: 15, variant: 'dark' },
          {
            totalItems,
            itemsPerPage,
            currentPage,
            statusLabel: (
              <span>
                <strong>{itemStart}</strong> - <strong>{itemEnd}</strong> of{' '}
                <strong>{totalItems}</strong>
              </span>
            ),
            firstPageLabel: 'FIRST PAGE!!',
            nextPageLabel: 'NEXT PAGE!!',
            previousPageLabel: 'PREV PAGE!!',
            lastPageLabel: 'JIMMY PAGE!!',
            onNextPageClick,
            onFirstPageClick,
            onPreviousPageClick,
            onLastPageClick
          }
        ]}
        propDocs={{
          totalItems: {
            type: 'number',
            description:
              'The total number of items being rendered (not the total number of pages)',
            required: true
          }
        }}
      />
    </div>
  );
};

export default PaginationDemo;
