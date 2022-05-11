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

  test('labels the panel by the heading by default', () => {
    const panel = mount(<Panel heading={{ text: 'Title' }}>Content</Panel>);

    const heading = panel.find('.Panel__Heading');
    const headingId = heading.props()['id'];
    expect(heading.text()).toBe('Title');
    expect(heading.type()).toBe('h2');
    expect(headingId).toEqual(expect.any(String));

    expect(panel.text()).toContain('Content');

    expect(panel.find('section').props()['aria-labelledby']).toBe(headingId);
  });

  test('labels the panel by the heading id', () => {
    const panel = mount(
      <Panel heading={{ text: 'Title', id: 'heading123' }}>Content</Panel>
    );

    const heading = panel.find('.Panel__Heading');
    expect(heading.text()).toBe('Title');
    expect(heading.type()).toBe('h2');
    expect(heading.props()['id']).toBe('heading123');

    expect(panel.text()).toContain('Content');

    expect(panel.find('section').props()['aria-labelledby']).toBe('heading123');
  });

  test('renders custom attributes', () => {
    const panel = mount(
      <Panel heading={{ text: 'Title' }} aria-label="Custom Label">
        Content
      </Panel>
    );

    expect(panel.find('section').props()['aria-label']).toBe('Custom Label');
  });

  test('adds the collapsed class', () => {
    const panel = mount(
      <Panel heading={{ text: 'Title' }} collapsed>
        Content
      </Panel>
    );

    expect(panel.find('section').hasClass('Panel--collapsed')).toBe(true);
  });

  test('forwards a ref', () => {
    const ref = jest.fn();
    mount(
      <Panel ref={ref} heading={{ text: 'Title' }}>
        Content
      </Panel>
    );

    expect(ref).toHaveBeenCalled();
  });
});
