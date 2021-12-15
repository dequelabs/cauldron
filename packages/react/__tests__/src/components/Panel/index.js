import React from 'react';
import { mount } from 'enzyme';
import Panel from '../../../../src/components/Panel';

describe('Panel', () => {
  test('renders with default heading level', () => {
    const panel = mount(<Panel heading={{ text: 'Title' }}>Content</Panel>);

    const heading = panel.find('.Panel__Heading');
    expect(heading.text()).toBe('Title');
    expect(heading.type()).toBe('h2');

    expect(panel.text()).toContain('Content');
  });

  test('renders with custom heading level', () => {
    const panel = mount(
      <Panel heading={{ text: 'Title', level: 3 }}>Content</Panel>
    );

    const heading = panel.find('.Panel__Heading');
    expect(heading.text()).toBe('Title');
    expect(heading.type()).toBe('h3');

    expect(panel.text()).toContain('Content');
  });

  test('renders custom attributes', () => {
    const panel = mount(
      <Panel heading={{ text: 'Title' }} aria-label="Custom Label">
        Content
      </Panel>
    );

    expect(panel.props()['aria-label']).toBe('Custom Label');
  });
});
