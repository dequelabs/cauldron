import React from 'react';
import PropTypes from 'prop-types';
export interface WorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
  workspaceRef: React.Ref<HTMLDivElement>;
  layoutRef: React.Ref<HTMLDivElement>;
  noSideBar: boolean;
}
export default class Workspace extends React.Component<WorkspaceProps> {
  static defaultProps: {
    workspaceRef: () => void;
    layoutRef: () => void;
    noSideBar: boolean;
  };
  static propTypes: {
    children: PropTypes.Validator<string | object>;
    workspaceRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    layoutRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    noSideBar: PropTypes.Requireable<boolean>;
  };
  componentDidMount(): void;
  componentDidUpdate(prevProps: WorkspaceProps): void;
  componentWillUnmount(): void;
  render(): JSX.Element;
}
