import React from 'react';
import { shallow } from 'enzyme';
import Button from 'src/components/Button';
import axe from '../../../axe';

test('should render primary button', () => {
  const defaultButton = shallow(<Button>primary</Button>);
  const button = shallow(<Button variant="primary">primary</Button>);
  expect(defaultButton.hasClass('Button--primary'));
  expect(button.hasClass('Button--primary'));
});

test('should render secondary button', () => {
  const button = shallow(<Button variant="secondary">secondary</Button>);
  expect(button.hasClass('Button--secondary'));
});

test('should render error button', () => {
  const button = shallow(<Button variant="error">error</Button>);
  expect(button.hasClass('Button--error'));
});

test('should render button as link', () => {
  const button = shallow(<Button variant="link">link</Button>);
  expect(button.hasClass('Link'));
});

test('should return no axe violations', async () => {
  const defaultButton = shallow(<Button>primary</Button>);
  const button = shallow(<Button variant="primary">primary</Button>);
  const buttonLink = shallow(<Button variant="link">link</Button>);

  expect(await axe(defaultButton.html())).toHaveNoViolations();
  expect(await axe(button.html())).toHaveNoViolations();
  expect(await axe(buttonLink.html())).toHaveNoViolations();
});
