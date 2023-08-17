import React, {
  forwardRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import { ListboxProvider, type ListboxOption } from './ListboxContext';
import type { ListboxValue } from './ListboxOption';
import useSharedRef from '../../utils/useSharedRef';

const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '];

interface ListboxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  as?: React.ElementType | string;
  value?: ListboxValue;
  navigation?: 'cycle' | 'bound';
  onSelect?: <T extends HTMLElement = HTMLElement>({
    target,
    value,
  }: {
    target: T;
    value: ListboxValue;
  }) => void;
  onSelectionChange?: ({
    value,
  }: {
    previousValue: ListboxValue;
    value: ListboxValue;
  }) => void;
}

// id for listbox options should always be defined since it should
// be provide via the author, or auto-generated via the component
const getOptionId = (option: ListboxOption): string =>
  option.element.getAttribute('id') as string;

const isDisabledOption = (option: ListboxOption): boolean =>
  option.element.getAttribute('aria-disabled') === 'true';

const optionMatchesValue = (option: ListboxOption, value: unknown): boolean =>
  typeof option.value !== null &&
  typeof option.value !== 'undefined' &&
  option.value === value;

const Listbox = forwardRef<HTMLElement, ListboxProps>(
  (
    {
      as: Component = 'ul',
      children,
      defaultValue,
      value,
      navigation = 'bound',
      onKeyDown,
      onFocus,
      onSelect,
      onSelectionChange,
      ...props
    },
    ref
  ): JSX.Element => {
    const [options, setOptions] = useState<ListboxOption[]>([]);
    const [activeOption, setActiveOption] = useState<ListboxOption | null>(
      null
    );
    const [selectedOption, setSelectedOption] = useState<ListboxOption | null>(
      null
    );
    const listboxRef = useSharedRef<HTMLElement>(ref);
    const isControlled = typeof value !== 'undefined';

    useLayoutEffect(() => {
      const listboxValue = isControlled ? value : defaultValue;
      const selectedOption = options.find((option) =>
        optionMatchesValue(option, listboxValue)
      );
      if (selectedOption) {
        setSelectedOption(selectedOption);
      }
    }, [options]);

    const handleSelect = useCallback(
      (option: ListboxOption) => {
        setActiveOption(option);
        onSelect?.({ target: option.element, value: option.value as string });
        if (!isControlled) {
          setSelectedOption(option);
          onSelectionChange?.({
            value: option.value,
            previousValue: selectedOption?.value,
          });
        }
      },
      [isControlled]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);

        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const enabledOptions = options.filter(
          (option) => !isDisabledOption(option)
        );

        if (!enabledOptions.length) return;

        const [up, down, home, end, enter, space] = keys;
        const firstOption = enabledOptions[0];
        const lastOption = enabledOptions[options.length - 1];
        const currentOption = activeOption || firstOption;
        const currentIndex = enabledOptions.indexOf(currentOption);
        const allowCyclicalNavigation = navigation === 'cycle';

        switch (event.key) {
          case up:
            const previousOption =
              currentIndex === 0 && allowCyclicalNavigation
                ? lastOption
                : enabledOptions[Math.max(currentIndex - 1, 0)];
            setActiveOption(previousOption);
            break;
          case down:
            const nextOption =
              currentIndex === enabledOptions.length - 1 &&
              allowCyclicalNavigation
                ? firstOption
                : enabledOptions[
                    Math.min(currentIndex + 1, enabledOptions.length - 1)
                  ];
            setActiveOption(nextOption);
            break;
          case home:
            setActiveOption(firstOption);
            break;
          case end:
            setActiveOption(lastOption);
            break;
          case enter:
          case space:
            activeOption && handleSelect(activeOption);
            break;
        }
      },
      [options, activeOption, navigation]
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLElement>) => {
        if (!activeOption) {
          const firstOption = options.find(
            (option) => !isDisabledOption(option)
          );
          if (firstOption) {
            setActiveOption(firstOption);
            firstOption.element.focus();
          }
        } else if (event.target === listboxRef.current) {
          activeOption.element.focus();
        }

        onFocus?.(event);
      },
      [options, activeOption]
    );

    return (
      <Component
        role="listbox"
        ref={listboxRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        aria-activedescendant={
          activeOption ? getOptionId(activeOption) : undefined
        }
        {...props}
      >
        <ListboxProvider
          options={options}
          active={activeOption}
          selected={selectedOption}
          setOptions={setOptions}
          onSelect={handleSelect}
        >
          {children}
        </ListboxProvider>
      </Component>
    );
  }
);

Listbox.displayName = 'Listbox';

export default Listbox;
