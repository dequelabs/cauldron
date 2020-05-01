import React from 'react';
import PropTypes from 'prop-types';
export interface FirstTimePointOutProps {
  arrowPosition:
    | 'top-left'
    | 'top-middle'
    | 'top-right'
    | 'right-top'
    | 'right-middle'
    | 'right-bottom'
    | 'bottom-right'
    | 'bottom-middle'
    | 'bottom-left'
    | 'left-bottom'
    | 'left-middle'
    | 'left-top';
  heading?: React.ReactNode;
  className?: string;
  headerId: string;
  children: React.ReactNode;
  ftpoRef: React.Ref<HTMLDivElement>;
  noArrow?: boolean;
  onClose: () => void;
  dismissText?: string;
  target?: React.RefObject<HTMLElement> | HTMLElement;
  portal?: React.RefObject<HTMLElement> | HTMLElement;
}
interface FirstTimePointOutState {
  show: boolean;
  style: React.CSSProperties;
  headingId?: string;
  offscreenContentFocus?: boolean;
}
export default class FirstTimePointOut extends React.Component<
  FirstTimePointOutProps,
  FirstTimePointOutState
> {
  static defaultProps: {
    ftpoRef: () => void;
    noArrow: boolean;
    onClose: () => void;
    dismissText: string;
    arrowPosition: string;
  };
  static propTypes: {
    heading: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    ftpRef: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    noArrow: (
      props: FirstTimePointOutProps,
      propName:
        | 'className'
        | 'children'
        | 'onClose'
        | 'target'
        | 'heading'
        | 'dismissText'
        | 'arrowPosition'
        | 'headerId'
        | 'ftpoRef'
        | 'noArrow'
        | 'portal'
    ) => Error | undefined;
    arrowPosition: PropTypes.Requireable<string>;
    onClose: PropTypes.Requireable<(...args: any[]) => any>;
    dismissText: PropTypes.Requireable<string>;
    className: PropTypes.Requireable<string>;
    target: PropTypes.Requireable<
      | ((...args: any[]) => any)
      | PropTypes.InferProps<{
          current: PropTypes.Requireable<any>;
        }>
    >;
    portal: PropTypes.Requireable<any>;
  };
  private resizeDebounceId;
  private resizeDebounce;
  private offscreenRef;
  private offscreenContentRef;
  private visibleRef;
  constructor(props: FirstTimePointOutProps);
  getFocusableElements(root: HTMLElement | null): Element[];
  componentDidMount(): void;
  forceUpdate(): void;
  componentWillUnmount(): void;
  attachOffscreenListeners: () => void;
  handleOffscreenContentFocusIn: ({ target }: FocusEvent) => void;
  handleOffscreenContentFocusOut: ({ target }: FocusEvent) => void;
  handleOffscreenFocusIn: ({ target }: FocusEvent) => void;
  handleOffscreenFocusOut: ({ target }: FocusEvent) => void;
  positionRelativeToTarget: () => void;
  componentDidUpdate(nextProps: FirstTimePointOutProps): void;
  render(): JSX.Element | null;
  onCloseClick(): void;
}
export {};
