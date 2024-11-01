import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef
} from 'react';
import { Column, ColumnAlignment, ColumnWidth } from './Table';

type TableContext = {
  columns: Array<Column>;
  registerColumn: (element: HTMLElement, column: Column) => void;
  unregisterColumn: (element: HTMLElement) => void;
};

type TableProvider = {
  children: React.ReactNode;
  columns: Array<Column>;
  setColumns: React.Dispatch<React.SetStateAction<Array<Column>>>;
};

const TableContext = createContext<TableContext>({
  columns: [],
  registerColumn: () => null,
  unregisterColumn: () => null
});

function TableProvider({
  children,
  columns,
  setColumns
}: TableProvider): JSX.Element {
  const { Provider } = TableContext as React.Context<TableContext>;
  const elementCollection = new Map<HTMLElement, Column>();

  const registerColumn = useMemo(() => {
    return (element: HTMLElement, column: Column) => {
      const parentTable = element.closest('table');
      if (!parentTable) {
        // if element is rendered outside of a table, there's nothing we can do
        return;
      }

      if (element.getAttribute('scope') !== 'col') {
        // if element is not part of a scope column, do not register it
        return;
      }

      elementCollection.set(element, column);
      setColumns(Array.from(elementCollection.values()));
    };
  }, []);

  const unregisterColumn = useMemo(() => {
    return (element: HTMLElement) => {
      elementCollection.delete(element);
      setColumns(Array.from(elementCollection.values()));
    };
  }, []);

  const contextValue: TableContext = useMemo(
    () => ({
      columns,
      registerColumn,
      unregisterColumn
    }),
    [columns, registerColumn, unregisterColumn]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useTableLayout(): TableContext {
  return useContext(TableContext);
}

export { TableProvider, useTableLayout };
