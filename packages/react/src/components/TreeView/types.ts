export type TreeViewSelectionStrategy = 'independent' | 'cascade' | 'exclusive';

export interface TreeViewNode {
  id: string;
  textValue: string;
  /**
   * When true, the node cannot be selected (rendered disabled). Locked nodes are
   * left untouched by parent/child selection in `cascade` / `exclusive` modes.
   */
  locked?: boolean;
  children?: TreeViewNode[];
}
