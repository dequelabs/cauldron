import React from 'react';
import { mount } from 'enzyme';
import Pagination from 'src/components/Pagination';
import axe from '../../../axe';

const defaultProps = {
  pageSize: 10,
  currentPage: 1,
  currentItemCount: 10,
  totalPages: 2,
  totalItems: 15,
  hasNext: false,
  hasPrevious: false,
  handlePageChange: () => {},
  handlePageSizeChange: () => {}
};

test('should render the page size selector', () => {
  const pagination = mount(<Pagination {...defaultProps} />);
  expect(pagination.find('select')).toHaveLength(1);
  pagination.unmount();
});

test('should render the page navigation index', () => {
  const pagination = mount(<Pagination {...defaultProps} />);
  expect(pagination.find('#page_index')).toHaveLength(1);
  pagination.unmount();
});

test('should disable first and previous buttons when hasPrevious false', () => {
  const pagination = mount(<Pagination {...defaultProps} />);
  expect(
    pagination
      .find('.IconButton')
      .at(0)
      .prop('disabled')
  ).toBeTruthy;
  expect(
    pagination
      .find('.IconButton')
      .at(1)
      .prop('disabled')
  ).toBeTruthy;
  pagination.unmount();
});

test('should disable last and next buttons when hasNext is false', () => {
  const pagination = mount(<Pagination {...defaultProps} />);
  expect(
    pagination
      .find('.IconButton')
      .at(2)
      .prop('disabled')
  ).toBeTruthy;
  expect(
    pagination
      .find('.IconButton')
      .at(3)
      .prop('disabled')
  ).toBeTruthy;
  pagination.unmount();
});

test('should invoke page size change handler when page size is changed', () => {
  const change_handler_stub = jest.fn();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageSizeChange={change_handler_stub} />
  );
  pagination
    .find('.Page_Size_Options')
    .at(0)
    .simulate('change');
  expect(change_handler_stub).toBeCalled;
  pagination.unmount();
});

test('should invoke page change handler when page is changed', () => {
  const change_handler_stub = jest.fn();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageChange={change_handler_stub} />
  );
  pagination
    .find('.IconButton')
    .at(0)
    .simulate('click');
  expect(change_handler_stub).toBeCalled;
  pagination.unmount();
});

test('should display page index correctly', () => {
  const indexText = '11-15';

  const pagination = mount(
    <Pagination {...defaultProps} currentPage={2} currentItemCount={5} />
  );
  expect(
    pagination
      .find('#page_index > p')
      .at(0)
      .text()
  ).toContain(indexText);
  pagination.unmount();
});

test('should return no axe violations', async () => {
  const pagination = mount(<Pagination {...defaultProps} />);

  expect(await axe(pagination.html())).toHaveNoViolations();
});
