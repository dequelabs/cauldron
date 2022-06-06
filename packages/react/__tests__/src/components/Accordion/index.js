import React from 'react';
import { mount } from 'enzyme';
import {
  default as Accordion,
  AccordionPanel,
  AccordionTrigger
} from 'src/components/Accordion';
import * as stylesheets from 'src/utils/stylesheets';
import { render } from 'react-dom';

describe('Accordion', () => {
  it('renders without errors', () => {
    render(<Accordion></Accordion>);
  });
});
