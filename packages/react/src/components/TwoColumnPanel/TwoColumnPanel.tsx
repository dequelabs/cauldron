import React, {
  forwardRef,
  useState,
  cloneElement,
  isValidElement,
  useRef,
  useLayoutEffect
} from 'react';
import { useId } from 'react-id-generator';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import ClickOutsideListener from '../ClickOutsideListener';
import ColumnLeft from './ColumnLeft';
import ColumnRight from './ColumnRight';
import classnames from 'classnames';
import SkipLink from '../SkipLink';
import useEscapeKey from '../../utils/useEscapeKey';
import useFocusTrap from '../../utils/useFocusTrap';

interface TwoColumnPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  initialCollapsed?: boolean;
  showCollapsedPanelLabel?: string;
  hideCollapsedPanelLabel?: string;
  skipLink?: SkipLink;
  collapsedMediaQuery?: string;
}

const TwoColumnPanel = forwardRef<HTMLDivElement, TwoColumnPanelProps>(
  (
    {
      className,
      children,
      initialCollapsed = false,
      showCollapsedPanelLabel = 'Show Panel',
      hideCollapsedPanelLabel = 'Hide Panel',
      skipLink = null,
      collapsedMediaQuery = '(max-width: 45rem)',
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setCollapsed] = useState(initialCollapsed);
    const [isFocusTrap, setIsFocusTrap] = useState(false);
    const [showPanel, setShowPanel] = useState(!initialCollapsed);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const columnLeftRef = useRef<HTMLDivElement>(null);
    const columnRightRef = useRef<HTMLDivElement>(null);

    const columnLeft = React.Children.toArray(children).find(
      (child) => (child as React.ReactElement<any>).type === ColumnLeft
    );

    const togglePanel = () => {
      const prefersReducedMotion =
        'matchMedia' in window &&
        typeof matchMedia === 'function' &&
        matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isCollapsed) {
        setShowPanel(true);
      } else if (prefersReducedMotion) {
        // Immediately collapse the panel as we do not need to wait for css
        // transitions to complete
        setShowPanel(false);
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

    // The ColumnLeftComponent will end up being a focus trap when < 720px
    // This component also gets unmounted when not visible meaning that any
    // aria relationships cannot be set to items inside the component since
    // they will not be present in the dom
    let ColumnLeftComponent;
    let columnLeftId;
    if (isValidElement(columnLeft)) {
      const ref = columnLeft.props.ref || columnLeftRef;
      const id = (columnLeftId =
        columnLeft.props.id || useId(undefined, 'sidebar-')[0]);
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
        { id, ref, tabIndex: -1 } as React.ComponentProps<typeof ColumnLeft>,
        children.map((child, index) =>
          cloneElement(child as React.ReactElement, {
            key: (child as React.ReactElement).key
              ? (child as React.ReactElement).key
              : `left-${index}`
          })
        )
      );
    }

    const columnRight = React.Children.toArray(children).find(
      (child) => (child as React.ReactElement<any>).type === ColumnRight
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
        { ref, tabIndex: -1 } as React.ComponentProps<typeof ColumnRight>,
        children.map((child, index) =>
          cloneElement(child as React.ReactElement, {
            key: (child as React.ReactElement).key
              ? (child as React.ReactElement).key
              : `right-${index}`
          })
        )
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
      const mediaQueryList = matchMedia(collapsedMediaQuery);
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

    useEscapeKey(
      {
        callback: () => setCollapsed(true),
        active: isFocusTrap
      },
      [setCollapsed]
    );

    const handleClickOutside = () => {
      if (!isCollapsed && isFocusTrap) {
        setCollapsed(true);
      }
    };

    useFocusTrap(columnLeftRef, {
      disabled: !showPanel || !isFocusTrap
    });

    return (
      <div
        className={classnames('TwoColumnPanel', className, {
          'TwoColumnPanel--show': !isCollapsed,
          'TwoColumnPanel--hide': isCollapsed
        })}
        {...props}
        ref={ref}
      >
        <>
          <ClickOutsideListener
            onClickOutside={handleClickOutside}
            target={columnLeftRef.current as HTMLElement}
          />
          {isCollapsed ? null : skipLink}
          {showPanel ? ColumnLeftComponent : null}
          {ColumnRightComponent}
        </>
      </div>
    );
  }
);

TwoColumnPanel.displayName = 'TwoColumnPanel';

export default TwoColumnPanel;
