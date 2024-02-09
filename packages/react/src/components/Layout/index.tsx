import React from 'react';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  layoutRef?: React.Ref<HTMLDivElement>;
}

export default class Layout extends React.Component<LayoutProps> {
  static defaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    layoutRef: () => {}
  };

  render() {
    const { layoutRef, children, ...other } = this.props;
    return (
      <div className="Layout" ref={layoutRef} {...other}>
        {children}
      </div>
    );
  }
}
