import React, {
  forwardRef,
  useState,
  cloneElement,
  isValidElement,
  useRef,
  useLayoutEffect,
  useEffect
} from 'react';
import { useId } from 'react-id-generator';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import { ColumnLeft, ColumnRight } from './';
import classnames from 'classnames';

interface TwoColumnPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  initialCollapsed?: boolean;
  showCollapsedPanelLabel?: string;
  hideCollapsedPanelLabel?: string;
}

const TwoColumnPanel = forwardRef<HTMLDivElement, TwoColumnPanelProps>(
  (
    {
      className,
      children,
      collapsed = false,
      initialCollapsed = false,
      showCollapsedPanelLabel = 'Show Panel',
      hideCollapsedPanelLabel = 'Hide Panel',
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setCollapsed] = useState(initialCollapsed);
    const [showPanel, setShowPanel] = useState(!initialCollapsed);
    const togglePanel = () => {
      if (isCollapsed) {
        setShowPanel(true);
      }
      // Set collapsed state on next tick so css transitions can be applied
      requestAnimationFrame(() => {
        setCollapsed(!isCollapsed);
      });
    };
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const columnLeftRef = useRef<HTMLDivElement>(null);
    const columnRightRef = useRef<HTMLDivElement>(null);

    const columnLeft = React.Children.toArray(children).find(
      child => (child as React.ReactElement<any>).type === ColumnLeft
    );

    let ColumnLeftComponent;
    if (isValidElement(columnLeft)) {
      const ref = columnLeft.props.ref || columnLeftRef;
      const CloseButton = (
        <div className="TwoColumnPanel__Close">
          <button
            type="button"
            onClick={togglePanel}
            ref={closeButtonRef}
            aria-label={hideCollapsedPanelLabel}
          >
            <Icon type="close" />
          </button>
          <Tooltip target={closeButtonRef} association="aria-labelledby">
            {hideCollapsedPanelLabel}
          </Tooltip>
        </div>
      );
      const children = [
        CloseButton,
        ...React.Children.toArray(columnLeft.props.children)
      ];
      ColumnLeftComponent = cloneElement(
        columnLeft,
        { ref, tabIndex: -1 },
        children
      );
    }

    const columnRight = React.Children.toArray(children).find(
      child => (child as React.ReactElement<any>).type === ColumnRight
    );

    let ColumnRightComponent;
    if (isValidElement(columnRight)) {
      const ref = columnRight.props.ref || columnRightRef;
      const id = columnRight.props.id || useId();
      const ToggleButton = (
        <div className="TwoColumnPanel__ButtonToggle">
          <button
            type="button"
            onClick={togglePanel}
            ref={toggleButtonRef}
            aria-label={
              !isCollapsed ? hideCollapsedPanelLabel : showCollapsedPanelLabel
            }
            aria-expanded={!isCollapsed}
            aria-controls={id}
          >
            <Icon
              type={
                !isCollapsed ? 'chevron-double-left' : 'chevron-double-right'
              }
            />
          </button>
          <Tooltip target={toggleButtonRef} association="aria-labelledby">
            {!isCollapsed ? hideCollapsedPanelLabel : showCollapsedPanelLabel}
          </Tooltip>
        </div>
      );
      const children = [
        ToggleButton,
        ...React.Children.toArray(columnRight.props.children)
      ];
      ColumnRightComponent = cloneElement(
        columnRight,
        { id, ref, tabIndex: -1 },
        children
      );
    }

    useLayoutEffect(() => {
      const handleTransitionEnd = () => {
        if (columnLeftRef.current && isCollapsed) {
          setShowPanel(false);
        }
      };

      columnLeftRef.current?.addEventListener(
        'transitionend',
        handleTransitionEnd
      );

      return () => {
        columnLeftRef.current?.removeEventListener(
          'transitionend',
          handleTransitionEnd
        );
      };
    }, [columnLeftRef.current, isCollapsed]);

    useEffect(() => {
      if (!isCollapsed) {
        columnLeftRef.current?.focus();
      } else {
        columnRightRef.current?.focus();
      }
    }, [isCollapsed]);

    return (
      <div
        className={classnames('TwoColumnPanel', className, {
          'TwoColumnPanel--show': !isCollapsed,
          'TwoColumnPanel--hide': isCollapsed
        })}
        {...props}
        ref={ref}
      >
        {showPanel ? ColumnLeftComponent : null}
        {ColumnRightComponent}
      </div>
    );
  }
);

TwoColumnPanel.displayName = 'TwoColumnPanel';

export default TwoColumnPanel;
