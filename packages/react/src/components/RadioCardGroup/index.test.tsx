import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RadioCardGroup, { RadioCardGroupProps } from './';
import FieldWrap from '../FieldWrap';
import axe from '../../axe';

interface ExtendedRadioCardGroupProps extends RadioCardGroupProps {
  'aria-label': string;
}

const defaultProps: ExtendedRadioCardGroupProps = {
  name: 'fred',
  'aria-label': 'Fred is good',
  radios: [
    {
      id: 'yes',
      value: 'yes',
      label: 'Yes',
      cardImg: <img src="https://via.placeholder.com/150" alt="" />,
      cardIcon: 'check-circle'
    },
    {
      id: 'no',
      value: 'no',
      label: 'No',
      disabled: true,
      cardImg: (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="red" />
        </svg>
      ),
      cardIcon: 'check-circle'
    },
    {
      id: 'tuesday',
      value: 'tuesday',
      label: 'Only on Tuesdays',
      cardImg: (
        <div
          style={{
            backgroundColor: 'green',
            height: 100,
            width: 100,
            borderRadius: 50
          }}
        ></div>
      ),
      cardIcon: 'check-circle'
    }
  ],
  onChange: jest.fn()
};

const renderDefaultRadioCardGroup = () => {
  return render(
    <FieldWrap>
      <RadioCardGroup {...defaultProps} />
    </FieldWrap>
  );
};

test('should handle defaultValue and check Only on Tuesdays', () => {
  const defaultValueIndex = 2;
  const defaultValue = defaultProps.radios[defaultValueIndex].value;

  render(
    <FieldWrap>
      <RadioCardGroup {...defaultProps} defaultValue={defaultValue} />
    </FieldWrap>
  );

  expect(screen.getByRole('radio', { name: 'Only on Tuesdays' })).toBeChecked();
  expect(
    screen.getByRole('radio', { name: 'Only on Tuesdays' }).parentElement
  ).toHaveClass('RadioCard__overlay', 'RadioCard__overlay--checked');
});

test('should handle disabled radio prop and disable No radio option', () => {
  renderDefaultRadioCardGroup();

  expect(screen.getByLabelText('No')).toBeDisabled();
  expect(screen.getByLabelText('No').parentElement).toHaveClass(
    'RadioCard__overlay',
    'RadioCard__overlay--disabled'
  );
});

test('should apply focus styles to the overlay when radio input is focused', () => {
  renderDefaultRadioCardGroup();

  expect(screen.getByLabelText('Yes').parentElement).not.toHaveClass(
    'RadioCard__overlay',
    'RadioCard__overlay--focused'
  );
  fireEvent.focus(screen.getByLabelText('Yes'));
  expect(screen.getByLabelText('Yes').parentElement).toHaveClass(
    'RadioCard__overlay',
    'RadioCard__overlay--focused'
  );
});

test('should render radiogroup with aria-labelledby or aria-label attributes', () => {
  render(
    <FieldWrap>
      <div className="Field__label" id="fred">
        Do you like coffee?
      </div>
      <RadioCardGroup {...defaultProps} aria-labelledby="fred" />
    </FieldWrap>
  );

  expect(
    screen.getByRole('radiogroup', { name: 'Do you like coffee?' })
  ).toHaveAttribute('aria-labelledby', 'fred');
  expect(
    screen.getByRole('radiogroup', { name: 'Do you like coffee?' })
  ).toHaveAttribute('aria-label', 'Fred is good');
  expect(
    screen
      .getByRole('radiogroup', { name: 'Do you like coffee?' })
      .getAttribute('aria-labelledby')
  ).toEqual('fred');
});

test('should pass className through', () => {
  render(
    <FieldWrap>
      <div className="Field__label">Test</div>
      <RadioCardGroup {...defaultProps} />
    </FieldWrap>
  );

  expect(screen.getByText('Test')).toHaveClass('Field__label');
});

test('returns no axe violations', async () => {
  const { container } = renderDefaultRadioCardGroup();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
