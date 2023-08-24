import React, {
  forwardRef,
  useCallback,
  useState,
  useLayoutEffect,
  useEffect
} from 'react';
import { ListboxProvider } from './ListboxContext';
import type { ListboxOption } from './ListboxContext';
import type { ListboxValue } from './ListboxOption';
import useSharedRef from '../../utils/useSharedRef';

const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '];

interface ListboxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  as?: React.ElementType | string;
  value?: ListboxValue;
  navigation?: 'cycle' | 'bound';
  onSelectionChange?: <T extends HTMLElement = HTMLElement>({
    value
  }: {
    target: T;
    previousValue: ListboxValue;
    value: ListboxValue;
  }) => void;
  onActiveChange?: (option: ListboxOption) => void;
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
      onSelectionChange,
      onActiveChange,
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
      if (!isControlled && selectedOption) {
        return;
      }

      const listboxValue = isControlled ? value : defaultValue;
      const matchingOption = options.find((option) =>
        optionMatchesValue(option, listboxValue)
      );

      setSelectedOption(matchingOption || null);
      setActiveOption(matchingOption || null);
    }, [isControlled, options, value]);

    useEffect(() => {
      if (activeOption) {
        onActiveChange?.(activeOption);
      }
    }, [activeOption]);

    const handleSelect = useCallback(
      (option: ListboxOption) => {
        setActiveOption(option);
        // istanbul ignore else
        if (!isControlled) {
          setSelectedOption(option);
        }
        onSelectionChange?.({
          target: option.element,
          value: option.value,
          previousValue: selectedOption?.value
        });
      },
      [isControlled, selectedOption]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);

        if (!keys.includes(event.key)) {
          return;
        }

        event.preventDefault();
        const enabledOptions = options.filter(
          (option) => !isDisabledOption(option)
        );

        // istanbul ignore next
        if (!enabledOptions.length) {
          return;
        }

        const [up, down, home, end, enter, space] = keys;
        const firstOption = enabledOptions[0];

        if (!activeOption) {
          setActiveOption(firstOption);
          return;
        }

        const lastOption = enabledOptions[enabledOptions.length - 1];
        const currentOption = activeOption;
        const currentIndex = enabledOptions.findIndex(
          ({ element }) => element === currentOption.element
        );
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
        if (!activeOption && !selectedOption) {
          const firstOption = options.find(
            (option) => !isDisabledOption(option)
          );
          // istanbul ignore else
          if (firstOption) {
            setActiveOption(firstOption);
          }
          // istanbul ignore else
        } else if (event.target === listboxRef.current) {
          setActiveOption(selectedOption);
        }

        onFocus?.(event);
      },
      [options, activeOption, selectedOption]
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
