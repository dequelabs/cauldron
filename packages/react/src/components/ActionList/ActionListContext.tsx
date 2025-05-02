import React, { createContext, useContext, useMemo } from 'react';

export type onActionEvent =
  | React.MouseEvent<HTMLLIElement | HTMLAnchorElement>
  | React.KeyboardEvent<HTMLLIElement | HTMLAnchorElement>;

export type onActionCallbackFunction = (
  key: string,
  event: onActionEvent
) => void;

export type ActionListSelectionType = 'single' | 'multiple';

type ActionListContext = {
  role: 'list' | 'menu' | 'listbox' | null;
  selectionType: ActionListSelectionType | null;
  onAction?: onActionCallbackFunction;
};

type ActionListProviderProps = {
  children: React.ReactNode;
} & ActionListContext;

/* istanbul ignore next */
const ActionListContext = createContext<ActionListContext>({
  role: null,
  selectionType: null,
  onAction: () => null
});

function ActionListProvider({
  role,
  selectionType,
  onAction,
  children
}: ActionListProviderProps): React.JSX.Element {
  const { Provider } = ActionListContext;
  const contextValue: ActionListContext = useMemo(
    () => ({
      role,
      selectionType,
      onAction
    }),
    [role, selectionType, onAction]
  );

  return <Provider value={contextValue}>{children}</Provider>;
}

function useActionListContext(): ActionListContext {
  return useContext(ActionListContext);
}

export { ActionListProvider, useActionListContext };
