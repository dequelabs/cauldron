import React from 'react';
import { mount } from 'enzyme';
import Panel from '../../../../src/components/Panel';
import IconButton from '../../../../src/components/IconButton';
import { act } from 'react-dom/test-utils';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

test('Pannel: renders without title', () => {
  const panel = mount(<Panel>Content</Panel>);

  expect(panel.find('.Panel__Header').exists()).toBe(true);
  expect(panel.find('.Panel__Header-title').exists()).toBe(false);
  expect(panel.find('.Panel__Header-actions').exists()).toBe(false);
  expect(panel.find('.Panel__Content').exists()).toBe(true);
});

test('Pannel: renders with title', () => {
  const panel = mount(<Panel title="Issue 1">Content</Panel>);

  expect(panel.find('.Panel__Header').exists()).toBe(true);
  expect(panel.find('.Panel__Header-title').exists()).toBe(true);
  expect(panel.find('.Panel__Header-actions').exists()).toBe(false);
  expect(panel.find('.Panel__Content').exists()).toBe(true);
});

test('Pannel: renders without actions', () => {
  const panel = mount(<Panel title="Issue 1">Content</Panel>);

  expect(panel.find('.Panel__Header').exists()).toBe(true);
  expect(panel.find('.Panel__Header-title').exists()).toBe(true);
  expect(panel.find('.Panel__Header-actions').exists()).toBe(false);
  expect(panel.find('.Panel__Content').exists()).toBe(true);
});

test('Pannel: renders with actions', async () => {
  const actions = [
    <IconButton icon="pencil" label="Edit" key="edit" />,
    <IconButton icon="trash" label="Remove state" key="trash" />
  ];
  const panel = mount(
    <Panel title="Issue 1" actions={actions}>
      Content
    </Panel>
  );
  await update(panel);
  expect(panel.find('.Panel__Header').exists()).toBe(true);
  expect(panel.find('.Panel__Header-title').exists()).toBe(true);
  expect(panel.find('.Panel__Header-actions').exists()).toBe(true);
  expect(panel.find('.Panel__Content').exists()).toBe(true);
});
