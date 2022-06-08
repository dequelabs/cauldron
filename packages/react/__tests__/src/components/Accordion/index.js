import React from 'react';
import { mount, shallow, getDOMNode } from 'enzyme';
import {
  AccordionTwo,
  AccordionPanelTrigger,
  AccordionContent,
  AccordionContainer
} from 'src/components/Accordion';
import * as stylesheets from 'src/utils/stylesheets';

describe('Accordion', () => {
  test('renders without errors', () => {
    const accordion = mount(<AccordionTwo />);

    expect(accordion.find('.Accordion__container')).toBeTruthy();
  });
  test('renders with a trigger and panel element', () => {
    const accordion = shallow(
      <AccordionContainer>
        <AccordionPanelTrigger>Testing 1 2 3</AccordionPanelTrigger>
        <AccordionContent>This is another test</AccordionContent>
      </AccordionContainer>
    );

    expect(accordion.find('.Accordion__triggger')).toBeTruthy();
    expect(accordion.find('.Accordion__panel')).toBeTruthy();
  });

  test('renders the trigger as a button', () => {
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

  test('aria-expanded is false when collapsed', () => {
    const accordion = mount(
      <AccordionContainer>
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

  test('toggles aria-expanded to true', () => {
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

  test('expands the panel element when the trigger is clicked', () => {
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
});
