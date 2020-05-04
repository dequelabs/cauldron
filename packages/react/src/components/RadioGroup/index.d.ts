import React from 'react';
import PropTypes from 'prop-types';
export interface RadioItem extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export interface RadioGroupProps {
  name: string;
  className?: string;
  radios: RadioItem[];
  defaultValue?: string;
  onChange: (radio: RadioItem, input: HTMLElement) => void;
}
interface RadioGroupState {
  value: any;
  focusIndex?: number | null;
}
export default class RadioGroup extends React.Component<
  RadioGroupProps,
  RadioGroupState
> {
  static defaultProps: {
    className: string;
    defaultValue: null;
    onChange: () => void;
  };
  static propTypes: {
    name: PropTypes.Validator<string>;
    radios: PropTypes.Validator<
      (
        | PropTypes.InferProps<{
            value: PropTypes.Validator<string>;
            id: PropTypes.Validator<string>;
            label: PropTypes.Validator<string>;
          }>
        | null
        | undefined
      )[]
    >;
    hasLabel: (
      props: {
        [key: string]: string;
      },
      propName: string,
      componentName: string
    ) => Error | undefined;
    className: PropTypes.Requireable<string>;
    defaultValue: PropTypes.Requireable<string>;
    onChange: PropTypes.Requireable<(...args: any[]) => any>;
  };
  private inputs;
  private handleChange;
  private onRadioFocus;
  private onRadioBlur;
  private onRadioClick;
  constructor(props: RadioGroupProps);
  render(): JSX.Element;
}
export {};
