import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyname from 'keyname';
import rndid from '../../utils/rndid';
import { search, shouldSearch } from './utils';

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
  private listId: string;
  private labelId: string;
  private buttonId: string;
  private optionIdMap: WeakMap<SelectOption, string>;
  private select: HTMLButtonElement | null;
  private listbox: HTMLUListElement | null;

  static defaultProps = {
    className: '',
    required: false,
    onKeyDown: () => {},
    onSelect: () => {},
    value: null
  };

  static propTypes = {
    // ensure options is an array of objects with at least a "value" property
    options: PropTypes.arrayOf(
      // @ts-ignore
      // I'm not sure what types the validator needs, and these types aren't really used by ts anyway
      (
        options: SelectOption[],
        key: number,
        componentName: string,
        location: string,
        propFullName: string
      ) => {
        const option = options[key];
        if (!option.value) {
          return new Error(
            `Invalid prop ${propFullName} supplied to ${componentName}`
          );
        }
      }
    ).isRequired,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    onKeyDown: PropTypes.func,
    required: PropTypes.bool,
    onSelect: PropTypes.func,
    value: PropTypes.string
  };

  state: SelectState = { expanded: false };

  constructor(props: SelectProps) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.focusSelect = this.focusSelect.bind(this);
    this.onTriggerKeydown = this.onTriggerKeydown.bind(this);
    this.listId = rndid();
    this.labelId = rndid();
    this.buttonId = rndid();
    this.optionIdMap = new WeakMap();
  }

  componentDidMount() {
    const { value, options } = this.props;

    if (!value) {
      return;
    }

    this.updateValue(options, value);
  }

  componentDidUpdate(prevProps: SelectProps) {
    const { value, options, onSelect } = this.props;

    if (value !== prevProps.value) {
      this.updateValue(options, value, onSelect);
    }
  }

  private updateValue(
    options: SelectProps['options'],
    value: SelectProps['value'],
    onSelect?: SelectProps['onSelect']
  ) {
    const activeIndex = options.findIndex(o => o.value === value);

    if (activeIndex === -1) {
      return;
    }

    this.setState({
      activeIndex,
      selectedIndex: activeIndex
    });

    if (onSelect) {
      onSelect(options[activeIndex]);
    }
  }

  render() {
    const { listId, labelId, buttonId } = this;
    const { expanded, activeIndex, selectedIndex } = this.state;
    const {
      className,
      label,
      required,
      options,
      onSelect,
      ...other
    } = this.props;
    const hasActiveOption = typeof activeIndex !== 'undefined';
    const active = options[activeIndex || 0];
    const pseudoVal =
      hasActiveOption && active && (active.label || active.value);

    const opts = options.map((option, i) => {
      const { value, label, disabled } = option;

      if (!this.optionIdMap.has(option)) {
        this.optionIdMap.set(option, rndid());
      }

      const id = this.optionIdMap.get(option);
      // we don't need key events here because focus stays on the combobox element
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      return (
        <li
          key={id}
          className={classNames('dqpl-option', {
            'dqpl-option-active': hasActiveOption ? activeIndex === i : i === 0,
            'dqpl-option-selected': selectedIndex === i
          })}
          role="option"
          aria-selected={hasActiveOption && activeIndex === i}
          aria-disabled={disabled}
          id={id}
          onClick={() => {
            if (disabled) {
              return;
            }
            this.setState({
              activeIndex: i,
              selectedIndex: i,
              expanded: false
            });
            onSelect(option);
            this.focusSelect();
          }}
        >
          {label || value}
        </li>
      );
    });
    // to make the "dqpl-label" div behave like a native label,
    // here we add a click listener which focuses the combobox
    /* eslint-disable jsx-a11y/no-static-element-interactions */

    // aria-activedescendant-has-tabindex is an invalid rule. Here we are simply following the spec/APG
    // in which the working example has tabIndex="-1" on the list
    // (see https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)
    /* eslint-disable jsx-a11y/aria-activedescendant-has-tabindex */
    return (
      <div className="dqpl-field-wrap">
        <div className="dqpl-label" id={labelId} onClick={this.focusSelect}>
          {label}
        </div>
        <div className="dqpl-select">
          <button
            {...other}
            aria-haspopup="listbox"
            className={classNames('dqpl-listbox-button', className)}
            id={buttonId}
            aria-labelledby={`${labelId} ${buttonId}`}
            aria-expanded={expanded}
            onClick={this.onClick}
            ref={select => (this.select = select)}
            onKeyDown={this.onTriggerKeydown}
            type="button"
          >
            {pseudoVal}
          </button>
          <ul
            id={listId}
            aria-labelledby={buttonId}
            tabIndex={-1}
            aria-required={required}
            className={classNames('dqpl-listbox', {
              'dqpl-listbox-show': expanded
            })}
            role="listbox"
            aria-activedescendant={
              // @ts-ignore activeIndex should never be undefined due to 'hasActiveOption'
              hasActiveOption ? this.optionIdMap.get(options[activeIndex]) : ''
            }
            onKeyDown={this.onKeyDown}
            ref={listbox => (this.listbox = listbox)}
          >
            {opts}
          </ul>
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events jsx-a11y/no-static-element-interactions */
  }

  findAdjacentEnabledOption(dir: string) {
    const { options } = this.props;
    const { activeIndex = 0 } = this.state;
    const d = dir === 'up' ? -1 : 1;
    let adjacentIndex,
      i = activeIndex + d;

    while (options[i] && typeof adjacentIndex === 'undefined') {
      if (!options[i].disabled) {
        adjacentIndex = i;
      }

      i += d;
    }

    return adjacentIndex;
  }

  onTriggerKeydown(e: React.KeyboardEvent<HTMLElement>) {
    if (keyname(e.which) !== 'down') {
      return;
    }

    e.preventDefault();
    this.onClick();
  }

  onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const { options } = this.props;
    const { expanded, activeIndex } = this.state;
    const { onSelect } = this.props;
    const { which } = e;
    const key = keyname(which);

    switch (key) {
      case 'down': {
        e.preventDefault();
        const prev = expanded && this.findAdjacentEnabledOption('down');

        if (typeof prev !== 'undefined') {
          this.setState({
            activeIndex: prev as number
          });
        }

        break;
      }

      case 'up': {
        if (!expanded) {
          return;
        }
        e.preventDefault();
        const next = this.findAdjacentEnabledOption('up');

        if (typeof next !== 'undefined') {
          this.setState({
            activeIndex: next
          });
        }

        break;
      }

      case 'esc':
      case 'tab':
        this.onClose();
        break;

      case 'enter':
      case 'space':
        e.preventDefault();

        this.setState({
          selectedIndex: activeIndex,
          expanded: false
        });
        onSelect(options[activeIndex as number]);
        this.focusSelect();

        break;

      default:
        // for letters/numbers, jump to the first matching option (like native <select />s)
        if (expanded && shouldSearch(which)) {
          const jumpTo = search(key, options);

          if (jumpTo >= 0 && jumpTo !== activeIndex) {
            this.setState({ activeIndex: jumpTo });
          }
        }
    }

    this.props.onKeyDown(e);
  }

  onClick() {
    this.setState(
      {
        expanded: !this.state.expanded
      },
      () => {
        if (!this.state.expanded) {
          return;
        }

        this.listbox?.focus();
      }
    );
  }

  onClose() {
    this.setState({
      expanded: false,
      activeIndex: this.state.selectedIndex
    });

    this.focusSelect();
  }

  focusSelect() {
    this.select?.focus();
  }
}
