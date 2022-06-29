import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  Accordion,
  AccordionTrigger,
  AccordionContent
} from 'src/components/Accordion';
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

describe('Accordion', () => {
  it('renders without errors', () => {
    const accordion = mount(
      <Accordion>
        <AccordionTrigger>Trigger</AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </Accordion>
    );

    expect(accordion.find('.Accordion')).toBeTruthy();
  });

  it('renders with no axe violations', async () => {
    const wrapper = mount(
      <main>
        <Accordion>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      </main>
    );
    const results = await axe(wrapper.getDOMNode());
    expect(results).toHaveNoViolations();
  });

  it('renders with a trigger and panel element', () => {
    const accordion = mount(
      <Accordion>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );

    expect(accordion.find('.Accordion__triggger')).toBeTruthy();
    expect(accordion.find('.Accordion__panel')).toBeTruthy();
  });

  it('renders the trigger element', () => {
    const accordion = mount(
      <Accordion>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );

    expect(accordion.find('button')).toBeTruthy();
    expect(accordion.find('button.Accordion__trigger').text()).toEqual(
      'Testing 1 2 3'
    );
  });

  it('renders the content element', () => {
    const accordion = mount(
      <Accordion>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );
    const panel = accordion.find('.ExpandCollapse__panel');
    expect(panel.text()).toEqual('This is another test');
  });

  it('renders the content element without axe violations', async () => {
    const wrapper = mount(
      <main>
        <Accordion>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      </main>
    );
    const results = await axe(wrapper.getDOMNode());
    expect(results).toHaveNoViolations();
  });

  it('sets aria-expanded to false when collapsed', () => {
    const accordion = mount(
      <Accordion open={false}>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );

    expect(
      accordion.find('button.Accordion__trigger').prop('aria-expanded')
    ).toBeFalsy();
  });

  it('toggles aria-expanded to true when expanded', () => {
    const accordion = mount(
      <Accordion>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );

    const button = accordion.find('button.Accordion__trigger');
    button.simulate('click');

    expect(
      accordion.find('button.Accordion__trigger').props('aria-expanded')
    ).toBeTruthy();
  });

  it('calls onToggle when the trigger element is clicked', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <Accordion open={false} onToggle={jest.fn()}>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );

    expect(wrapper.find('.c').props('aria-expanded')).toBeTruthy();
    wrapper.find('aria-expanded');
    expect(spy).toHaveBeenCalled();
  });

  it('hides content in the panel element when collapsed', () => {
    mount(
      <Accordion open={false}>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>
          <div data-test>foo</div>
        </AccordionContent>
      </Accordion>
    );
    setTimeout(() => {
      expect(isVisible(wrapper.find('[data-test]'))).toBeFalsy();
      done();
    });
  });

  it('sets aria-controls on trigger element using the panel id', () => {
    const accordion = mount(
      <Accordion open={false}>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </Accordion>
    );

    const panelId = accordion.find('.ExpandCollapse__panel').prop('id');

    expect(
      accordion.find('button.Accordion__trigger').prop('aria-controls')
    ).toEqual(panelId);

    expect(accordion.find('.ExpandCollapse__panel').props('id')).toBeTruthy();
  });

  describe('when controlled', () => {
    it('expands when the open prop is passed "true"', () => {
      const accordion = mount(
        <Accordion open={false}>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );

      expect(accordion.props().open).toEqual(false);

      accordion.setProps({ open: true });

      expect(accordion.find('[aria-expanded="true"]')).toBeTruthy();
      expect(accordion.props().open).toEqual(true);
    });
  });

  describe('when not controlled', () => {
    describe('AccordionTrigger', () => {
      it('sets the className when passed a value in the className prop', () => {
        const accordion = mount(
          <Accordion open={false}>
            <AccordionTrigger className="test">Testing 1 2 3</AccordionTrigger>
            <AccordionContent>This is another test</AccordionContent>
          </Accordion>
        );

        expect(accordion.find('.test')).toBeTruthy();
      });
    });
  });

  describe('AccordionTrigger', () => {
    it('sets the className when passed a value in the className prop', () => {
      const accordion = mount(
        <Accordion open={false}>
          <AccordionTrigger className="test">Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );

      expect(accordion.find('.test')).toBeTruthy();
    });

    it('sets a heading level 2 element when passed a headingLevel prop', () => {
      const accordion = mount(
        <Accordion open={false}>
          <AccordionTrigger header={{ level: 2 }}>
            Testing 1 2 3
          </AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );
      expect(accordion.find('Header')).toBeTruthy();
    });

    it('does not set a heading element wrapper around the trigger when passed no prop', () => {
      const accordion = mount(
        <Accordion open={false}>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );

      expect(document.querySelector('h2')).toBeNull();
    });
  });

  describe('Accordion', () => {
    it('uses a default className if not passed one via the className prop', () => {
      const accordion = mount(
        <Accordion open={false}>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );

      expect(accordion.find('.Accordion')).toBeTruthy();
    });

    it('sets the className when passed a value in the className prop', () => {
      const accordion = mount(
        <Accordion className="test" open={false}>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );

      expect(accordion.find('.test')).toBeTruthy();
    });
  });

  describe('AccordionContent', () => {
    it('uses a default className if not passed one via the className prop', () => {
      const accordion = mount(
        <Accordion>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </Accordion>
      );

      expect(accordion.find('.Accordion__panel')).toBeTruthy();
    });

    it('sets the className when passed a value in the className prop', () => {
      const accordion = mount(
        <Accordion>
          <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
          <AccordionContent className="test">
            This is another test
          </AccordionContent>
        </Accordion>
      );

      expect(accordion.find('.test')).toBeTruthy();
    });
  });
});
