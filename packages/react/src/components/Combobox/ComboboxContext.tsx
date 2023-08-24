import React, { createContext, useContext, useMemo } from 'react';
import { ComboboxValue } from './ComboboxItem';

type ComboboxContext = {
  inputValue: string | undefined;
  selectedValue: string | undefined;
  matches:
    | (<T extends string = string>(value: T | undefined) => boolean)
    | boolean;
};

type ComboboxProvider<T extends string = string> = {
  children: React.ReactNode;
  matches: ((inputValue: string, value: T | undefined) => boolean) | boolean;
} & Omit<ComboboxContext, 'matches'>;

/* istanbul ignore next */
const ComboboxContext = createContext<ComboboxContext>({
  inputValue: undefined,
  selectedValue: undefined,
  matches: true
});

function ComboboxProvider({
  inputValue,
  selectedValue,
  matches,
  children
}: ComboboxProvider): JSX.Element {
  const { Provider } = ComboboxContext as React.Context<ComboboxContext>;
  const contextValue: ComboboxContext = useMemo(
    () => ({
      inputValue,
      selectedValue,
      matches:
        typeof matches === 'function' && !!inputValue
          ? (value) => matches(inputValue, value)
          : true
    }),
    [inputValue, selectedValue, matches]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useComboboxContext(): ComboboxContext {
  return useContext(ComboboxContext);
}

export { ComboboxProvider, useComboboxContext };
