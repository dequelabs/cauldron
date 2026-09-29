export interface TreeViewNode {
  id: string;
  textValue: string;
  /** When true, the node is rendered disabled and cannot be selected. Disabled
   *  nodes are skipped by cascading selection. */
  disabled?: boolean;
  children?: TreeViewNode[];
}
