import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Placement } from '@popperjs/core';
import IconButton from '../IconButton';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  statusLabel?: React.ReactNode;
  firstPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  lastPageLabel?: string;
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
          <li>
            <IconButton
              icon="chevron-double-left"
              tooltipPlacement={tooltipPlacement}
              label={firstPageLabel}
              aria-disabled={isFirstPage}
              onClick={isFirstPage ? undefined : onFirstPageClick}
            />
          </li>

          <li>
            <IconButton
              icon="chevron-left"
              tooltipPlacement={tooltipPlacement}
              label={previousPageLabel}
              aria-disabled={isFirstPage}
              onClick={isFirstPage ? undefined : onPreviousPageClick}
            />
          </li>

          <li>
            <span role="log" aria-atomic="true">
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
              tooltipPlacement={tooltipPlacement}
              label={nextPageLabel}
              aria-disabled={isLastPage}
              onClick={isLastPage ? undefined : onNextPageClick}
            />
          </li>

          <li>
            <IconButton
              icon="chevron-double-right"
              tooltipPlacement={tooltipPlacement}
              label={lastPageLabel}
              aria-disabled={isLastPage}
              onClick={isLastPage ? undefined : onLastPageClick}
            />
          </li>
        </ul>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  statusLabel: PropTypes.element,
  firstPageLabel: PropTypes.string,
  previousPageLabel: PropTypes.string,
  nextPageLabel: PropTypes.string,
  lastPageLabel: PropTypes.string,
  onNextPageClick: PropTypes.func,
  onPreviousPageClick: PropTypes.func,
  onFirstPageClick: PropTypes.func,
  onLastPageClick: PropTypes.func,
  // @ts-expect-error
  tooltipPlacement: PropTypes.string,
  className: PropTypes.string,
  thin: PropTypes.bool
};

export default Pagination;
