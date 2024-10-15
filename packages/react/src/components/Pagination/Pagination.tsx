import React from 'react';
import classNames from 'classnames';
import { Placement } from '@popperjs/core';
import IconButton from '../IconButton';
import { ContentNode } from '../../types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  hideStartEndPagination?: boolean;
  statusLabel?: ContentNode;
  firstPageLabel?: ContentNode;
  previousPageLabel?: ContentNode;
  nextPageLabel?: ContentNode;
  lastPageLabel?: ContentNode;
  onNextPageClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPreviousPageClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFirstPageClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onLastPageClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tooltipPlacement?: Placement;
  thin?: boolean;
  className?: string;
}

const Pagination = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      totalItems,
      itemsPerPage = 10,
      currentPage = 1,
      hideStartEndPagination = false,
      statusLabel,
      firstPageLabel = 'First page',
      previousPageLabel = 'Previous page',
      nextPageLabel = 'Next page',
      lastPageLabel = 'Last page',
      tooltipPlacement = 'bottom',
      onNextPageClick,
      onPreviousPageClick,
      onFirstPageClick,
      onLastPageClick,
      className,
      thin = false,
      ...other
    },
    ref
  ) => {
    const itemStart = currentPage * itemsPerPage - itemsPerPage + 1;
    const itemEnd = Math.min(itemStart + itemsPerPage - 1, totalItems);
    const isLastPage = itemEnd === totalItems;
    const isFirstPage = currentPage === 1;

    return (
      <div
        ref={ref}
        className={classNames('Pagination', className, {
          'Pagination--thin': thin
        })}
        {...other}
      >
        <ul>
          {!hideStartEndPagination && (
            <li>
              <IconButton
                icon="chevron-double-left"
                tooltipProps={{ placement: tooltipPlacement }}
                label={firstPageLabel}
                aria-disabled={isFirstPage}
                onClick={isFirstPage ? undefined : onFirstPageClick}
              />
            </li>
          )}

          <li>
            <IconButton
              icon="chevron-left"
              tooltipProps={{ placement: tooltipPlacement }}
              label={previousPageLabel}
              aria-disabled={isFirstPage}
              onClick={isFirstPage ? undefined : onPreviousPageClick}
            />
          </li>

          <li>
            <span role="log" aria-atomic="true" aria-live="polite">
              {statusLabel || (
                <span>
                  Showing <strong>{itemStart}</strong> to{' '}
                  <strong>{itemEnd}</strong> of <strong>{totalItems}</strong>
                </span>
              )}
            </span>
          </li>

          <li>
            <IconButton
              icon="chevron-right"
              tooltipProps={{ placement: tooltipPlacement }}
              label={nextPageLabel}
              aria-disabled={isLastPage}
              onClick={isLastPage ? undefined : onNextPageClick}
            />
          </li>

          {!hideStartEndPagination && (
            <li>
              <IconButton
                icon="chevron-double-right"
                tooltipProps={{ placement: tooltipPlacement }}
                label={lastPageLabel}
                aria-disabled={isLastPage}
                onClick={isLastPage ? undefined : onLastPageClick}
              />
            </li>
          )}
        </ul>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

export default Pagination;
