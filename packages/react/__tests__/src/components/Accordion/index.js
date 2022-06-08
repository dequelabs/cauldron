import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  default as Accordion,
  AccordionPanel,
  AccordionTrigger
} from 'src/components/Accordion';
import * as stylesheets from 'src/utils/stylesheets';

// const isVisible = (element) => {
//   const node = element.getDOMNode().parentNode;
//   // Ideally we would test against actual DOM, but short-cutting to use `is-hidden`
//   // which should have the appropriate styles to be actually hidden
//   return !node.classList.contains('.Accordion');
// };

// describe('Accordion', () => {
//   test('renders without errors', () => {
//     const accordion = mount(<Accordion />);

//     expect(isVisible(accordion.find('.Accordion'))).toBeTruthy();
//   });
// });
