import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '../IconButton';
import TooltipTabstop from '../TooltipTabstop';
import Icon from '../Icon';

type PaginationVariant = 'dark';

interface Props {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  statusLabel?: React.ReactElement;
  firstPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  lastPageLabel?: string;
  onNextPageClick?: () => void;
  onPreviousPageClick?: () => void;
  onFirstPageClick?: () => void;
  onLastPageClick?: () => void;
  className?: string;
  variant?: PaginationVariant;
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
      onNextPageClick,
      onPreviousPageClick,
      onFirstPageClick,
      onLastPageClick,
      className,
      variant,
      ...other
    },
    ref
  ) => {
    const itemStart = currentPage * itemsPerPage - itemsPerPage + 1;
    const itemEnd = Math.min(itemStart + itemsPerPage - 1, totalItems);
    const isLastPage = itemEnd === totalItems;

    return (
      <div
        ref={ref}
        className={classNames('Pagination', className, {
          'Pagination--dark': variant === 'dark'
        })}
        {...other}
      >
        <ul>
          <li>
            {currentPage === 1 ? (
              <TooltipTabstop tooltip={firstPageLabel} placement="bottom">
                <Icon type="chevron-double-left" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-double-left"
                tooltipPlacement="bottom"
                label={firstPageLabel}
                onClick={onFirstPageClick}
              />
            )}
          </li>

          <li>
            {currentPage === 1 ? (
              <TooltipTabstop tooltip={previousPageLabel} placement="bottom">
                <Icon type="chevron-left" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-left"
                tooltipPlacement="bottom"
                label={previousPageLabel}
                onClick={onPreviousPageClick}
              />
            )}
          </li>

          <li>
            <span role="log" aria-atomic="true">
              {statusLabel || (
                <span>
                  Showing <strong>{itemStart}</strong> of{' '}
                  <strong>{itemEnd}</strong> of <strong>{totalItems}</strong>
                </span>
              )}
            </span>
          </li>

          <li>
            {isLastPage ? (
              <TooltipTabstop tooltip={nextPageLabel} placement="bottom">
                <Icon type="chevron-right" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-right"
                tooltipPlacement="bottom"
                label={nextPageLabel}
                onClick={onNextPageClick}
              />
            )}
          </li>

          <li>
            {isLastPage ? (
              <TooltipTabstop tooltip={lastPageLabel} placement="bottom">
                <Icon type="chevron-double-right" />
              </TooltipTabstop>
            ) : (
              <IconButton
                icon="chevron-double-right"
                tooltipPlacement="bottom"
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
  // TODO: why doesn't PropTypes.node work here??
  statusLabel: PropTypes.any,
  firstPageLabel: PropTypes.any,
  previousPageLabel: PropTypes.any,
  nextPageLabel: PropTypes.any,
  lastPageLabel: PropTypes.any,
  onNextPageClick: PropTypes.func,
  onPreviousPageClick: PropTypes.func,
  onFirstPageClick: PropTypes.func,
  onLastPageClick: PropTypes.func,
  className: PropTypes.string,
  // TODO: why doesn't string (without isRequired) work??
  variant: PropTypes.any
};

export default Pagination;
