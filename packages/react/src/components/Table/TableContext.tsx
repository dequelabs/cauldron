import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback
} from 'react';
import type { Column } from './Table';

type TableContext = {
  layout: 'table' | 'grid';
  columns: Array<Column>;
  sortAnnouncement: string;
  setSortAnnouncement: (announcement: string) => void;
};

type TableProvider = {
  children: React.ReactNode;
  layout: 'table' | 'grid';
  columns: Array<Column>;
};

const TableContext = createContext<TableContext>({
  layout: 'table',
  columns: [],
  sortAnnouncement: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSortAnnouncement: () => {}
});

function TableProvider({
  children,
  layout,
  columns
}: TableProvider): JSX.Element {
  const { Provider } = TableContext as React.Context<TableContext>;
  const [sortAnnouncement, setSortAnnouncement] = useState('');
  const stableSetter = useCallback(
    (announcement: string) => setSortAnnouncement(announcement),
    []
  );
  const contextValue: TableContext = useMemo(
    () => ({
      layout,
      columns,
      sortAnnouncement,
      setSortAnnouncement: stableSetter
    }),
    [layout, columns, sortAnnouncement, stableSetter]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useTable(): TableContext {
  return useContext(TableContext);
}

export { TableProvider, useTable };
