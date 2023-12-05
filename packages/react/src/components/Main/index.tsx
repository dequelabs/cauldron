import React, { Component } from 'react';

export interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  mainRef?: React.Ref<HTMLDivElement>;
}

export default class Main extends Component<MainProps> {
  static defaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mainRef: () => {}
  };

  render() {
    const { mainRef, children, ...other } = this.props;
    return (
      <main className="Main" ref={mainRef} {...other}>
        {children}
      </main>
    );
  }
}
