import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import Select from '../Select';

export interface paginationProps {
  pageSize: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  currentItemCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  mobileView?: boolean;
  handlePageSizeChange: (pagesize: string) => void;
  handlePageChange: (pagenumber: number) => void;
}

const Pagination = (props: paginationProps) => {
  const mobileView = props.mobileView ? props.mobileView : false;
  const previousPage = props.currentPage - 1;
  const startIndex =
    props.currentPage === 1 ? 1 : props.pageSize * previousPage + 1;
  const endIndex = startIndex + props.currentItemCount - 1;
  const current_page_index = (
    <p className={mobileView ? 'Page_Index_Sm' : ''}>
      {'Showing '}{' '}
      <span>
        {' '}
        {startIndex}-{endIndex}
      </span>{' '}
      {' of '} <span>{props.totalItems}</span>
    </p>
  );
  const changePage = (e: React.MouseEvent, pagenumber: number) => {
    props.handlePageChange(pagenumber);
  };

  return (
    <div className={`${mobileView ? 'Pagination_Sm' : ''} Pagination`}>
      <div
        className={`${
          mobileView ? 'Page_Size_Selector_Sm' : ''
        } Page_Size_Selector`}
      >
        <Select
          value={props.pageSize}
          className={'Page_Size_Options'}
          placeholder="Select page size"
          label={'Show'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            props.handlePageSizeChange(e.target.value)
          }
          options={[
            {
              key: '10',
              value: '10',
              label: '10 records'
            },
            {
              key: '50',
              value: '50',
              label: '50 records'
            },
            {
              key: '100',
              value: '100',
              label: '100 records'
            }
          ]}
        />
      </div>
      <nav
        id="page_index"
        className={'Page_Index_Wrapper'}
        aria-label="pagination"
      >
        <IconButton
          aria-label="Goto First page"
          icon="chevron-double-left"
          label="Goto First page"
          disabled={!props.hasPrevious}
          variant="secondary"
          onClick={(e: React.MouseEvent) => changePage(e, 1)}
          className={'Page_Nav'}
        />
        <IconButton
          aria-label="Goto Previous page"
          icon="chevron-left"
          label="Goto Previous page"
          disabled={!props.hasPrevious}
          variant="secondary"
          onClick={(e: React.MouseEvent) =>
            changePage(e, props.currentPage - 1)
          }
          className={'Page_Nav'}
        />
        {!mobileView && current_page_index}
        <IconButton
          aria-label="Goto Next page"
          icon="chevron-right"
          label="Goto Next page"
          disabled={!props.hasNext}
          variant="secondary"
          onClick={(e: React.MouseEvent) =>
            changePage(e, props.currentPage + 1)
          }
          className={'Page_Nav'}
        />
        <IconButton
          aria-label="Goto Last page"
          icon="chevron-double-right"
          label="Goto Last page"
          disabled={!props.hasNext}
          variant="secondary"
          onClick={(e: React.MouseEvent) => changePage(e, props.totalPages)}
          className={'Page_Nav'}
        />
      </nav>
      {mobileView && current_page_index}
    </div>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  totalItems: PropTypes.number,
  currentItemCount: PropTypes.number,
  hasPrevious: PropTypes.bool,
  hasNext: PropTypes.bool,
  mobileView: PropTypes.bool,
  handlePageSizeChange: PropTypes.func,
  handlePageChange: PropTypes.func
};

Pagination.displayName = 'Pagination';

export default Pagination;
