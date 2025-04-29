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
import type {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';
import useSharedRef from '../../utils/useSharedRef';

const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '];

interface BaseListboxProps
  extends PolymorphicProps<
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'defaultValue'>
  > {
  navigation?: 'cycle' | 'bound';
  focusStrategy?: 'lastSelected' | 'first' | 'last';
  focusDisabledOptions?: boolean;
  onActiveChange?: (option: ListboxOption) => void;
  disabled?: boolean;
}

interface SingleSelectListboxProps extends BaseListboxProps {
  multiselect?: false;
  value?: ListboxValue;
  defaultValue?: ListboxValue;
  onSelectionChange?: <T extends HTMLElement = HTMLElement>(props: {
    target: T;
    previousValue: ListboxValue;
    value: ListboxValue;
  }) => void;
}

interface MultiSelectListboxProps extends BaseListboxProps {
  multiselect: true;
  value?: ListboxValue[];
  defaultValue?: ListboxValue[];
  onSelectionChange?: <T extends HTMLElement = HTMLElement>(props: {
    target: T;
    previousValue: ListboxValue[];
    value: ListboxValue[];
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

const Listbox = forwardRef<
  HTMLElement,
  SingleSelectListboxProps | MultiSelectListboxProps
>(
  (
    {
      as: Component = 'ul',
      children,
      defaultValue,
      value,
      navigation = 'bound',
      focusStrategy = 'lastSelected',
      focusDisabledOptions = false,
      multiselect = false,
      onKeyDown,
      onFocus,
      onSelectionChange,
      onActiveChange,
      disabled = false,
      ...props
    },
    ref
  ): React.JSX.Element => {
    const [options, setOptions] = useState<ListboxOption[]>([]);
    const [activeOption, setActiveOption] = useState<ListboxOption | null>(
      null
    );
    const [selectedOptions, setSelectedOptions] = useState<ListboxOption[]>([]);
    const listboxRef = useSharedRef<HTMLElement>(ref);
    const isControlled = typeof value !== 'undefined';

    useLayoutEffect(() => {
      if (!isControlled && selectedOptions.length > 0) {
        return;
      }

      const listboxValue = isControlled ? value : defaultValue;
      if (!listboxValue) {
        return;
      }

      if (multiselect) {
        const matchingOptions = options.filter((option) =>
          (listboxValue as ListboxValue[]).find((value) =>
            optionMatchesValue(option, value)
          )
        );
        setSelectedOptions(matchingOptions);
        if (!activeOption) {
          setActiveOption(matchingOptions[0] || null);
        }
      } else {
        const matchingOption = options.find((option) =>
          optionMatchesValue(option, listboxValue)
        );
        setSelectedOptions(matchingOption ? [matchingOption] : []);
        if (!activeOption) {
          setActiveOption(matchingOption || null);
        }
      }
    }, [isControlled, options, value, defaultValue, activeOption]);

    useEffect(() => {
      if (activeOption) {
        onActiveChange?.(activeOption);
      }
    }, [activeOption]);

    const handleSelect = useCallback(
      (option: ListboxOption) => {
        setActiveOption(option);
        if (disabled) {
          return;
        }

        const optionIsSelected = selectedOptions.some(
          (selected) => selected.element === option.element
        );
        const previousValues = selectedOptions.map(
          (selected) => selected.value
        );

        // istanbul ignore else
        if (!isControlled) {
          if (!multiselect) {
            setSelectedOptions([option]);
          } else {
            setSelectedOptions(
              optionIsSelected
                ? [
                    ...selectedOptions.filter(
                      (selected) => selected.element !== option.element
                    )
                  ]
                : [...selectedOptions, option]
            );
          }
        }

        if (multiselect) {
          (onSelectionChange as MultiSelectListboxProps['onSelectionChange'])?.(
            {
              target: option.element,
              value: optionIsSelected
                ? selectedOptions
                    .filter(
                      (selectedOption) =>
                        selectedOption.element !== option.element
                    )
                    .map((selectedOption) => selectedOption.value)
                : [...previousValues, option.value],
              previousValue: previousValues
            }
          );
        } else {
          (
            onSelectionChange as SingleSelectListboxProps['onSelectionChange']
          )?.({
            target: option.element,
            value: option.value,
            previousValue: selectedOptions[0]?.value
          });
        }
      },
      [isControlled, selectedOptions, multiselect, onSelectionChange]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);

        if (!keys.includes(event.key)) {
          return;
        }

        event.preventDefault();
        const enabledOptions = !focusDisabledOptions
          ? options.filter((option) => !isDisabledOption(option))
          : options;

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
      [options, activeOption, navigation, handleSelect]
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLElement>) => {
        if (focusStrategy === 'first') {
          const firstOption = !focusDisabledOptions
            ? options.find((option) => !isDisabledOption(option))
            : options[0];

          if (firstOption) {
            setActiveOption(firstOption);
          }

          return;
        }

        if (focusStrategy === 'last') {
          const lastOption = !focusDisabledOptions
            ? [...options].reverse().find((option) => !isDisabledOption(option))
            : options[options.length - 1];

          if (lastOption) {
            setActiveOption(lastOption);
          }

          return;
        }

        if (
          !activeOption ||
          !options.some((option) => option.element === activeOption.element)
        ) {
          const firstOption = !focusDisabledOptions
            ? options.find((option) => !isDisabledOption(option))
            : options[0];
          // istanbul ignore else
          if (firstOption) {
            setActiveOption(firstOption);
          }
          // istanbul ignore else
        } else if (
          selectedOptions.length &&
          event.target === listboxRef.current
        ) {
          setActiveOption(selectedOptions[selectedOptions.length - 1]);
        }

        onFocus?.(event);
      },
      [options, activeOption, selectedOptions, focusStrategy]
    );

    return (
      <Component
        role="listbox"
        ref={listboxRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        aria-multiselectable={multiselect ? true : undefined}
        aria-activedescendant={
          activeOption ? getOptionId(activeOption) : undefined
        }
        {...props}
      >
        <ListboxProvider
          options={options}
          active={activeOption}
          multiselect={multiselect}
          selected={selectedOptions}
          setOptions={setOptions}
          onSelect={handleSelect}
        >
          {children}
        </ListboxProvider>
      </Component>
    );
  }
) as PolymorphicComponent<SingleSelectListboxProps | MultiSelectListboxProps>;

Listbox.displayName = 'Listbox';

export default Listbox;
