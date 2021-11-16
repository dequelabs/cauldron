import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { act } from 'react-dom/test-utils';
import Pagination from 'src/components/Pagination';
import axe from '../../../axe';

const defaultProps = {
  pageSize: 10,
  currentPage: 1,
  currentItemCount: 10,
  totalPages: 2,
  totalItems: 15,
  hasNext: true,
  hasPrevious: true,
  handlePageChange: () => {},
  handlePageSizeChange: () => {}
};

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

test('should render the page size selector', async () => {
  const pagination = mount(<Pagination {...defaultProps} />);
  await update(pagination);
  expect(pagination.find('select')).toHaveLength(1);
  pagination.unmount();
});

test('should render the page navigation index', async () => {
  const pagination = mount(<Pagination {...defaultProps} />);
  await update(pagination);
  expect(pagination.find('#page_index')).toHaveLength(1);
  pagination.unmount();
});

test('should disable first and previous buttons when hasPrevious false', async () => {
  const pagination = mount(
    <Pagination {...defaultProps} hasPrevious={false} />
  );
  await update(pagination);
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

test('should disable last and next buttons when hasNext is false', async () => {
  const pagination = mount(<Pagination {...defaultProps} hasNext={false} />);
  await update(pagination);
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

test('should invoke page size change handler when page size is changed', async () => {
  const change_handler_stub = spy();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageSizeChange={change_handler_stub} />
  );
  await update(pagination);
  pagination.find('select').simulate('change');
  expect(change_handler_stub.called).toBe(true);
  pagination.unmount();
});

test('should invoke page change handler when clicking next page', async () => {
  const change_handler_stub = spy();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageChange={change_handler_stub} />
  );
  await update(pagination);
  pagination
    .find('.IconButton')
    .at(2)
    .simulate('click');
  expect(change_handler_stub.called).toBe(true);
  pagination.unmount();
});

test('should invoke page change handler when clicking previous page', async () => {
  const change_handler_stub = spy();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageChange={change_handler_stub} />
  );
  await update(pagination);
  pagination
    .find('.IconButton')
    .at(1)
    .simulate('click');
  expect(change_handler_stub.called).toBe(true);
  pagination.unmount();
});

test('should invoke page change handler when clicking go to first page', async () => {
  const change_handler_stub = spy();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageChange={change_handler_stub} />
  );
  await update(pagination);
  pagination
    .find('.IconButton')
    .at(0)
    .simulate('click');
  expect(change_handler_stub.called).toBe(true);
  pagination.unmount();
});

test('should invoke page change handler when clicking go to last page', async () => {
  const change_handler_stub = spy();
  const pagination = mount(
    <Pagination {...defaultProps} handlePageChange={change_handler_stub} />
  );
  await update(pagination);
  pagination
    .find('.IconButton')
    .at(3)
    .simulate('click');
  expect(change_handler_stub.called).toBe(true);
  pagination.unmount();
});

test('should display page index correctly', async () => {
  const indexText = '11-15';

  const pagination = mount(
    <Pagination {...defaultProps} currentPage={2} currentItemCount={5} />
  );
  await update(pagination);
  expect(
    pagination
      .find('#page_index > p')
      .at(0)
      .text()
  ).toContain(indexText);
  pagination.unmount();
});

test('should render correct styles for mobile view', async () => {
  const pagination = mount(<Pagination {...defaultProps} mobileView={true} />);
  await update(pagination);

  expect(pagination.find('.Pagination_Sm')).toHaveLength(1);

  expect(pagination.find('.Page_Index_Sm')).toHaveLength(1);
  pagination.unmount();
});

test('should return no axe violations', async () => {
  const pagination = mount(
    <Pagination {...defaultProps} hasPrevious={false} hasNext={false} />
  );
  await update(pagination);
  expect(await axe(pagination.html())).toHaveNoViolations();
});

test('should return no axe violations on mobile view', async () => {
  const pagination = mount(
    <Pagination
      {...defaultProps}
      hasPrevious={false}
      hasNext={false}
      mobileView={true}
    />
  );
  await update(pagination);
  expect(await axe(pagination.html())).toHaveNoViolations();
});
