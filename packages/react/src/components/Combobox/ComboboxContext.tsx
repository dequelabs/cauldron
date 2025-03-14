import React, { createContext, useContext, useMemo } from 'react';
import { ComboboxValue } from './ComboboxOption';

type ComboboxContext = {
  autocomplete: 'none' | 'manual' | 'automatic';
  inputValue: ComboboxValue;
  formValues: ComboboxValue[];
  selectedValues: ComboboxValue[];
  removeOptionLabels: string[];
  setRemoveOptionLabels: React.Dispatch<React.SetStateAction<string[]>>;
  matchingOptions: Map<HTMLElement, ComboboxOptionState>;
  setMatchingOptions: React.Dispatch<
    React.SetStateAction<Map<HTMLElement, ComboboxOptionState>>
  >;
  setFormValues: React.Dispatch<React.SetStateAction<ComboboxValue[]>>;
  matches: (<T extends string = string>(value: T) => boolean) | boolean;
};

export type ComboboxOptionState = {
  selected: boolean;
  value: ComboboxValue;
  displayValue: ComboboxValue;
};

type ComboboxProvider = {
  children: React.ReactNode;
  matches: ((inputValue: string, value: string) => boolean) | boolean;
} & Omit<ComboboxContext, 'matches'>;

/* istanbul ignore next */
const ComboboxContext = createContext<ComboboxContext>({
  autocomplete: 'manual',
  inputValue: undefined,
  formValues: [],
  selectedValues: [],
  removeOptionLabels: [],
  setRemoveOptionLabels: () => null,
  matches: true,
  matchingOptions: new Map(),
  setMatchingOptions: () => null,
  setFormValues: () => null
});

function ComboboxProvider({
  autocomplete,
  inputValue,
  formValues,
  selectedValues,
  removeOptionLabels,
  setRemoveOptionLabels,
  matches,
  matchingOptions,
  setMatchingOptions,
  setFormValues,
  children
}: ComboboxProvider): React.JSX.Element {
  const { Provider } = ComboboxContext as React.Context<ComboboxContext>;
  const contextValue: ComboboxContext = useMemo(
    () => ({
      autocomplete,
      inputValue,
      formValues,
      selectedValues,
      removeOptionLabels,
      setRemoveOptionLabels,
      matches:
        typeof matches === 'function' && !!inputValue
          ? (value) => matches(inputValue, value)
          : true,
      matchingOptions,
      setMatchingOptions,
      setFormValues
    }),
    [
      autocomplete,
      inputValue,
      formValues,
      selectedValues,
      removeOptionLabels,
      setRemoveOptionLabels,
      matches,
      matchingOptions,
      setMatchingOptions,
      setFormValues
    ]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useComboboxContext(): ComboboxContext {
  return useContext(ComboboxContext);
}

export { ComboboxProvider, useComboboxContext };
