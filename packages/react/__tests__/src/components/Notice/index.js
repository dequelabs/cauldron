import React from 'react';
import { mount } from 'enzyme';
import Notice from 'src/components/Notice';
import axe from '../../../axe';

test('handles rendering without errors', done => {
  const wrapper = mount(<Notice />);
  expect(wrapper.find('Notice').length).toBe(1);
  done();
});

test('should render with defaults when no props passed in', async () => {
  const wrapper = mount(<Notice>child</Notice>);

  expect(wrapper.find('.Notice').length).toBe(1);
});
test('should render the correct default icon for a given `type`', async () => {
  const cautionNotice = mount(<Notice type="caution" title="Boom!" />);

  expect(cautionNotice.find('Icon').prop('type')).toBe('caution');
});

test('should return no axe violations', async () => {
  const info = mount(
    <Notice type="info" title="foo">
      bar
    </Notice>
  );

  const caution = mount(
    <Notice type="caution" title="foo">
      bar
    </Notice>
  );

  const infoAxeResults = await axe(info.html());
  const cautionAxeResults = await axe(caution.html());
  expect(infoAxeResults).toHaveNoViolations();
  expect(cautionAxeResults).toHaveNoViolations();
});

test('should return correctly with props passed in', async () => {
  const wrapper = mount(
    <Notice type="info" title="foo">
      bar
    </Notice>
  );

  expect(wrapper.find('Notice').length).toBe(1);
  expect(wrapper.prop('title')).toBe('foo');
  expect(wrapper.prop('type')).toBe('info');
  expect(wrapper.prop('children')).toBe('bar');
});

test('should fallback to the `info-circle` icon when an invalid icon type is passed in', async () => {
  const wrapper = mount(
    <Notice type="info" icon="invalid-icon" title="foo">
      bar
    </Notice>
  );

  expect(wrapper.find('Notice').length).toBe(1);
  expect(wrapper.find('Icon').prop('type')).toBe('info-circle');
});

test('should render with the correct icon when a valid icon `type` string is passed in', async () => {
  const wrapper = mount(<Notice type="info" icon="bolt" title="Dynamo!" />);

  expect(wrapper.find('Notice').length).toBe(1);
  expect(wrapper.find('Icon').prop('type')).toBe('bolt');
  expect(wrapper.find('.Icon--bolt').length).toBe(1);
});

test('should render only a `title` when no children are passed in', async () => {
  const wrapper = mount(<Notice title="foo" />);

  expect(wrapper.find('Notice').length).toBe(1);
  expect(wrapper.find('.Notice__title').contains('foo')).toBeTruthy();
});

test('`title` prop should allow for any valid ReactNode element', async () => {
  const wrapper = mount(
    <Notice title={<h2>foo</h2>}>
      <span>bar</span>
    </Notice>
  );

  expect(wrapper.find('Notice').length).toBe(1);
  expect(wrapper.contains(<h2>foo</h2>)).toBeTruthy();
});

test('should allow rendering with children, but no title', async () => {
  const wrapper = mount(
    <Notice>
      <span>bar</span>
    </Notice>
  );

  expect(wrapper.find('Notice').length).toBe(1);
  expect(wrapper.find('Icon').length).toBe(0);
  expect(wrapper.find('span').length).toBe(1);
  expect(wrapper.find('span').contains('bar')).toBeTruthy();
});

test('should allow a ref to be forwarded', async () => {
  const ref = React.createRef();
  const wrapper = mount(<Notice ref={ref} />);

  expect(wrapper.find('Notice').length).toBe(1);
  expect(ref.current).toBeTruthy();
});
