import React from 'react';
import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import axe from '../../../axe';

test('should render primary button', () => {
  render(
    <>
      <Button>default primary</Button>
      <Button variant="primary">variant primary</Button>
    </>
  );
  expect(screen.getByRole('button', { name: 'default primary' })).toHaveClass(
    'Button--primary'
  );
  expect(screen.getByRole('button', { name: 'variant primary' })).toHaveClass(
    'Button--primary'
  );
});

test.skip('should render secondary button', () => {
  const button = shallow(<Button variant="secondary">secondary</Button>);
  expect(button.hasClass('Button--secondary')).toBe(true);
});

test.skip('should render error button', () => {
  const button = shallow(<Button variant="error">error</Button>);
  expect(button.hasClass('Button--error')).toBe(true);
});

test.skip('should render button as link', () => {
  const button = shallow(<Button variant="link">link</Button>);
  expect(button.hasClass('Link')).toBe(true);
});

test.skip('should render button as tag', () => {
  const button = shallow(<Button variant="tag">tag</Button>);
  expect(button.hasClass('Tag')).toBe(true);
});

test.skip('should handle <Icon /> as child', () => {
  const button = shallow(
    <Button>
      <Icon type="trash" />
      Delete
    </Button>
  );
  expect(button.contains(<Icon type="trash" />)).toBe(true);
});

test.skip('should handle "thin" modifier', () => {
  const button = shallow(<Button thin>link</Button>);
  expect(button.hasClass('Button--thin')).toBe(true);
});

test.skip('should return no axe violations', async () => {
  const defaultButton = shallow(<Button>primary</Button>);
  const button = shallow(<Button variant="primary">primary</Button>);
  const buttonLink = shallow(<Button variant="link">link</Button>);
  const iconButton = shallow(
    <Button>
      <Icon type="bolt" />
      scan
    </Button>
  );

  expect(await axe(defaultButton.html())).toHaveNoViolations();
  expect(await axe(button.html())).toHaveNoViolations();
  expect(await axe(buttonLink.html())).toHaveNoViolations();
  expect(await axe(iconButton.html())).toHaveNoViolations();
});
