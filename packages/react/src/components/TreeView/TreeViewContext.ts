import { createContext } from 'react';
import { type Key } from 'react-aria-components';

export interface TreeViewContextValue {
  /** Keys of parent nodes that are partially (not fully) selected. */
  indeterminateKeys: Set<Key>;
}

const TreeViewContext = createContext<TreeViewContextValue>({
  indeterminateKeys: new Set<Key>()
});

export default TreeViewContext;
