import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  AccordionTwo,
  AccordionPanelTrigger,
  AccordionContent,
  AccordionContainer
} from 'src/components/Accordion';
import * as stylesheets from 'src/utils/stylesheets';

describe('Accordion', () => {
  it('renders without errors', () => {
    const accordion = mount(<AccordionTwo />);

    expect(accordion.find('.Accordion__container')).toBeTruthy();
  });

  it('renders with a trigger and panel element', () => {
    const accordion = shallow(
      <AccordionContainer>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );

    expect(accordion.find('.Accordion__triggger')).toBeTruthy();
    expect(accordion.find('.Accordion__panel')).toBeTruthy();
  });

  it('renders the trigger element', () => {
    const accordion = mount(
      <AccordionContainer>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );
    console.log(accordion);
    expect(accordion.find('button')).toBeTruthy();
    expect(accordion.find('button.Accordion__trigger').text()).toEqual(
      'Testing 1 2 3'
    );
  });

  it('renders the content element', () => {
    const accordion = mount(
      <AccordionContainer>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );

    expect(accordion.find('.Accordion__panel')).toBeTruthy();
    expect(
      accordion.find('.ExpandCollapse__panel .Accordion__panel').text()
    ).toEqual('This is another test');
  });

  it('sets aria-expanded to false when collapsed', () => {
    const accordion = mount(
      <AccordionContainer open={true}>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );

    expect(
      accordion
        .find('button.Accordion__trigger')
        .getDOMNode()
        .getAttribute('aria-expanded')
    ).toEqual('false');
  });

  it('toggles aria-expanded to true when expanded', () => {
    const accordion = mount(
      <AccordionContainer>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );
    const button = accordion.find('button.Accordion__trigger');
    button.simulate('click');
    expect(
      accordion
        .find('button.Accordion__trigger')
        .getDOMNode()
        .getAttribute('aria-expanded')
    ).toEqual('true');
  });

  it('expands the panel element when the trigger element is clicked', () => {
    const spy = jest.fn();
    const accordion = mount(
      <AccordionContainer onToggle={spy}>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );

    const button = accordion.find('button.Accordion__trigger');
    button.simulate('click');
    expect(accordion.find('expanded')).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('when controlled', () => {
    it('expands the panel when the open prop is passed "true"', () => {
      const accordion = mount(
        <AccordionContainer open={false} isControlled>
          <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
          <AccordionContent>This is another test</AccordionContent>
        </AccordionContainer>
      );

      expect(accordion.find('.expanded')).toEqual({});
      expect(accordion.props().open).toEqual(false);

      accordion.setProps({ open: true });

      expect(accordion.find('.expanded')).toBeTruthy();
      expect(accordion.props().open).toEqual(true);
    });
  });
});
