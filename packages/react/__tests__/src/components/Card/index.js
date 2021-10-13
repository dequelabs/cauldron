import React from 'react';
import { shallow } from 'enzyme';
import {
  default as Card,
  CardHeader,
  CardContent,
  CardFooter
} from 'src/components/Card';
import axe from '../../../axe';

test('should render default card components', () => {
  const defaultCard = shallow(<Card></Card>);
  const defaultCardHeader = shallow(
    <CardHeader>
      <h3>Heading</h3>
    </CardHeader>
  );
  const defaultCardFooter = shallow(<CardFooter>Footer</CardFooter>);

  expect(defaultCard.hasClass('Card')).toBe(true);
  expect(defaultCardHeader.hasClass('Card__header')).toBe(true);
  expect(defaultCardFooter.hasClass('Card__footer')).toBe(true);
});

test('should render simple card', () => {
  const simpleCard = shallow(
    <Card variant="simple">
      <CardHeader>
        <h3>Simple card heading</h3>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
    </Card>
  );

  expect(simpleCard.hasClass('Card--simple')).toBe(true);
});

test('should return no axe violations', async () => {
  const defaultCard = shallow(
    <Card>
      <CardHeader>
        <h3>Card heading</h3>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>Footer content</CardFooter>
    </Card>
  );

  const simpleCard = shallow(
    <Card variant="simple">
      <CardHeader>
        <h3>Simple card heading</h3>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
    </Card>
  );

  expect(await axe(defaultCard.html())).toHaveNoViolations();
  expect(await axe(simpleCard.html())).toHaveNoViolations();
});
