import React, { createContext, useContext, useMemo } from 'react';

type UnknownElement<T> = T extends Element ? T : HTMLElement;
type UnknownValue<T> = T extends string ? T : number;
type ListboxOption<Element = HTMLElement, Value = string | number> = {
  element: UnknownElement<Element>;
  value?: UnknownValue<Value>;
};

type ListboxContext<T extends ListboxOption> = {
  options: T[];
  active: T | null;
  selected: T | null;
  setOptions: React.Dispatch<React.SetStateAction<T[]>>;
  onSelect: (option: T) => void;
};

type ListboxProvider<T extends ListboxOption> = {
  children: React.ReactNode;
} & ListboxContext<T>;

/* istanbul ignore next */
const ListboxContext = createContext({
  options: [],
  active: null,
  selected: null,
  setOptions: () => null,
  onSelect: () => null
});

function ListboxProvider<T extends ListboxOption>({
  options,
  active,
  selected,
  setOptions,
  onSelect,
  children
}: ListboxProvider<T>): JSX.Element {
  const { Provider } = ListboxContext as unknown as React.Context<
    ListboxContext<T>
  >;
  const value: ListboxContext<T> = useMemo(
    () => ({
      options,
      active,
      selected,
      setOptions,
      onSelect
    }),
    [options, active, selected, setOptions]
  );

  return <Provider value={value}>{children}</Provider>;
}

function useListboxContext<T extends ListboxOption>(): ListboxContext<T> {
  return useContext(ListboxContext);
}

export { ListboxProvider, useListboxContext, ListboxOption };
