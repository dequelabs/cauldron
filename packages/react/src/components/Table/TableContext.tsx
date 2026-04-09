import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef
} from 'react';
import type { Column } from './Table';

type TableContext = {
  layout: 'table' | 'grid';
  columns: Array<Column>;
};

type TableProvider = {
  children: React.ReactNode;
  layout: 'table' | 'grid';
  columns: Array<Column>;
};

const TableContext = createContext<TableContext>({
  layout: 'table',
  columns: []
});

function TableProvider({
  children,
  layout,
  columns
}: TableProvider): JSX.Element {
  const { Provider } = TableContext as React.Context<TableContext>;
  const contextValue: TableContext = useMemo(
    () => ({
      layout,
      columns
    }),
    [layout, columns]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useTable(): TableContext {
  return useContext(TableContext);
}

export { TableProvider, useTable };
