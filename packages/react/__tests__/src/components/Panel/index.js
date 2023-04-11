import React from 'react';
import { mount } from 'enzyme';
import Panel, {
  PanelHeader,
  PanelContent
} from '../../../../src/components/Panel';
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

describe('Panel', () => {
  test('renders with default heading level', () => {
    const panel = mount(<Panel heading={{ text: 'Title' }}>Content</Panel>);

    const heading = panel.find('.Panel__Heading');
    expect(heading.text()).toBe('Title');
    expect(heading.children().type()).toBe('h2');

    expect(panel.text()).toContain('Content');
  });

  test('renders with custom heading level', () => {
    const panel = mount(
      <Panel heading={{ text: 'Title', level: 3 }}>Content</Panel>
    );

    const heading = panel.find('.Panel__Heading');
    expect(heading.text()).toBe('Title');
    expect(heading.children().type()).toBe('h3');

    expect(panel.text()).toContain('Content');
  });

  test('labels the panel by the heading by default', () => {
    const panel = mount(<Panel heading={{ text: 'Title' }}>Content</Panel>);

    const heading = panel.find('.Panel__Heading');
    const headingId = heading.children().props()['id'];
    expect(heading.text()).toBe('Title');
    expect(heading.children().type()).toBe('h2');
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
    expect(heading.type()).toBe('div');
    expect(heading.children().type()).toBe('h2');
    expect(heading.children().props()['id']).toBe('heading123');

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

  test('renders with no heading', () => {
    const panel = mount(<Panel>Content</Panel>);

    expect(panel.find('.Panel__Header').exists()).toBe(false);
    expect(panel.find('.Panel__Heading').exists()).toBe(false);
    expect(panel.text()).toContain('Content');
  });

  test('renders with composed heading', () => {
    const panel = mount(
      <Panel>
        <PanelHeader>
          <h1>Panel Heading</h1>
        </PanelHeader>
        Content
      </Panel>
    );
    console.log(panel);
    expect(panel.find('.Panel__Header').exists()).toBe(true);
    expect(panel.text()).toContain('Content');
  });

  test('renders with composed content', () => {
    const panel = mount(
      <Panel>
        <PanelContent>Content</PanelContent>
      </Panel>
    );
    expect(panel.find('.Panel__Content').exists()).toBe(true);
    expect(panel.text()).toContain('Content');
  });

  test('renders with composed content and heading', () => {
    const panel = mount(
      <Panel>
        <PanelHeader>
          <h1>Panel Heading</h1>
        </PanelHeader>
        <PanelContent>Content</PanelContent>
      </Panel>
    );

    expect(panel.find('.Panel__Header').exists()).toBe(true);
    expect(panel.find('.Panel__Content').exists()).toBe(true);
    expect(panel.text()).toContain('Content');
  });

  test('renders with composed content and heading with custom attributes', () => {
    const panel = mount(
      <Panel>
        <PanelHeader>
          <h1>Panel Heading</h1>
        </PanelHeader>
        <PanelContent aria-label="Custom Label">Content</PanelContent>
      </Panel>
    );

    expect(panel.find('.Panel__Header').exists()).toBe(true);
    expect(panel.find('.Panel__Content').exists()).toBe(true);
    expect(panel.text()).toContain('Content');
    expect(panel.find('.Panel__Content').props()['aria-label']).toBe(
      'Custom Label'
    );
  });

  test('renders with multiple `PanelContent` components', () => {
    const panel = mount(
      <Panel>
        <PanelHeader>
          <h1>Panel Heading</h1>
        </PanelHeader>
        <PanelContent>Content #1</PanelContent>
        <PanelContent>Content #2</PanelContent>
      </Panel>
    );

    expect(panel.find('.Panel__Content').exists()).toBe(true);
    expect(panel.find('.Panel__Content').length).toBe(2);
    expect(panel.text()).toContain('Content #1');
    expect(panel.text()).toContain('Content #2');
  });

  describe('has no a11y violations with', () => {
    test('Panel and heading prop', async () => {
      const panel = mount(
        <main>
          <Panel heading={{ text: 'Title' }}>Content</Panel>
        </main>
      );

      expect(await axe(panel.html())).toHaveNoViolations();
    });

    test('Panel and composed heading', async () => {
      const panel = mount(
        <main>
          <Panel>
            <PanelHeader>
              <h1>Panel Heading</h1>
            </PanelHeader>
            Content
          </Panel>
        </main>
      );

      expect(await axe(panel.html())).toHaveNoViolations();
    });

    test('Panel with no heading', async () => {
      const panel = mount(
        <main>
          <Panel>Content</Panel>
        </main>
      );

      expect(await axe(panel.html())).toHaveNoViolations();
    });
  });
});
