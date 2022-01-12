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
import FocusTrap from 'focus-trap-react';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import ClickOutsideListener from '../ClickOutsideListener';
import { ColumnLeft, ColumnRight } from './';
import classnames from 'classnames';

interface TwoColumnPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  initialCollapsed?: boolean;
  showCollapsedPanelLabel?: string;
  hideCollapsedPanelLabel?: string;
}

const TwoColumnPanel = forwardRef<HTMLDivElement, TwoColumnPanelProps>(
  (
    {
      className,
      children,
      initialCollapsed = false,
      showCollapsedPanelLabel = 'Show Panel',
      hideCollapsedPanelLabel = 'Hide Panel',
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setCollapsed] = useState(initialCollapsed);
    const [isFocusTrap, setIsFocusTrap] = useState(false);
    const [showPanel, setShowPanel] = useState(!initialCollapsed);
    const togglePanel = () => {
      if (isCollapsed) {
        setShowPanel(true);
      }
      // Set collapsed state on next tick so css transitions can be applied
      requestAnimationFrame(() => {
        const collapsed = !isCollapsed;
        setCollapsed(collapsed);
        if (!collapsed) {
          columnLeftRef.current?.focus();
        } else {
          columnRightRef.current?.focus();
        }
      });
    };
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const columnLeftRef = useRef<HTMLDivElement>(null);
    const columnRightRef = useRef<HTMLDivElement>(null);

    const columnLeft = React.Children.toArray(children).find(
      child => (child as React.ReactElement<any>).type === ColumnLeft
    );

    // The ColumnLeftComponent will end up being a focus trap when < 720px
    // This component also gets unmounted when not visible meaning that any
    // aria relationships cannot be set to items inside the component since
    // they will not be present in the dom
    let ColumnLeftComponent;
    let columnLeftId;
    if (isValidElement(columnLeft)) {
      const ref = columnLeft.props.ref || columnLeftRef;
      const id = (columnLeftId =
        columnLeft.props.id || useId(undefined, 'sidebar-'));
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
          <Tooltip
            target={closeButtonRef}
            association="aria-labelledby"
            hideElementOnHidden
          >
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
        { id, ref, tabIndex: -1 },
        children
      );
    }

    const columnRight = React.Children.toArray(children).find(
      child => (child as React.ReactElement<any>).type === ColumnRight
    );

    let ColumnRightComponent;
    if (isValidElement(columnRight)) {
      const ref = columnRight.props.ref || columnRightRef;
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
            aria-controls={columnLeftId}
          >
            <Icon
              type={
                !isCollapsed ? 'chevron-double-left' : 'chevron-double-right'
              }
            />
          </button>
          <Tooltip
            target={toggleButtonRef}
            association="aria-labelledby"
            hideElementOnHidden
          >
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
        { ref, tabIndex: -1 },
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

    // When the collapsable panel starts to overlay content, it needs to become a focus trap and collapsed by default
    useLayoutEffect(() => {
      const mediaQueryList = matchMedia('(max-width: 45rem)');
      const handleMatch = (matches: boolean) => {
        setIsFocusTrap(matches);
        const collapsed = matches ? true : isCollapsed;
        setCollapsed(collapsed);
        setShowPanel(!collapsed);
      };
      const listener = ({ matches }: { matches: boolean }) =>
        handleMatch(matches);
      if (mediaQueryList.matches) {
        handleMatch(mediaQueryList.matches);
      }
      mediaQueryList.addEventListener('change', listener);
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }, []);

    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (
          event.key === 'Escape' ||
          event.key === 'Esc' ||
          event.keyCode === 27
        ) {
          setCollapsed(true);
        }
      };

      const targetElement = document.body;
      if (isFocusTrap) {
        targetElement.addEventListener('keyup', handleEscape);
      } else {
        targetElement.removeEventListener('keyup', handleEscape);
      }

      return () => {
        targetElement.removeEventListener('keyup', handleEscape);
      };
    }, [isFocusTrap]);

    const handleClickOutside = () => {
      if (!isCollapsed && isFocusTrap) {
        setCollapsed(true);
      }
    };

    return (
      <div
        className={classnames('TwoColumnPanel', className, {
          'TwoColumnPanel--show': !isCollapsed,
          'TwoColumnPanel--hide': isCollapsed
        })}
        {...props}
        ref={ref}
      >
        <FocusTrap
          active={!isCollapsed && isFocusTrap}
          focusTrapOptions={{
            escapeDeactivates: true,
            allowOutsideClick: true,
            fallbackFocus: columnLeftRef.current as HTMLElement
          }}
          containerElements={[columnLeftRef.current as HTMLElement]}
        />
        <ClickOutsideListener
          onClickOutside={handleClickOutside}
          target={columnLeftRef.current as HTMLElement}
        />
        {showPanel ? ColumnLeftComponent : null}
        {ColumnRightComponent}
      </div>
    );
  }
);

TwoColumnPanel.displayName = 'TwoColumnPanel';

export default TwoColumnPanel;
