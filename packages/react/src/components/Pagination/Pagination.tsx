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
  currentPage?: number;
  statusLabel?: React.ReactNode;
  firstPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  lastPageLabel?: string;
  onNextPageClick?: () => void;
  onPreviousPageClick?: () => void;
  onFirstPageClick?: () => void;
  onLastPageClick?: () => void;
  onPageSizeChange?: () => void;
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
      onPageSizeChange,
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
            {isFirstPage ? (
              <TooltipTabstop
                className="IconButton"
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
                onClick={onFirstPageClick}
              />
            )}
          </li>

          <li>
            {isFirstPage ? (
              <TooltipTabstop
                className="IconButton"
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
                onClick={onPreviousPageClick}
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
                className="IconButton"
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
                onClick={onNextPageClick}
              />
            )}
          </li>

          <li>
            {isLastPage ? (
              <TooltipTabstop
                className="IconButton"
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
                onClick={onLastPageClick}
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
  onPageSizeChange: PropTypes.func,
  // @ts-expect-error
  tooltipPlacement: PropTypes.string,
  className: PropTypes.string
};

export default Pagination;
