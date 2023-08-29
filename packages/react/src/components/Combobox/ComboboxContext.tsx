import React, { createContext, useContext, useMemo } from 'react';
import { ComboboxValue } from './ComboboxOption';

type ComboboxContext = {
  autocomplete: 'none' | 'manual' | 'automatic';
  inputValue: ComboboxValue;
  selectedValue: ComboboxValue;
  matchingOptions: Map<HTMLElement, ComboboxOptionState>;
  setMatchingOptions: React.Dispatch<
    React.SetStateAction<Map<HTMLElement, ComboboxOptionState>>
  >;
  matches: (<T extends string = string>(value: T) => boolean) | boolean;
};

export type ComboboxOptionState = {
  selected: boolean;
  value: ComboboxValue;
};

type ComboboxProvider = {
  children: React.ReactNode;
  matches: ((inputValue: string, value: string) => boolean) | boolean;
} & Omit<ComboboxContext, 'matches'>;

/* istanbul ignore next */
const ComboboxContext = createContext<ComboboxContext>({
  autocomplete: 'manual',
  inputValue: undefined,
  selectedValue: undefined,
  matches: true,
  matchingOptions: new Map(),
  setMatchingOptions: () => null
});

function ComboboxProvider({
  autocomplete,
  inputValue,
  selectedValue,
  matches,
  matchingOptions,
  setMatchingOptions,
  children
}: ComboboxProvider): JSX.Element {
  const { Provider } = ComboboxContext as React.Context<ComboboxContext>;
  const contextValue: ComboboxContext = useMemo(
    () => ({
      autocomplete,
      inputValue,
      selectedValue,
      matches:
        typeof matches === 'function' && !!inputValue
          ? (value) => matches(inputValue, value)
          : true,
      matchingOptions,
      setMatchingOptions
    }),
    [
      autocomplete,
      inputValue,
      selectedValue,
      matches,
      matchingOptions,
      setMatchingOptions
    ]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useComboboxContext(): ComboboxContext {
  return useContext(ComboboxContext);
}

export { ComboboxProvider, useComboboxContext };
