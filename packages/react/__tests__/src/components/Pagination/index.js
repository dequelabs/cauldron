import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Pagination from '../../../../src/components/Pagination';

describe('on the first page', () => {
  test('Disables first/prev page buttons', () => {
    const goToPage = sinon.spy();
    const onFirstPageClick = sinon.spy();
    const onPreviousPageClick = sinon.spy();
    const wrapper = mount(
      <Pagination
        totalItems={18}
        currentPage={1}
        goToPage={goToPage}
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

    expect(goToPage.callCount).toBe(0);
    expect(onFirstPageClick.callCount).toBe(0);
    expect(onPreviousPageClick.callCount).toBe(0);
  });
});

describe('on the last page', () => {
  test('Disables last/next page buttons', () => {
    const goToPage = sinon.spy();
    const onNextPageClick = sinon.spy();
    const onLastPageClick = sinon.spy();
    const wrapper = mount(
      <Pagination
        totalItems={18}
        currentPage={2}
        goToPage={goToPage}
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

    expect(goToPage.callCount).toBe(0);
    expect(onNextPageClick.callCount).toBe(0);
    expect(onLastPageClick.callCount).toBe(0);
  });
});

test('supports custom status label text', () => {
  const wrapper = mount(
    <Pagination totalItems={18} statusLabel={<div id="foo">hello world</div>} />
  );

  expect(wrapper.find('#foo').exists()).toBe(true);
});

test('calls on{Next,Previous,First,Last}Click as expected', () => {
  const goToPage = sinon.spy();
  const onNextPageClick = sinon.spy();
  const onPreviousPageClick = sinon.spy();
  const onFirstPageClick = sinon.spy();
  const onLastPageClick = sinon.spy();

  const wrapper = mount(
    <Pagination
      totalItems={500}
      currentPage={3}
      itemsPerPage={10}
      goToPage={goToPage}
      onFirstPageClick={onFirstPageClick}
      onPreviousPageClick={onPreviousPageClick}
      onNextPageClick={onNextPageClick}
      onLastPageClick={onLastPageClick}
    />
  );

  // click the first page button
  wrapper
    .find('button')
    .at(0)
    .simulate('click');
  expect(goToPage.args).toStrictEqual([[1]]);
  expect(onFirstPageClick.callCount).toBe(1);
  expect(onPreviousPageClick.callCount).toBe(0);
  expect(onNextPageClick.callCount).toBe(0);
  expect(onLastPageClick.callCount).toBe(0);

  // click the prev page button
  wrapper
    .find('button')
    .at(1)
    .simulate('click');
  expect(goToPage.args).toStrictEqual([[1], [2]]);
  expect(onFirstPageClick.callCount).toBe(1);
  expect(onPreviousPageClick.callCount).toBe(1);
  expect(onNextPageClick.callCount).toBe(0);
  expect(onLastPageClick.callCount).toBe(0);

  // click the next page button
  wrapper
    .find('button')
    .at(2)
    .simulate('click');
  expect(goToPage.args).toStrictEqual([[1], [2], [4]]);
  expect(onFirstPageClick.callCount).toBe(1);
  expect(onPreviousPageClick.callCount).toBe(1);
  expect(onNextPageClick.callCount).toBe(1);
  expect(onLastPageClick.callCount).toBe(0);

  // click the last page button
  wrapper
    .find('button')
    .at(3)
    .simulate('click');
  expect(goToPage.args).toStrictEqual([[1], [2], [4], [50]]);
  expect(onFirstPageClick.callCount).toBe(1);
  expect(onPreviousPageClick.callCount).toBe(1);
  expect(onNextPageClick.callCount).toBe(1);
  expect(onLastPageClick.callCount).toBe(1);
});

test('renders the expected default status label', () => {
  const wrapper = mount(
    <Pagination totalItems={500} currentPage={3} itemsPerPage={17} />
  );

  expect(wrapper.find('[role="log"]').text()).toBe('Showing 35 to 51 of 500');
});
