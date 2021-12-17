import React from 'react';
import { mount } from 'enzyme';
import IssuePanel from '../../../../src/components/IssuePanel';
import IconButton from '../../../../src/components/IconButton';
import { act } from 'react-dom/test-utils';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

test('IssuePannel: renders without title', () => {
  const issuePanel = mount(<IssuePanel>Content</IssuePanel>);

  expect(issuePanel.find('.IssuePanel__Header').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-title').exists()).toBe(false);
  expect(issuePanel.find('.IssuePanel__Header-actions').exists()).toBe(false);
  expect(issuePanel.find('.IssuePanel__Content').exists()).toBe(true);
});

test('IssuePannel: renders with title', () => {
  const issuePanel = mount(<IssuePanel title="Issue 1">Content</IssuePanel>);

  expect(issuePanel.find('.IssuePanel__Header').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-title').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-actions').exists()).toBe(false);
  expect(issuePanel.find('.IssuePanel__Content').exists()).toBe(true);
});

test('IssuePannel: renders without actions', () => {
  const issuePanel = mount(<IssuePanel title="Issue 1">Content</IssuePanel>);

  expect(issuePanel.find('.IssuePanel__Header').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-title').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-actions').exists()).toBe(false);
  expect(issuePanel.find('.IssuePanel__Content').exists()).toBe(true);
});

test('IssuePannel: renders with actions', async () => {
  const actions = [
    <IconButton icon="pencil" label="Edit" key="edit" />,
    <IconButton icon="trash" label="Remove state" key="trash" />
  ];
  const issuePanel = mount(
    <IssuePanel title="Issue 1" actions={actions}>
      Content
    </IssuePanel>
  );
  await update(issuePanel);
  expect(issuePanel.find('.IssuePanel__Header').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-title').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Header-actions').exists()).toBe(true);
  expect(issuePanel.find('.IssuePanel__Content').exists()).toBe(true);
});
