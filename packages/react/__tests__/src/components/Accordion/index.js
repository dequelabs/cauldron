import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  AccordionTwo,
  AccordionTrigger,
  AccordionPanel,
  AccordionContainer
} from 'src/components/Accordion';
import * as stylesheets from 'src/utils/stylesheets';
import { render, rerender } from 'react-dom';

// const isVisible = (element) => {
//   const node = element.getDOMNode().parentNode;
//   // Ideally we would test against actual DOM, but short-cutting to use `is-hidden`
//   // which should have the appropriate styles to be actually hidden
//   return !node.classList.contains('.Accordion');
// };

describe('Accordion', () => {
  test('renders without errors', () => {
    const accordion = mount(<AccordionTwo />);

    expect(accordion.find('.Accordion__container')).toBeTruthy();
  });
  test('renders with a trigger and panel element', () => {
    const accordion = shallow(
      <AccordionContainer>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionPanel>This is another test</AccordionPanel>
      </AccordionContainer>
    );

    expect(accordion.find('.Accordion__triggger')).toBeTruthy();
    expect(accordion.find('.Accordion__panel')).toBeTruthy();
  });
  test('renders the trigger as a button', () => {
    const accordion = shallow(
      <AccordionContainer>
        <AccordionTrigger>Testing 1 2 3</AccordionTrigger>
        <AccordionPanel>This is another test</AccordionPanel>
      </AccordionContainer>
    );

    expect(accordion.find('button')).toBeTruthy();
    expect(accordion.find('.Accordion__trigger').text()).toEqual(
      'Testing 1 2 3'
    );
  });
});
