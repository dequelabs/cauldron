import React, { useState } from 'react';
import Demo from '../../../Demo';
import { Pagination, usePagination } from '@deque/cauldron-react/';
import { children, className } from '../../../props';

const PaginationDemo = () => {
  const totalItems = 111;
  const itemsPerPage = 25;

  const { pagination, pageStatus } = usePagination({
    totalItems,
    itemsPerPage
  });

  return (
    <div>
      <Demo
        component={Pagination}
        states={[
          { totalItems: 15 },
          {
            ...pagination,
            statusLabel: (
              <span>
                <strong>{pageStatus.pageStart}</strong> -{' '}
                <strong>{pageStatus.pageEnd}</strong> of{' '}
                <strong>{totalItems}</strong>
              </span>
            ),
            firstPageLabel: 'FIRST PAGE!!',
            nextPageLabel: 'NEXT PAGE!!',
            previousPageLabel: 'PREV PAGE!!',
            lastPageLabel: 'JIMMY PAGE!!'
          }
        ]}
        propDocs={{
          totalItems: {
            type: 'number',
            description:
              'The total number of items being rendered (not the total number of pages).',
            required: true
          },
          itemsPerPage: {
            type: 'number',
            description: 'The total number of items per page.',
            required: false,
            default: 10
          },
          currentPage: {
            type: 'number',
            description: 'The (1-based) number of the current page.',
            required: false,
            default: 1
          },
          statusLabel: {
            type: 'ReactNode',
            description:
              'The "x of y" status label (rendered as text in the middle of the pagination controls).',
            required: false,
            default: `<span>
                Showing <strong>{itemStart}</strong> to{' '}
                <strong>{itemEnd}</strong> of <strong>{totalItems}</strong>
              </span>`
          },
          firstPageLabel: {
            type: 'string',
            description:
              'The label text for the first page button (to be rendered as a tooltip).',
            required: false,
            default: 'First page'
          },
          previousPageLabel: {
            type: 'string',
            description:
              'The label text for the previous page button (to be rendered as a tooltip).',
            required: false,
            default: 'Previous page'
          },
          nextPageLabel: {
            type: 'string',
            description:
              'The label text for the next page button (to be rendered as a tooltip).',
            required: false,
            default: 'Next page'
          },
          lastPageLabel: {
            type: 'string',
            description:
              'The label text for the last page button (to be rendered as a tooltip).',
            required: false,
            default: 'Last page'
          },
          onNextPageClick: {
            type: 'function',
            description:
              'Function to be called when next page button is clicked',
            required: false
          },
          onPreviousPageClick: {
            type: 'function',
            description:
              'Function to be called when previous page button is clicked',
            required: false
          },
          onFirstPageClick: {
            type: 'function',
            description:
              'Function to be called when first page button is clicked',
            required: false
          },
          onLastPageClick: {
            type: 'function',
            description:
              'Function to be called when last page button is clicked',
            required: false
          },
          tooltipPlacement: {
            type: 'string',
            description:
              'The position of the tooltip relative to its target element.',
            required: false,
            defaultValue: "'bottom'"
          }
        }}
      />
    </div>
  );
};

export default PaginationDemo;
