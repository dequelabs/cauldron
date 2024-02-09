import React from 'react';
import Main from '../Main';
import Layout from '../Layout';

export interface WorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
  workspaceRef: React.Ref<HTMLDivElement>;
  layoutRef: React.Ref<HTMLDivElement>;
  noSideBar: boolean;
}

export default class Workspace extends React.Component<WorkspaceProps> {
  static defaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    workspaceRef: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    layoutRef: () => {},
    noSideBar: false
  };

  componentDidMount() {
    document.body.classList.toggle('Page--no-sidebar', this.props.noSideBar);
  }

  componentDidUpdate(prevProps: WorkspaceProps) {
    if (prevProps.noSideBar === this.props.noSideBar) {
      return;
    }

    document.body.classList.toggle('Page--no-sidebar', this.props.noSideBar);
  }

  componentWillUnmount() {
    document.body.classList.remove('Page--no-sidebar');
  }

  render() {
    const {
      // defining `noSideBar` to prevent it from being passed through to Main
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      noSideBar,
      children,
      workspaceRef,
      layoutRef,
      ...other
    } = this.props;

    return (
      <Layout layoutRef={layoutRef}>
        <Main mainRef={workspaceRef} {...other}>
          {children}
        </Main>
      </Layout>
    );
  }
}
