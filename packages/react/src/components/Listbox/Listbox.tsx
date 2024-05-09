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

interface ListboxProps
  extends PolymorphicProps<
    Omit<React.HTMLAttributes<HTMLElement>, 'defaultValue' | 'onSelect'>
  > {
  value?: ListboxValue | ListboxValue[];
  defaultValue?: ListboxValue | ListboxValue[];
  multiselect?: boolean;
  navigation?: 'cycle' | 'bound';
  onActiveChange?: (option: ListboxOption) => void;
  onSelectionChange?: <T extends HTMLElement = HTMLElement>(selection: {
    target: T;
    previousValue: ListboxValue | ListboxValue[];
    value: ListboxValue | ListboxValue[];
  }) => void;
}

// id for listbox options should always be defined since it should
// be provide via the author, or auto-generated via the component
const getOptionId = (option: ListboxOption): string =>
  option.element?.getAttribute('id') as string;

const isDisabledOption = (option: ListboxOption): boolean =>
  option.element?.getAttribute('aria-disabled') === 'true';

const optionMatchesValue = (option: ListboxOption, value: unknown): boolean =>
  typeof option.value !== null &&
  typeof option.value !== 'undefined' &&
  Array.isArray(value)
    ? value.includes(option.value)
    : option.value === value;

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
      multiselect = false,
      ...props
    },
    ref
  ): JSX.Element => {
    const [options, setOptions] = useState<ListboxOption[]>([]);
    const [activeOption, setActiveOption] = useState<ListboxOption | null>(
      null
    );
    const [selectedOptions, setSelectedOptions] = useState<
      ListboxOption | ListboxOption[] | null
    >(null);
    const listboxRef = useSharedRef<HTMLElement>(ref);
    const isControlled = typeof value !== 'undefined';

    useLayoutEffect(() => {
      if (!isControlled && selectedOptions) {
        return;
      }

      const listboxValue = isControlled ? value : defaultValue;
      if (!multiselect) {
        const matchingOption = options.find((option) =>
          optionMatchesValue(option, listboxValue)
        );
        setSelectedOptions(matchingOption || null);
        setActiveOption(matchingOption || null);
      } else {
        const selected = (listboxValue as ListboxValue[] | undefined)?.map(
          (val) => {
            const option = options.find((opt) => optionMatchesValue(opt, val));

            if (option) {
              return option;
            }

            return {
              element: undefined,
              value: val
            };
          }
        );

        setSelectedOptions(selected || null);
      }
    }, [isControlled, multiselect, options, value, defaultValue]);

    useEffect(() => {
      if (activeOption) {
        onActiveChange?.(activeOption);
      }
    }, [activeOption]);

    const handleSelect = useCallback(
      (option: ListboxOption) => {
        setActiveOption(option);

        if (!multiselect) {
          const selected = selectedOptions as ListboxOption | null;
          // istanbul ignore else
          if (!isControlled) {
            setSelectedOptions(option);
          }

          onSelectionChange?.({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            target: option.element!,
            value: option.value,
            previousValue: selected?.value
          });
        } else {
          const selected = (selectedOptions as ListboxOption[] | null) || [];
          const optionIndex = selected.findIndex((opt) =>
            optionMatchesValue(opt, option.value)
          );
          let newOptions = [];

          if (optionIndex === -1) {
            newOptions = [...selected, option];
          } else {
            newOptions = selected.filter(
              (opt) => !optionMatchesValue(opt, option.value)
            );
          }

          if (!isControlled) {
            setSelectedOptions(newOptions);
          }

          const newValues = newOptions.map((opt) => opt.value);
          const previousValues = selected.map((opt) => opt.value);

          onSelectionChange?.({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            target: option.element!,
            value: newValues,
            previousValue: previousValues
          });
        }
      },
      [value, selectedOptions, setActiveOption, setSelectedOptions]
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
      [options, activeOption, navigation, setActiveOption, handleSelect]
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLElement>) => {
        if (!activeOption && !selectedOptions) {
          const firstOption = options.find(
            (option) => !isDisabledOption(option)
          );
          if (firstOption) {
            setActiveOption(firstOption);
          }
        } else if (event.target === listboxRef.current) {
          setActiveOption(
            !multiselect
              ? (selectedOptions as ListboxOption[])[0]
              : (selectedOptions as ListboxOption)
          );
        }

        onFocus?.(event);
      },
      [options, activeOption, selectedOptions]
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
        aria-multiselectable={multiselect}
        {...props}
      >
        <ListboxProvider
          options={options}
          active={activeOption}
          selected={selectedOptions}
          multiselect={multiselect}
          setOptions={setOptions}
          onSelect={handleSelect}
        >
          {children}
        </ListboxProvider>
      </Component>
    );
  }
) as PolymorphicComponent<ListboxProps>;

Listbox.displayName = 'Listbox';

export default Listbox;
