import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Placement } from '@popperjs/core';
import IconButton from '../IconButton';
import TooltipTabstop from '../TooltipTabstop';
import Icon from '../Icon';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  goToPage?: (page: number) => void;
  onNextPageClick?: () => void;
  onPreviousPageClick?: () => void;
  onFirstPageClick?: () => void;
  onLastPageClick?: () => void;
  statusLabel?: React.ReactNode;
  firstPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  lastPageLabel?: string;
  tooltipPlacement?: Placement;
  className?: string;
}

const Pagination = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      totalItems,
      itemsPerPage = 10,
      currentPage,
      statusLabel,
      firstPageLabel = 'First page',
      previousPageLabel = 'Previous page',
      nextPageLabel = 'Next page',
      lastPageLabel = 'Last page',
      tooltipPlacement = 'bottom',
      goToPage,
      onNextPageClick,
      onPreviousPageClick,
      onFirstPageClick,
      onLastPageClick,
      className,
      ...other
    },
    ref
  ) => {
    const itemStart = currentPage * itemsPerPage - itemsPerPage + 1;
    const itemEnd = Math.min(itemStart + itemsPerPage - 1, totalItems);
    const isLastPage = itemEnd === totalItems;
    const isFirstPage = currentPage === 1;

    return (
      <div ref={ref} className={classNames('Pagination', className)} {...other}>
        <ul>
          <li>
            {isFirstPage ? (
              <TooltipTabstop
                hideElementOnHidden
                association="aria-labelledby"
                tooltip={firstPageLabel}
                placement={tooltipPlacement}
              >
                <Icon type="chevron-double-left" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-double-left"
                tooltipPlacement={tooltipPlacement}
                label={firstPageLabel}
                onClick={() => {
                  goToPage?.(1);
                  onFirstPageClick?.();
                }}
              />
            )}
          </li>

          <li>
            {isFirstPage ? (
              <TooltipTabstop
                hideElementOnHidden
                association="aria-labelledby"
                tooltip={previousPageLabel}
                placement={tooltipPlacement}
              >
                <Icon type="chevron-left" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-left"
                tooltipPlacement={tooltipPlacement}
                label={previousPageLabel}
                onClick={() => {
                  goToPage?.(currentPage - 1);
                  onPreviousPageClick?.();
                }}
              />
            )}
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
            {isLastPage ? (
              <TooltipTabstop
                hideElementOnHidden
                association="aria-labelledby"
                tooltip={nextPageLabel}
                placement={tooltipPlacement}
              >
                <Icon type="chevron-right" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-right"
                tooltipPlacement={tooltipPlacement}
                label={nextPageLabel}
                onClick={() => {
                  goToPage?.(currentPage + 1);
                  onNextPageClick?.();
                }}
              />
            )}
          </li>

          <li>
            {isLastPage ? (
              <TooltipTabstop
                hideElementOnHidden
                association="aria-labelledby"
                tooltip={lastPageLabel}
                placement={tooltipPlacement}
              >
                <Icon type="chevron-double-right" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-double-right"
                tooltipPlacement={tooltipPlacement}
                label={lastPageLabel}
                onClick={() => {
                  goToPage?.(Math.ceil(totalItems / itemsPerPage));
                  onLastPageClick?.();
                }}
              />
            )}
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
  currentPage: PropTypes.number.isRequired,
  goToPage: PropTypes.func,
  onNextPageClick: PropTypes.func,
  onPreviousPageClick: PropTypes.func,
  onFirstPageClick: PropTypes.func,
  onLastPageClick: PropTypes.func,
  statusLabel: PropTypes.element,
  firstPageLabel: PropTypes.string,
  previousPageLabel: PropTypes.string,
  nextPageLabel: PropTypes.string,
  lastPageLabel: PropTypes.string,
  // @ts-expect-error
  tooltipPlacement: PropTypes.string,
  className: PropTypes.string
};

export default Pagination;
