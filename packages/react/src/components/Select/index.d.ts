import React from 'react';
import PropTypes from 'prop-types';
interface SelectOption {
  value: string;
  disabled?: boolean;
  label?: React.ReactNode;
}
export interface SelectProps
  extends Omit<
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onKeyDown'>,
    'onSelect'
  > {
  options: SelectOption[];
  label: string;
  className?: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  onSelect: (option: SelectOption) => void;
  required?: boolean;
  value?: string;
}
interface SelectState {
  expanded: boolean;
  activeIndex?: number;
  selectedIndex?: number;
}
export default class Select extends React.Component<SelectProps, SelectState> {
  private listId;
  private labelId;
  private buttonId;
  private optionIdMap;
  private select;
  private listbox;
  static defaultProps: {
    className: string;
    required: boolean;
    onKeyDown: () => void;
    onSelect: () => void;
    value: null;
  };
  static propTypes: {
    options: any;
    label: PropTypes.Validator<string>;
    className: PropTypes.Requireable<string>;
    onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
    required: PropTypes.Requireable<boolean>;
    onSelect: PropTypes.Requireable<(...args: any[]) => any>;
    value: PropTypes.Requireable<string>;
  };
  state: SelectState;
  constructor(props: SelectProps);
  componentDidMount(): void;
  componentDidUpdate(prevProps: SelectProps): void;
  private updateValue;
  render(): JSX.Element;
  findAdjacentEnabledOption(dir: string): number | undefined;
  onTriggerKeydown(e: React.KeyboardEvent<HTMLElement>): void;
  onKeyDown(e: React.KeyboardEvent<HTMLElement>): void;
  onClick(): void;
  onClose(): void;
  focusSelect(): void;
}
export {};
