import React, { useState } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Pagination, {
  usePagination
} from '../../../../src/components/Pagination';

describe('Pagination', () => {
  test('sets `thin` variant', () => {
    const wrapper = mount(<Pagination totalItems={18} currentPage={1} thin />);
    expect(wrapper.find('.Pagination.Pagination--thin').exists());
  });

  describe('without hook', () => {
    describe('on the first page', () => {
      test('Disables first/prev page buttons', () => {
        const onFirstPageClick = sinon.spy();
        const onPreviousPageClick = sinon.spy();
        const wrapper = mount(
          <Pagination
            totalItems={18}
            currentPage={1}
            onFirstPageClick={onFirstPageClick}
            onPreviousPageClick={onPreviousPageClick}
          />
        );
        expect(
          wrapper
            .find('button')
            .at(0)
            .is('[aria-disabled="true"]')
        ).toBe(true);

        expect(
          wrapper
            .find('button')
            .at(1)
            .is('[aria-disabled="true"]')
        ).toBe(true);

        expect(
          wrapper
            .find('button')
            .at(2)
            .is('[aria-disabled="true"]')
        ).toBe(false);

        expect(
          wrapper
            .find('button')
            .at(3)
            .is('[aria-disabled="true"]')
        ).toBe(false);

        wrapper
          .find('button')
          .at(0)
          .simulate('click');
        wrapper
          .find('button')
          .at(1)
          .simulate('click');

        expect(onFirstPageClick.callCount).toBe(0);
        expect(onPreviousPageClick.callCount).toBe(0);
      });
    });

    describe('on the last page', () => {
      test('Disables last/next page buttons', () => {
        const onNextPageClick = sinon.spy();
        const onLastPageClick = sinon.spy();
        const wrapper = mount(
          <Pagination
            totalItems={18}
            currentPage={2}
            onNextPageClick={onNextPageClick}
            onLastPageClick={onLastPageClick}
          />
        );
        expect(
          wrapper
            .find('button')
            .at(0)
            .is('[aria-disabled="true"]')
        ).toBe(false);

        expect(
          wrapper
            .find('button')
            .at(1)
            .is('[aria-disabled="true"]')
        ).toBe(false);

        expect(
          wrapper
            .find('button')
            .at(2)
            .is('[aria-disabled="true"]')
        ).toBe(true);

        expect(
          wrapper
            .find('button')
            .at(3)
            .is('[aria-disabled="true"]')
        ).toBe(true);

        wrapper
          .find('button')
          .at(2)
          .simulate('click');
        wrapper
          .find('button')
          .at(3)
          .simulate('click');

        expect(onNextPageClick.callCount).toBe(0);
        expect(onLastPageClick.callCount).toBe(0);
      });
    });

    test('supports custom status label text', () => {
      const wrapper = mount(
        <Pagination
          totalItems={18}
          statusLabel={<div id="foo">hello world</div>}
        />
      );

      expect(wrapper.find('#foo').exists()).toBe(true);
    });

    test('calls on{Next,Previous,First,Last}Click as expected', () => {
      const onNextPageClick = sinon.spy();
      const onPreviousPageClick = sinon.spy();
      const onFirstPageClick = sinon.spy();
      const onLastPageClick = sinon.spy();

      const wrapper = mount(
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

      // click the first page button
      wrapper
        .find('button')
        .at(0)
        .simulate('click');
      expect(onFirstPageClick.callCount).toBe(1);
      expect(onPreviousPageClick.callCount).toBe(0);
      expect(onNextPageClick.callCount).toBe(0);
      expect(onLastPageClick.callCount).toBe(0);

      // click the prev page button
      wrapper
        .find('button')
        .at(1)
        .simulate('click');
      expect(onFirstPageClick.callCount).toBe(1);
      expect(onPreviousPageClick.callCount).toBe(1);
      expect(onNextPageClick.callCount).toBe(0);
      expect(onLastPageClick.callCount).toBe(0);

      // click the next page button
      wrapper
        .find('button')
        .at(2)
        .simulate('click');
      expect(onFirstPageClick.callCount).toBe(1);
      expect(onPreviousPageClick.callCount).toBe(1);
      expect(onNextPageClick.callCount).toBe(1);
      expect(onLastPageClick.callCount).toBe(0);

      // click the last page button
      wrapper
        .find('button')
        .at(3)
        .simulate('click');
      expect(onFirstPageClick.callCount).toBe(1);
      expect(onPreviousPageClick.callCount).toBe(1);
      expect(onNextPageClick.callCount).toBe(1);
      expect(onLastPageClick.callCount).toBe(1);
    });

    test('renders the expected default status label', () => {
      const wrapper = mount(
        <Pagination totalItems={500} currentPage={3} itemsPerPage={17} />
      );

      expect(wrapper.find('[role="log"]').text()).toBe(
        'Showing 35 to 51 of 500'
      );
    });
  });

  describe('with hook', () => {
    test('initializes and handles pagesize change as expected', () => {
      let testPagination1;
      let testPageStatus1;

      const PaginationWithHook1 = () => {
        const [pageSize, setPageSize] = useState(10);
        const { pagination, pageStatus } = usePagination({
          totalItems: 500,
          initialPage: 3,
          initialPageSize: pageSize
        });
        testPagination1 = pagination;
        testPageStatus1 = pageStatus;

        function onPageSizeChange() {
          setPageSize(25);
          pageStatus.setCurrentPage(1);
        }
        return (
          <div>
            <button onClick={onPageSizeChange}>25</button>
            <Pagination {...pagination} />
          </div>
        );
      };
      const wrapper = mount(<PaginationWithHook1 />);
      expect(testPagination1.totalItems).toBe(500);
      expect(testPagination1.currentPage).toBe(3);
      expect(testPagination1.itemsPerPage).toBe(10);
      expect(testPageStatus1.currentPage).toStrictEqual(3);
      expect(testPageStatus1.pageStart).toStrictEqual(21);
      expect(testPageStatus1.pageEnd).toStrictEqual(30);
      // click the next page button
      wrapper
        .find('button')
        .at(3)
        .simulate('click');
      expect(testPageStatus1.currentPage).toStrictEqual(4);
      expect(testPageStatus1.pageStart).toStrictEqual(31);
      expect(testPageStatus1.pageEnd).toStrictEqual(40);
      //change the itemsPerPage
      wrapper
        .find('button')
        .at(0)
        .simulate('click');
      expect(testPagination1.itemsPerPage).toBe(25);
      expect(testPagination1.currentPage).toBe(1);
      expect(testPageStatus1.currentPage).toStrictEqual(1);
      expect(testPageStatus1.pageStart).toStrictEqual(1);
      expect(testPageStatus1.pageEnd).toStrictEqual(25);
    });

    test('initializes and calls on{Next,Previous,First,Last}Click as expected', () => {
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

      const wrapper = mount(<PaginationWithHook />);

      expect(testPagination.totalItems).toBe(500);
      expect(testPagination.currentPage).toBe(3);
      expect(testPagination.itemsPerPage).toBe(10);
      expect(testPageStatus.currentPage).toStrictEqual(3);
      expect(testPageStatus.pageStart).toStrictEqual(21);
      expect(testPageStatus.pageEnd).toStrictEqual(30);

      // click the prev page button
      wrapper
        .find('button')
        .at(1)
        .simulate('click');
      expect(testPageStatus.currentPage).toStrictEqual(2);
      expect(testPageStatus.pageStart).toStrictEqual(11);
      expect(testPageStatus.pageEnd).toStrictEqual(20);

      // click the next page button
      wrapper
        .find('button')
        .at(2)
        .simulate('click');
      expect(testPageStatus.currentPage).toStrictEqual(3);
      expect(testPageStatus.pageStart).toStrictEqual(21);
      expect(testPageStatus.pageEnd).toStrictEqual(30);

      // click the first page button
      wrapper
        .find('button')
        .at(0)
        .simulate('click');
      expect(testPageStatus.currentPage).toStrictEqual(1);
      expect(testPageStatus.pageStart).toStrictEqual(1);
      expect(testPageStatus.pageEnd).toStrictEqual(10);

      // click the last page button
      wrapper
        .find('button')
        .at(3)
        .simulate('click');
      expect(testPageStatus.currentPage).toStrictEqual(50);
      expect(testPageStatus.pageStart).toStrictEqual(491);
      expect(testPageStatus.pageEnd).toStrictEqual(500);
    });
  });
});
