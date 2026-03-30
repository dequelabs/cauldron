import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useCallback
} from 'react';
import type { Column } from './Table';

type TableContextValue = {
  layout: 'table' | 'grid';
  columns: Array<Column>;
};

type SortAnnouncementActions = {
  announce: (owner: object, text: string) => void;
  clear: (owner: object) => void;
};

type SortAnnouncementState = {
  text: string;
};

type TableProviderProps = {
  children: React.ReactNode;
  layout: 'table' | 'grid';
  columns: Array<Column>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const TableContext = createContext<TableContextValue>({
  layout: 'table',
  columns: []
});

// Separate context for sort announcement actions (stable references, never triggers re-renders)
const SortAnnouncementActionsContext = createContext<SortAnnouncementActions>({
  announce: noop,
  clear: noop
});

// Separate context for sort announcement state (only consumed by the portal)
const SortAnnouncementStateContext = createContext<SortAnnouncementState>({
  text: ''
});

function TableProvider({
  children,
  layout,
  columns
}: TableProviderProps): JSX.Element {
  const tableValue = useMemo(() => ({ layout, columns }), [layout, columns]);

  const ownerRef = useRef<object | null>(null);
  const [announcementText, setAnnouncementText] = useState('');

  const announce = useCallback((owner: object, text: string) => {
    ownerRef.current = owner;
    setAnnouncementText(text);
  }, []);

  const clear = useCallback((owner: object) => {
    if (ownerRef.current === owner) {
      ownerRef.current = null;
      setAnnouncementText('');
    }
  }, []);

  const actionsValue = useMemo(() => ({ announce, clear }), [announce, clear]);
  const stateValue = useMemo(
    () => ({ text: announcementText }),
    [announcementText]
  );

  return (
    <TableContext.Provider value={tableValue}>
      <SortAnnouncementActionsContext.Provider value={actionsValue}>
        <SortAnnouncementStateContext.Provider value={stateValue}>
          {children}
        </SortAnnouncementStateContext.Provider>
      </SortAnnouncementActionsContext.Provider>
    </TableContext.Provider>
  );
}

function useTable(): TableContextValue {
  return useContext(TableContext);
}

function useSortAnnouncementActions(): SortAnnouncementActions {
  return useContext(SortAnnouncementActionsContext);
}

function useSortAnnouncementState(): SortAnnouncementState {
  return useContext(SortAnnouncementStateContext);
}

export {
  TableProvider,
  useTable,
  useSortAnnouncementActions,
  useSortAnnouncementState
};
